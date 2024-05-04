import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Animated from "react-native-reanimated";

const PopularFoodItem = ({ navigation, handleSheetChanges }) => {
  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        backgroundColor: "#FFF",
        borderRadius: 15,

        marginHorizontal: 10,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        marginBottom: 17,
      }}
    >
      <Pressable
        style={{
          width: "100%",
        }}
        onPress={() => {
          handleSheetChanges(0)
        }}
      >
        <Animated.Image
          source={require("../../../assets/images/Noodlessss.jpg")}
          style={{
            alignItems: "center",
            // backgroundColor: "#FFC300",
            height: 200,
            width: "100%",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
          }}
        />
      </Pressable>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 10,
          marginBottom: 10,
          paddingHorizontal: 11,
          paddingBottom: 11,
          width: "100%",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 14,
              marginTop: 5,
              marginBottom: 2,
              fontFamily: "Poppins-Medium",
            }}
          >
            Schezwan Noodles
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "#667C8A",
                fontSize: 14,
                fontFamily: "Poppins-Medium",
              }}
            >
              Chinese
            </Text>
            <FontAwesomeIcon
              icon={faCircle}
              color="#667C8A"
              size={4}
              style={{ marginHorizontal: 6 }}
            />
            <Text
              style={{
                color: "#667C8A",
                fontSize: 14,
                fontFamily: "Poppins-Medium",
              }}
            >
              ₹40.00
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default PopularFoodItem;

const styles = StyleSheet.create({});
