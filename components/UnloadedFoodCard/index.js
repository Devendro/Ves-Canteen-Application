import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);
const UnloadedFoodCard = ({ data, handleSheetChanges }) => {
  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
        backgroundColor: "#FFF",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,

        marginHorizontal: 10,
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
        marginBottom: 15,
      }}
    >
      <ShimmerPlaceHolder
        style={{
          width: "100%",
          height: 200,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      ></ShimmerPlaceHolder>
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
        <View style={{ gap: 5 }}>
          <ShimmerPlaceHolder
            visible={false}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 3,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                marginTop: 5,
                marginBottom: 2,
                fontFamily: "Poppins-Medium",
              }}
            >
              Any Name
            </Text>
          </ShimmerPlaceHolder>
          <ShimmerPlaceHolder
            visible={false}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 3,
            }}
          >
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
              ₹{data?.price}
            </Text>
          </ShimmerPlaceHolder>
        </View>
      </View>
    </View>
  );
};

export default UnloadedFoodCard;

const styles = StyleSheet.create({});
