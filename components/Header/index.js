import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title }) => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 10
      }}
    >
      <TouchableOpacity
      onPress={() => {navigation.push("Home")}}
        style={{
          width: 40,
          height: 40,
          borderRadius: 75,
          justifyContent: "center",
        }}
      >
        <Image
          source={require("../../assets/icons/gg_menu-right.png")}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      <Text
        style={{
          flex: 1, // Allow text to take remaining space
          fontSize: 18,
          marginTop: 10,
          fontFamily: "Poppins-Medium",
          textAlign: "center", // Center text
        }}
      >
        {title}
      </Text>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={require("../../assets/images/actor.jpeg")}
          style={{ width: 40, height: 40, borderRadius: 10 }} // Changed border radius to half the height to make it circular
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
