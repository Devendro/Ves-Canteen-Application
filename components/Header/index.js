import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const Header = ({ title, showProfile=true }) => {
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
        onPress={() => { navigation.goBack() }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 75,
          justifyContent: "center",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </TouchableOpacity>
      <Text
        style={{
          flex: 1, // Allow text to take remaining space
          fontSize: 18,
          marginTop: 8,
          fontFamily: "Poppins-Medium",
          textAlign: "center", // Center text
        }}
      >
        {title}
      </Text>
      {<View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {showProfile ? <Image
          source={require("../../assets/images/actor.jpeg")}
          style={{ width: 40, height: 40, borderRadius: 10 }} // Changed border radius to half the height to make it circular
        /> : <View style={{ width: 40, height: 40, borderRadius: 10 }}></View>}
      </View>}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
