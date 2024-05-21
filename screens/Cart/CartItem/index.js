import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CartItem = ({ data, _removeCartItem }) => {
  const [count, setCount] = useState(data?.count || 1);

  /**
   * @description this function is used to handle counts of food item to store in cart
   * @params {string} operation
   */
  const handleCounts = (operation) => {
    operation === "inc"
      ? setCount((prevState) => (prevState >= 5 ? 5 : prevState + 1))
      : setCount((prevState) => (prevState <= 1 ? 1 : prevState - 1));
  };

  

  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.firstContainer}>
        <Image
          style={styles.image}
          source={require("../../../assets/images/Noodlessss.jpg")}
        />
      </View>
      <View style={styles.secondContainer}>
        <Text style={styles.cartItemTitle}>{data?.name}</Text>
        <View style={styles.cartItemCount}>
          <Pressable
            style={styles.cartItemCountSign}
            onPress={() => handleCounts("dec")}
          >
            <Text style={styles.cartItemCountSignText}>-</Text>
          </Pressable>
          <Text style={styles.cartItemCountValue}>{count}</Text>
          <Pressable
            style={styles.cartItemCountSign}
            onPress={() => handleCounts("inc")}
          >
            <Text style={styles.cartItemCountSignText}>+</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.thirdContainer}>
        <TouchableOpacity style={styles.cartItemRemoveContainer} onPress={() => {_removeCartItem(data?._id)}}>
          <FontAwesomeIcon
            style={styles.cartItemRemove}
            icon={faXmark}
            size={18}
          />
        </TouchableOpacity>
        <Text style={styles.cartItemPrice}>₹ 40.00</Text>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartItemContainer: {
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  firstContainer: { flex: 0.4 },
  image: { height: 100, width: 105, resizeMode: "cover", borderRadius: 5 },
  secondContainer: {
    flex: 0.35,
    gap: 25,
  },
  cartItemTitle: {
    fontFamily: "Poppins-Medium",
    width: "100%",
    fontSize: 14,
  },
  cartItemCount: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: "#F2F5F8",
    alignItems: "center",
    padding: 3,
    borderRadius: 2.5,
    borderWidth: 1,
    width: 100,
  },
  cartItemCountSign: {
    flex: 1,
  },
  cartItemCountSignText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#FFC300",
    textAlign: "center",
  },
  cartItemCountValue: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    textAlign: "center",
  },

  thirdContainer: {
    flex: 0.3,
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "column",
    gap: 45,
  },
  cartItemRemoveContainer: {
    alignItems: "flex-end",
  },
  cartItemRemove: {
    textAlign: "right",
    color: "#FFC300",
  },
  cartItemPrice: {
    textAlign: "right",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
});
