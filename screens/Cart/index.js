"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from "react-native"
import { useSelector, useDispatch } from "react-redux"
import { useNavigation } from "@react-navigation/native"
import LottieView from "lottie-react-native"
import RazorpayCheckout from "react-native-razorpay"
import Toast from "react-native-toast-message"
import Animated, { FadeInUp, FadeInDown, SlideInUp } from "react-native-reanimated"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faShoppingCart, faReceipt, faCheckCircle, faArrowLeft, faShoppingBag } from "@fortawesome/free-solid-svg-icons"
import CartItem from "./CartItem"
import { REMOVE_CART_ITEM, UPDATE_CART_ITEM } from "../../context/constants/cart"
import { createPayment, createPaymentOrder } from "../../context/actions/payment"
import { createOrder, updateOrderPaymentStatus } from "../../context/actions/order"

const { width, height } = Dimensions.get("window")

export default function Cart() {
  const cartData = useSelector((state) => state.cart.cartItems)
  const userDetails = useSelector((state) => state?.user)
  const [totalPrice, setTotalPrice] = useState(0)
  const [orderPlaced, setOrderPlaced] = useState()
  const [paymentConfirmed, setPaymentConfirmed] = useState()
  const [loading, setLoading] = useState(false)
  const navigation = useNavigation()
  const dispatch = useDispatch()

  // Memoized calculations for performance
  const taxCalculations = useMemo(() => {
    const itemTotal = totalPrice / 1.18 // Remove tax to get base amount
    const cgst = itemTotal * 0.09
    const sgst = itemTotal * 0.09
    return {
      itemTotal: itemTotal.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      total: totalPrice.toFixed(2),
    }
  }, [totalPrice])

  const isCartEmpty = useMemo(() => !cartData || cartData.length === 0, [cartData])

  useEffect(() => {
    calculateTotalPrice()
  }, [cartData])

  const removeCartItem = useCallback(
    (id) => {
      dispatch({ type: REMOVE_CART_ITEM, data: id })
    },
    [dispatch],
  )

  const handleCounts = useCallback(
    (operation, id) => {
      const data = JSON.parse(JSON.stringify(cartData))
      const index = data.findIndex((cartItem) => cartItem._id === id)

      if (index !== -1) {
        if (operation === "inc") {
          data[index].count = Math.min(data[index].count + 1, 10)
        } else {
          data[index].count = Math.max(data[index].count - 1, 1)
        }
        dispatch({ type: UPDATE_CART_ITEM, data: data })
      }
    },
    [cartData, dispatch],
  )

  const calculateTotalPrice = useCallback(() => {
    const total = cartData.reduce((sum, item) => sum + item.count * item.price, 0)
    setTotalPrice(total)
  }, [cartData])

  const placeOrder = useCallback(() => {
    if (!userDetails?.loggedIn) {
      navigation.navigate("Login", { lastPage: "Cart" })
      return
    }

    Toast.hide()
    setLoading(true)
    setOrderPlaced(false)

    const orderData = {
      order: cartData.map(({ _id, count, notes }) => ({
        food: _id,
        count,
        preparationNote: notes,
      })),
      amount: totalPrice,
    }

    const handlePaymentResponse = (orderData, paymentData) => {
      setOrderPlaced(null)
      setLoading(false)

      const options = {
        description: "Order From VESIT",
        image: "https://i.imgur.com/3g7nmJC.jpg",
        currency: "INR",
        key: paymentData?.key_id,
        amount: paymentData?.amount,
        name: "Team Dev",
        order_id: paymentData?.order_id,
        prefill: {
          email: paymentData?.email,
          name: paymentData?.name,
        },
        theme: { color: "#FFC300" },
      }

      RazorpayCheckout?.open(options)
        .then((data) => {
          setPaymentConfirmed(false)
          const updatedOrderData = {
            orderId: orderData.orderId,
            paymentSuccess: true,
            paymentId: data.razorpay_payment_id,
            amount: totalPrice,
          }

          dispatch(
            updateOrderPaymentStatus(updatedOrderData, (response) => {
              dispatch(
                createPayment(updatedOrderData, (res) => {
                  dispatch({ type: UPDATE_CART_ITEM, data: [] })
                  setTimeout(() => {
                    setPaymentConfirmed(null)
                    Toast.show({
                      type: "success",
                      text1: "Payment Successful",
                    })
                  }, 3500)
                }),
              )
            }),
          )
        })
        .catch((data) => {
          Toast.show({
            type: "error",
            text1: "Payment Not Completed",
          })
          setPaymentConfirmed(null)
        })
    }

    const handleOrderResponse = (orderresponse) => {
      dispatch(
        createPaymentOrder({ amount: totalPrice }, (paymentresponse) => {
          handlePaymentResponse(orderresponse, paymentresponse)
        }),
      )
    }

    dispatch(createOrder(orderData, handleOrderResponse))
  }, [userDetails, cartData, totalPrice, navigation, dispatch])

  // Loading State - Order Placement
  if (orderPlaced === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <LottieView
            style={styles.loadingAnimation}
            source={require("../../assets/images/PlacingOrder.json")}
            autoPlay
            loop
          />
          <Text style={styles.loadingTitle}>Placing Your Order</Text>
          <Text style={styles.loadingSubtitle}>Please wait while we process your order...</Text>
          {loading && <ActivityIndicator size="large" color="#FFC300" style={{ marginTop: 20 }} />}
        </View>
      </SafeAreaView>
    )
  }

  // Success State - Payment Confirmed
  if (paymentConfirmed === false) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.successContainer}>
          <LottieView
            style={styles.successAnimation}
            source={require("../../assets/images/PaymentDone.json")}
            autoPlay
            loop={false}
          />
          <Animated.View entering={FadeInUp.duration(500).delay(2500)} style={styles.successContent}>
            <FontAwesomeIcon icon={faCheckCircle} size={48} color="#10B981" />
            <Text style={styles.successTitle}>Order Confirmed!</Text>
            <Text style={styles.successSubtitle}>Your delicious meal is on its way</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    )
  }

  // Main Cart Interface
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <FontAwesomeIcon icon={faShoppingCart} size={20} color="#FFC300" />
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.headerSpacer} />
      </Animated.View>

      {isCartEmpty ? (
        // Empty Cart State
        <Animated.View entering={FadeInUp.duration(600)} style={styles.emptyCartContainer}>
          <LottieView
            style={styles.emptyCartAnimation}
            source={require("../../assets/images/emptycart.json")}
            autoPlay
            loop
          />
          <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
          <Text style={styles.emptyCartSubtitle}>Add some delicious items to get started!</Text>
          <TouchableOpacity style={styles.browseButton} onPress={() => navigation.navigate("Foods")}>
            <FontAwesomeIcon icon={faShoppingBag} size={16} color="#FFFFFF" />
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInUp.duration(500)} style={styles.cartItemsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Order Items ({cartData.length})</Text>
              </View>

              {cartData.map((cartItem, index) => (
                <Animated.View key={cartItem._id} entering={FadeInUp.duration(400).delay(index * 100)}>
                  <CartItem data={cartItem} _removeCartItem={removeCartItem} _handleCounts={handleCounts} />
                </Animated.View>
              ))}
            </Animated.View>

            {/* Price Breakdown */}
            <Animated.View entering={FadeInUp.duration(500).delay(200)} style={styles.priceContainer}>
              <View style={styles.sectionHeader}>
                <FontAwesomeIcon icon={faReceipt} size={16} color="#6B7280" />
                <Text style={styles.sectionTitle}>Bill Details</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Item Total</Text>
                <Text style={styles.priceValue}>₹{taxCalculations.itemTotal}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>CGST (9%)</Text>
                <Text style={styles.priceValue}>₹{taxCalculations.cgst}</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>SGST (9%)</Text>
                <Text style={styles.priceValue}>₹{taxCalculations.sgst}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>₹{taxCalculations.total}</Text>
              </View>
            </Animated.View>
          </ScrollView>

          {/* Bottom Action Bar */}
          <Animated.View entering={SlideInUp.duration(400)} style={styles.bottomContainer}>
            <View style={styles.orderSummary}>
              <Text style={styles.orderSummaryLabel}>Total</Text>
              <Text style={styles.orderSummaryValue}>₹{taxCalculations.total}</Text>
            </View>
            <TouchableOpacity
              style={[styles.orderButton, isCartEmpty && styles.orderButtonDisabled]}
              onPress={placeOrder}
              disabled={isCartEmpty || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesomeIcon icon={faShoppingCart} size={16} color="#FFFFFF" />
                  <Text style={styles.orderButtonText}>Place Order</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        </>
      )}

      <Toast />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  // Header Styles
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  headerSpacer: {
    width: 40,
  },

  // Loading States
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },

  loadingAnimation: {
    height: 200,
    width: 200,
  },

  loadingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    textAlign: "center",
  },

  loadingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
    marginTop: 8,
    textAlign: "center",
  },

  successContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },

  successAnimation: {
    height: 250,
    width: 250,
  },

  successContent: {
    alignItems: "center",
    marginTop: -40,
  },

  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
    marginTop: 16,
    textAlign: "center",
  },

  successSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
    marginTop: 8,
    textAlign: "center",
  },

  // Empty Cart
  emptyCartContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },

  emptyCartAnimation: {
    height: 200,
    width: 200,
  },

  emptyCartTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
    marginTop: 20,
    textAlign: "center",
  },

  emptyCartSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
    marginTop: 8,
    textAlign: "center",
  },

  browseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFC300",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    gap: 6,
  },

  browseButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },

  // Main Content
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  // Cart Items
  cartItemsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  // Price Breakdown
  priceContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  priceLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
  },

  priceValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  // Bottom Action Bar
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  orderSummary: {
    flex: 1,
  },

  orderSummaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
  },

  orderSummaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  orderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFC300",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 6,
  },

  orderButtonDisabled: {
    backgroundColor: "#E2E8F0",
  },

  orderButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
  },
})
