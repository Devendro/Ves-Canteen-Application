import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { CachedImage } from "../../../utils/cachedImage";
import Animated, { FadeInDown, SlideInRight } from "react-native-reanimated";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { APIURL } from "../../../context/constants/api";

const Categories = ({ item, index, handleCategoriesSearchClick }) => {
  return (
    <TouchableNativeFeedback onPress={() => {handleCategoriesSearchClick(item?._id)}}>
      <View style={styles.categoryCard}>
        <View style={styles.categoryHeading}>
          <CachedImage
            uri={APIURL + item?.image}
            style={{ width: 30, height: 30 }}
          />
          <Text style={styles.searchTitle}>{item?.name}</Text>
        </View>
        <FontAwesomeIcon icon={faChevronRight} color="#51636E" />
      </View>
    </TouchableNativeFeedback>
  );
};

export default Categories;

const styles = StyleSheet.create({
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    minHeight: 50,
    paddingLeft: 15,
    paddingRight: 20,
  },
  categoryHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  searchTitle: {
    fontSize: 13,
    paddingTop: 5,
    fontFamily: "Poppins-Medium",
    color: "#51636E",
  },
});
