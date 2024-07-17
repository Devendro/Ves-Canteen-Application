import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { APIURL } from "../../../context/constants/api";

const OrderCard = ({ foodData }) => {
  function formatDate(dateString) {
    const date = new Date(dateString);
    const optionsDate = { year: "numeric", month: "long", day: "numeric" };
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString(undefined, optionsDate);
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime);

    return `${formattedDate} ${formattedTime}`;
  }
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.title}>Order - {foodData?.orderId}</Text>
      </View>
      {foodData?.orders &&
        foodData?.orders?.length > 0 &&
        foodData?.orders?.map((order, index) => {
          return (
            <View
              style={[
                styles.food,
                {
                  marginBottom: foodData?.orders?.length - 1 != index ? 10 : 0,
                },
              ]}
              key={order?._id}
            >
              <View style={styles.head}>
                <View>
                  <Text style={styles.foodOrder}>Order - {order?.orderId}</Text>
                </View>
                <View style={styles.foodStatusContainer}>
                  <FontAwesomeIcon
                    icon={faCircle}
                    color="green"
                    size={6}
                    style={{ marginHorizontal: 6, marginBottom: 3 }}
                  />
                  <Text style={styles.foodStatus}>{order?.orderStatus}</Text>
                </View>
              </View>
              <View style={styles.foodContainer}>
                <Image
                  source={{ uri: `${APIURL + order?.foodDetails?.image}` }}
                  style={styles.foodImage}
                />
                <View style={styles.foodDetails}>
                  <Text style={styles.foodName}>
                    {order?.foodDetails?.name} - {order?.count}
                  </Text>
                  <Text style={styles.foodCategory}>
                    {order?.foodDetails?.categoryDetails?.name}
                  </Text>
                  <Text style={styles.foodPrice}>
                    ₹{" "}
                    {parseInt(order?.foodDetails?.price) *
                      parseInt(order?.count)}
                  </Text>
                  <Text style={styles.orderDate}>
                    {formatDate(foodData?.createdAt)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    marginBottom: 5,
  },
  orderDate: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#999999",
  },
  food: {
    padding: 10,
    borderWidth: 0.7,
    borderRadius: 10,
    borderColor: "#DADADA",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  foodOrder: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  foodStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodStatus: {
    fontFamily: "Poppins-Medium",
    color: "green",
  },
  foodContainer: {
    flexDirection: "row",
  },
  foodImage: { height: 100, width: 105, resizeMode: "cover", borderRadius: 5 },
  foodDetails: {
    padding: 10,
  },
  foodName: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  foodCategory: {
    fontFamily: "Poppins-Medium",
    color: "#999999",
    fontSize: 12,
  },
  foodPrice: {
    fontFamily: "Poppins-Medium",
    color: "#999999",
    fontSize: 12,
  },
});
