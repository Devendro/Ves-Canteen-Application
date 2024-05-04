import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import Animated, { SlideInRight } from "react-native-reanimated";
import { CachedImage } from "../../../utils/cachedImage";

const CategoryItem = ({
  item,
  index,
  _updatedSelectedCategory,
  selectedCategory,
  navigation
}) => {
  return (
    <Animated.View entering={SlideInRight.delay(index * 150).duration(300).springify().damping(16)}>
      <TouchableWithoutFeedback
        onPress={() => {
          _updatedSelectedCategory(item?._id);
        }}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
            height: 175,
            marginTop: 20,
            width: 97,
            flexDirection: "column",
            backgroundColor:
              selectedCategory == item?._id ? "#FFC300" : "white",
            borderRadius: 20,
            padding: 19,
            marginBottom: 27,
            marginLeft: 10,
            marginRight: 4,
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
          <CachedImage
            uri = {"http://192.168.0.107:4000" + item.image }
            style={{ width: 50, height: 50 }}
          />
          <Text
            style={{
              fontSize: 14,
              color: selectedCategory == item?._id ? "white" : "black",
              // fontWeight: "bold",
              fontFamily: "Poppins-Medium",
              textAlign: "center",
            }}
          >
            {item?.name}
          </Text>
          <FontAwesomeIcon
            icon={faCircleChevronRight}
            size={20}
            color={selectedCategory == item?._id ? "white" : "black"}
          />
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({});
