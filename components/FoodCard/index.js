import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { CachedImage } from "../../utils/cachedImage";
import { APIURL } from "../../context/constants/api";
import { createBottomSheetScrollableComponent } from "@gorhom/bottom-sheet";

const FoodCard = ({ data, handleSheetChanges }) => {
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
      <Pressable
        style={{
          width: "100%",
        }}
        onPress={() => {
          handleSheetChanges(0);
        }}
      >
        <CachedImage
          uri={APIURL + data.image}
          style={{
            alignItems: "center",
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
            {data?.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                color: "#667C8A",
                fontSize: 14,
                fontFamily: "Poppins-Medium",
              }}
            >
              {data?.categoryData?.name}
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
          </View>
        </View>
      </View>
    </View>
  );
};

export default FoodCard;

const styles = StyleSheet.create({});
