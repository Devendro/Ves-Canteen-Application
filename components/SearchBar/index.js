import { StyleSheet, Text, View, Platform, Pressable } from "react-native";
import Animated from "react-native-reanimated";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const SearchBar = () => {
  const navigation = useNavigation();
  return (
    <View>
      <View style={{ backgroundColor: "#fff" }}>
        <Pressable
          onPress={() => {
            navigation.navigate("Search");
          }}
        >
          <Animated.View
            sharedTransitionTag="search"
            style={{
              alignItems: "center",
              flexDirection: "row",
              marginTop: 5,
              backgroundColor: "white",
              borderRadius: 10,
              paddingHorizontal: 15,
              marginHorizontal: 10,
              ...Platform.select({
                ios: {
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.4,
                  shadowRadius: 6,
                },
                android: {
                  elevation: 4,
                },
              }),
            }}
          >
            <FontAwesomeIcon icon={faSearch} color="#667C8A" size={15} />

            <View
              selectionColor={"#667C8A"}
              showSoftInputOnFocus={false}
              style={{
                fontSize: 14,
                width: "100%",
                marginTop: 2,
                color: "#667C8A",
                padding: 10,
                fontFamily: "Poppins-Regular",
                textAlignVertical: "center",
              }}
              placeholder="Search our delicious Chinese samosa"
              placeholderTextColor="#667C8A"
            >
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  color: "#667C8A",
                  textAlignVertical: "center",
                  fontSize: 14,
                }}
              >
                Search our delicious Chinese samosa
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
