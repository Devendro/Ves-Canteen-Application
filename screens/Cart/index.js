import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import Header from "../../components/Header";
import CartItem from "./CartItem";
import { useSelector, useDispatch } from "react-redux";
import {
  REMOVE_CART_ITEM,
  UPDATE_CART_ITEM,
} from "../../context/constants/cart";
import LottieView from "lottie-react-native";
import RazorpayCheckout from "react-native-razorpay";
import Toast from "react-native-toast-message";
import {
  createPayment,
  createPaymentOrder,
} from "../../context/actions/payment";
import {
  createOrder,
  updateOrderPaymentStatus,
} from "../../context/actions/order";
import Animated, { FadeInUp } from "react-native-reanimated";
import FloatingButton from "../../components/FloatingButton";

export default function Cart() {
  const cartData = useSelector((state) => state.cart.cartItems);
  console.log(cartData)
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderPlaced, setOrderPlaced] = useState();
  const [paymentConfirmed, setPaymentConfirmed] = useState();
  const dispatch = useDispatch();

  /**
   * @description this useEffect is used to update the total price count
   */
  useEffect(() => {
    calculateTotalPrice();
  }, [cartData]);

  /**
   * @description this function is used to remove food item from cart
   * @params {string} id
   */
  const removeCartItem = (id) => {
    dispatch({ type: REMOVE_CART_ITEM, data: id });
  };

  /**
   * @description this function is used to handle counts of food item to store in cart
   * @params {string} operation
   */
  const handleCounts = (operation, id) => {
    var data = JSON.parse(JSON.stringify(cartData));
    var index = data.findIndex((cartItem) => cartItem._id === id);

    if (operation === "inc") {
      data[index].count = data[index].count + 1;
    } else {
      data[index].count = data[index].count - 1;
    }

    dispatch({ type: UPDATE_CART_ITEM, data: data });
  };

  /**
   * @description this function is used to calculate the total price of the cart on the basis of item price and count
   * @params {string} operation
   */
  function calculateTotalPrice() {
    setTotalPrice(
      cartData.reduce((total, item) => {
        return total + item.count * item.price;
      }, 0)
    );
  }

  /**
   * @description this function is used to create and place order and payment
   */
  const placeOrder = () => {
    Toast.hide();
    setOrderPlaced(false);

    const orderData = {
      order: cartData.map(({ _id, count, note }) => ({
        food: _id,
        count,
        preparationNote: note,
      })),
      amount: totalPrice,
    };

    const handlePaymentResponse = (orderData, paymentData) => {
      setOrderPlaced(null);
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
      };

      RazorpayCheckout?.open(options)
        .then((data) => {
          setPaymentConfirmed(false);
          let updatedOrderData = {
            orderId: orderData.orderId,
            paymentSuccess: true,
            paymentId: data.razorpay_payment_id,
            amount: totalPrice,
          };
          dispatch(
            updateOrderPaymentStatus(updatedOrderData, (response) => {
              dispatch(
                createPayment(updatedOrderData, (res) => {
                  dispatch({ type: UPDATE_CART_ITEM, data: [] });
                  setTimeout(() => {
                    setPaymentConfirmed(null);
                    Toast.show({
                      type: "success",
                      text1: "Payment Successful",
                    });
                  }, 3500);
                })
              );
            })
          );
        })
        .catch((data) => {
          console.log(data)
          Toast.show({
            type: "error",
            text1: "Payment Not Completed",
          });
          setPaymentConfirmed(null);
        });
    };

    const handleOrderResponse = (orderresponse) => {
      dispatch(
        createPaymentOrder({ amount: totalPrice }, (paymentresponse) => {
          handlePaymentResponse(orderresponse, paymentresponse);
        })
      );
    };

    dispatch(createOrder(orderData, handleOrderResponse));
  };

  return (
    <View style={styles.cartContainer}>
      <StatusBar barStyle="dark-content" />
      {orderPlaced === false && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <LottieView
            style={{ height: "25%", width: "100%", alignItems: "center" }}
            source={require("../../assets/images/PlacingOrder.json")}
            autoPlay
            loop
          />
          <Text
            style={{
              textAlign: "center",
              fontFamily: "Poppins-SemiBold",
              fontSize: 20,
            }}
          >
            Placing Order
          </Text>
        </View>
      )}
      {paymentConfirmed === false && (
        <View style={{ flex: 1 }}>
          <LottieView
            style={{ height: "50%", width: "100%", marginTop: 120 }}
            source={require("../../assets/images/PaymentDone.json")}
            autoPlay
            loop={false}
          />
          <Animated.Text
            entering={FadeInUp.duration(500).delay(2500)}
            style={{
              textAlign: "center",
              marginTop: -85,
              fontFamily: "Poppins-SemiBold",
              fontSize: 20,
            }}
          >
            Order Confirmed
          </Animated.Text>
        </View>
      )}
      {orderPlaced !== false && paymentConfirmed !== false && (
        <View>
          <Header title={"Order Cart"} />
          <ScrollView>
            <View style={styles.cartItemsContainer}>
              {cartData && cartData.length > 0 ? (
                cartData.map((cartItem, key) => {
                  return (
                    <CartItem
                      key={key}
                      data={cartItem}
                      _removeCartItem={(id) => {
                        removeCartItem(id);
                      }}
                      _handleCounts={(operation, id) => {
                        handleCounts(operation, id);
                      }}
                    />
                  );
                })
              ) : (
                <View>
                  <LottieView
                    style={{
                      height: 300,
                      width: "100%",
                      resizeMode: "contain",
                    }}
                    source={require("../../assets/images/emptycart.json")}
                    autoPlay
                    loop
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "Poppins-Medium",
                      fontSize: 20,
                    }}
                  >
                    Cart is Empty
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.priceCalculationContainer}>
              <View style={styles.price}>
                <Text style={styles.priceTitle}>Item Total</Text>
                <Text style={styles.priceAmount}>
                  ₹{" "}
                  {(
                    Math.round((totalPrice * 100) / 100) -
                    totalPrice * 0.18
                  ).toFixed(2)}
                </Text>
              </View>
              <View style={styles.price}>
                <Text style={styles.priceTitle}>CGST</Text>
                <Text style={styles.priceAmount}>
                  ₹ {(totalPrice * 0.09).toFixed(2)}
                </Text>
              </View>
              <View style={styles.price}>
                <Text style={styles.priceTitle}>SGST</Text>
                <Text style={styles.priceAmount}>
                  ₹ {(totalPrice * 0.09).toFixed(2)}
                </Text>
              </View>
              <View style={styles.total}>
                <Text style={styles.totalTitle}>Total</Text>
                <Text style={styles.totalAmount}>
                  ₹ {totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
      {orderPlaced !== false && paymentConfirmed !== false && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={placeOrder} style={styles.orderButton} disabled={!cartData || cartData.length == 0}>
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* <FloatingButton/> */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    paddingBottom: 35,
  },
  head: {
    marginHorizontal: 90,
    fontSize: 16,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins-Medium",
  },
  cartItemsContainer: {
    borderRadius: 10,
    padding: 15,
    gap: 15,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  priceCalculationContainer: {
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    padding: 15,
    marginBottom: 65,
  },
  price: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 17,
  },
  priceTitle: { fontFamily: "Poppins-Medium", fontSize: 14, color: "#667C8A" },
  priceAmount: { fontFamily: "Poppins-Medium", fontSize: 14 },
  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    // marginBottom: 17,
  },
  totalTitle: { fontFamily: "Poppins-Medium", fontSize: 18 },
  totalAmount: { fontFamily: "Poppins-Medium", fontSize: 18 },
  orderButton: {
    backgroundColor: "#FFC300",
    fontSize: 17,
    fontFamily: "Poppins-Medium",
    textAlign: "right",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    textAlign: "center",
  },
});
