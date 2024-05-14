import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar
} from "react-native";
import Header from "../../components/Header";
import CartItem from "./CartItem";

export default function Cart() {
  return (
    <View style={styles.cartContainer}>
      <StatusBar barStyle="dark-content" />
      <Header title={"Order Cart"} />
      <ScrollView>
        <CartItem />
        <CartItem />
        <CartItem />

        <CartItem />

        <CartItem />

      </ScrollView>
      <View style={styles.horizontalLine}></View>
      <View style={styles.priceCalculation}>
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
      <View>
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
    backgroundColor: "#fff",
    paddingHorizontal: 10,
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
  horizontalLine: {
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "#DADADA",
    marginVertical: 25,
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
    marginTop: 25,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    textAlign: "center",
  },
});
