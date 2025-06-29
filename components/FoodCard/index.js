"use client"

import { StyleSheet, Text, View, Pressable, Dimensions } from "react-native"
import { faStar, faHeart, faLeaf, faFire, faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { CachedImage } from "../../utils/cachedImage"
import { APIURL } from "../../context/constants/api"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"

const { width } = Dimensions.get("window")

const FoodCard = ({ data, handleSheetChanges }) => {
  const scale = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Pressable
        style={styles.pressableContainer}
        onPress={() => {
          handleSheetChanges(0)
        }}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Image Section */}
        <View style={styles.imageSection}>
          <CachedImage uri={APIURL + data.image} style={styles.foodImage} />

          {/* Image Overlay Elements */}
          <View style={styles.imageOverlay}>
            {/* Veg/Non-veg Indicator */}
            <View style={styles.topLeftBadges}>
              <View style={[styles.vegBadge, { backgroundColor: data.veg ? "#4CAF50" : "#FF5722" }]}>
                <FontAwesomeIcon icon={data.veg ? faLeaf : faFire} size={8} color="#FFFFFF" />
              </View>
            </View>

            {/* Rating Badge */}
            <View style={styles.topRightBadges}>
              <View style={styles.ratingBadge}>
                <FontAwesomeIcon icon={faStar} size={8} color="#FFC300" />
                <Text style={styles.ratingText}>4.2</Text>
              </View>
            </View>

            {/* Heart Icon */}
            <View style={styles.heartContainer}>
              <Pressable style={styles.heartButton}>
                <FontAwesomeIcon icon={faHeart} size={12} color="rgba(255,255,255,0.8)" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.mainContent}>
            <View style={styles.textContent}>
              <Text style={styles.foodName} numberOfLines={2}>
                {data?.name}
              </Text>
              <Text style={styles.categoryText} numberOfLines={1}>
                {data?.categoryData?.name}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>₹{data?.price}</Text>
                {data?.originalPrice && data?.originalPrice > data?.price && (
                  <Text style={styles.originalPriceText}>₹{data?.originalPrice}</Text>
                )}
              </View>
            </View>

            {/* Add Button */}
            <View style={styles.addButtonContainer}>
              <Pressable style={styles.addButton}>
                <FontAwesomeIcon icon={faPlus} size={12} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Discount Badge (if applicable) */}
          {data?.originalPrice && data?.originalPrice > data?.price && (
            <View style={styles.discountContainer}>
              <Text style={styles.discountText}>
                {Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)}% OFF
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  )
}

export default FoodCard

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
  },

  pressableContainer: {
    width: "100%",
  },

  imageSection: {
    position: "relative",
    height: 180,
    width: "100%",
  },

  foodImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  topLeftBadges: {
    position: "absolute",
    top: 12,
    left: 12,
  },

  vegBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  topRightBadges: {
    position: "absolute",
    top: 12,
    right: 12,
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  ratingText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },

  heartContainer: {
    position: "absolute",
    bottom: 12,
    right: 12,
  },

  heartButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },

  contentSection: {
    padding: 16,
    position: "relative",
  },

  mainContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  textContent: {
    flex: 1,
    paddingRight: 12,
  },

  foodName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
    fontFamily: "Poppins-Bold",
    lineHeight: 20,
  },

  categoryText: {
    color: "#6B7280",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  priceText: {
    color: "#FFC300",
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
  },

  originalPriceText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    textDecorationLine: "line-through",
  },

  addButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFC300",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFC300",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  discountContainer: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: "#EF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },
})
