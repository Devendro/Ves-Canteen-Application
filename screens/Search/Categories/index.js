"use client"

import { StyleSheet, Text, View, ActivityIndicator } from "react-native"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { CachedImage } from "../../../utils/cachedImage"
import Animated, { FadeInDown } from "react-native-reanimated"
import { TouchableOpacity } from "react-native-gesture-handler"
import { APIURL } from "../../../context/constants/api"

const Categories = ({ item, index, handleCategoriesSearchClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Animated.View entering={FadeInDown.duration(400).delay(index * 100)} style={styles.categoryContainer}>
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={() => handleCategoriesSearchClick(item?._id)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryContent}>
          <View style={styles.imageContainer}>
            {!imageLoaded && (
              <View style={styles.imagePlaceholder}>
                <ActivityIndicator size="small" color="#FFC300" />
              </View>
            )}
            <CachedImage
              uri={APIURL + item?.image}
              style={[styles.categoryImage, { opacity: imageLoaded ? 1 : 0 }]}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </View>

          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>{item?.name}</Text>
            <Text style={styles.categorySubtext}>Browse items</Text>
          </View>
        </View>

        <View style={styles.chevronContainer}>
          <FontAwesomeIcon icon={faChevronRight} size={14} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  categoryContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
  },

  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  categoryContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  imageContainer: {
    position: "relative",
    marginRight: 16,
  },

  categoryImage: {
    width: 40,
    height: 40,
    borderRadius: 10,
    resizeMode: "cover",
  },

  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 2,
  },

  categorySubtext: {
    fontSize: 11,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
  },

  chevronContainer: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
})

export default Categories
