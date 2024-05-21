import React from "react";
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
import { REMOVE_CART_ITEM } from "../../context/constants/cart";
import LottieView from "lottie-react-native";

export default function Cart() {
  const cartData = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  /**
   * @description this function is used to remove food item from cart
   * @params {string} id
   */
  const removeCartItem = (id) => {
    dispatch({ type: REMOVE_CART_ITEM, data: id });
  };
  return (
    <View style={styles.cartContainer}>
      <StatusBar barStyle="dark-content" />
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
                />
              );
            })
          ) : (
            <View>
              <LottieView
                style={{ height: 300, width: "100%", resizeMode: "contain" }}
                source={require("../../assets/images/emptycart.json")}
                autoPlay
                loop
              />
              <Text style={{textAlign: "center", fontFamily: "Poppins-Medium", fontSize: 20}}>Cart is Empty</Text>
            </View>
          )}
        </View>
        <View style={styles.priceCalculationContainer}>
          <View style={styles.price}>
            <Text style={styles.priceTitle}>Item Total</Text>
            <Text style={styles.priceAmount}>₹ 40.00</Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceTitle}>CGST</Text>
            <Text style={styles.priceAmount}>₹ 40.00</Text>
          </View>
          <View style={styles.price}>
            <Text style={styles.priceTitle}>SGST</Text>
            <Text style={styles.priceAmount}>₹ 40.00</Text>
          </View>
          <View style={styles.total}>
            <Text style={styles.totalTitle}>Total</Text>
            <Text style={styles.totalAmount}>₹ 40.00</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.buttonText}>Place Order</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 27,
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
