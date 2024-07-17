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
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { height, width } from "@fortawesome/free-solid-svg-icons/fa0";
import { APIURL } from "../../../context/constants/api";

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

const CategoryItem = ({
  item,
  index,
  _updatedSelectedCategory,
  selectedCategory,
  navigation,
  isLoading,
}) => {
  return (
    <Animated.View
      entering={SlideInRight.delay(index * 150)
        .duration(300)
        .springify()
        .damping(16)}
    >
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
          {isLoading ? (
            <ShimmerPlaceHolder
              visible={!isLoading}
              style={{
                width: 60,
                height: 60,
                borderRadius: 50,
              }}
            ></ShimmerPlaceHolder>
          ) : (
            <CachedImage
              uri={APIURL + item.image}
              style={{ width: 50, height: 50 }}
            />
          )}

          <ShimmerPlaceHolder
            visible={!isLoading}
            style={{ width: "120%", borderRadius: 5 }}
          >
            <Text
              style={{
                fontSize: 14,
                color: selectedCategory == item?._id ? "white" : "black",
                fontFamily: "Poppins-Medium",
                textAlign: "center",
              }}
            >
              {item?.name}
            </Text>
          </ShimmerPlaceHolder>
          <ShimmerPlaceHolder
            visible={!isLoading}
            style={{ width: 20, height: 20, borderRadius: 50 }}
          >
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              size={20}
              color={selectedCategory == item?._id ? "white" : "black"}
            />
          </ShimmerPlaceHolder>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({});
