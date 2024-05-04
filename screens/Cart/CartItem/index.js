import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const CartItem = () => {
  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.firstContainer}>
        <Image
          style={styles.image}
          source={require("../../../assets/images/Noodlessss.jpg")}
        />
      </View>
      <View style={styles.secondContainer}>
        <Text style={styles.cartItemTitle}>Samosa Plate</Text>
        <View style={styles.cartItemCount}>
          <Text style={styles.cartItemCountSign}>-</Text>
          <Text style={styles.cartItemCountValue}>1</Text>
          <Text style={styles.cartItemCountSign}>+</Text>
        </View>
      </View>
      <View style={styles.thirdContainer}>
        <TouchableOpacity style={styles.cartItemRemoveContainer}>
          <FontAwesomeIcon style={styles.cartItemRemove} icon={faXmark} size={18} />
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
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 15,
    borderColor: "#DADADA",
    borderWidth: 0.8
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "#000",
    //     shadowOffset: {
    //       width: 0,
    //       height: 4,
    //     },
    //     shadowOpacity: 0.4,
    //     shadowRadius: 6,
    //   },
    //   android: {
    //     elevation: 1,
    //   },
    // }),
  },
  firstContainer: { flex: 0.4 },
  image: { height: 100, width: 105, resizeMode: "cover", borderRadius: 5 },
  secondContainer: {
    flex: 0.35,
    gap: 25
  },
  cartItemTitle: {
    fontFamily: "Poppins-Medium",
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
    gap: 45
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
