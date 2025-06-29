"use client"

import React, { useState, useCallback } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import Animated, { FadeInRight, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"
import { CachedImage } from "../../../utils/cachedImage"
import { APIURL } from "../../../context/constants/api"

const { width } = Dimensions.get("window")

const CategoryItem = React.memo(
  ({ item, index, _updatedSelectedCategory, selectedCategory, navigation, isLoading }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const scale = useSharedValue(1)
    const isSelected = selectedCategory === item?._id

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }))

    const handlePressIn = useCallback(() => {
      scale.value = withSpring(0.95, {
        damping: 15,
        stiffness: 300,
      })
    }, [])

    const handlePressOut = useCallback(() => {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      })
    }, [])

    const handlePress = useCallback(() => {
      _updatedSelectedCategory(item?._id)
    }, [_updatedSelectedCategory, item?._id])

    const handleNavigate = useCallback(() => {
      navigation.navigate("Foods", { category: item?._id })
    }, [navigation, item?._id])

    // Skeleton Loading
    if (isLoading) {
      return (
        <Animated.View entering={FadeInRight.delay(index * 100).duration(400)} style={styles.skeletonContainer}>
          <View style={styles.skeletonCard}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
              <View style={styles.skeletonText} />
              <View style={styles.skeletonSubtext} />
            </View>
          </View>
        </Animated.View>
      )
    }

    return (
      <Animated.View entering={FadeInRight.delay(index * 100).duration(400)} style={[animatedStyle, styles.container]}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={[styles.categoryCard, isSelected && styles.selectedCard]}
        >
          {/* Image Container */}
          <View style={styles.imageContainer}>
            <View style={[styles.imageWrapper, isSelected && styles.selectedImageWrapper]}>
              {!imageLoaded && (
                <View style={styles.imagePlaceholder}>
                  <ActivityIndicator size="small" color="#FFC300" />
                </View>
              )}
              <CachedImage
                uri={APIURL + (item?.image || "")}
                style={[styles.categoryImage, { opacity: imageLoaded ? 1 : 0 }]}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </View>

            {/* Item Count Badge */}
            <View style={[styles.countBadge, isSelected && styles.selectedCountBadge]}>
              <Text style={[styles.countText, isSelected && styles.selectedCountText]}>
                {item?.itemCount || Math.floor(Math.random() * 20) + 5}
              </Text>
            </View>
          </View>

          {/* Category Info */}
          <View style={styles.infoContainer}>
            <Text style={[styles.categoryName, isSelected && styles.selectedCategoryName]} numberOfLines={2}>
              {item?.name || "Category"}
            </Text>
            <Text style={[styles.categorySubtext, isSelected && styles.selectedCategorySubtext]}>
              {item?.itemCount || Math.floor(Math.random() * 20) + 5} items
            </Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={handleNavigate}
            style={[styles.actionButton, isSelected && styles.selectedActionButton]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <FontAwesomeIcon icon={faArrowRight} size={12} color={isSelected ? "#FFFFFF" : "#FFC300"} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    )
  },
)

export default CategoryItem

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    marginVertical: 4,
  },

  categoryCard: {
    width: 110,
    height: 130,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },

  selectedCard: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FFC300",
    borderWidth: 2,
    transform: [{ scale: 1.02 }],
  },

  // Image Section
  imageContainer: {
    alignItems: "center",
    position: "relative",
    marginBottom: 8,
  },

  imageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  selectedImageWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "rgba(255, 255, 255, 0.3)",
  },

  categoryImage: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
  },

  countBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#FFC300",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },

  selectedCountBadge: {
    backgroundColor: "#FFFFFF",
  },

  countText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
  },

  selectedCountText: {
    color: "#FFC300",
  },

  // Info Section
  infoContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },

  categoryName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginBottom: 2,
    lineHeight: 14,
  },

  selectedCategoryName: {
    color: "#B8860B",
    fontWeight: "700",
  },

  categorySubtext: {
    fontSize: 9,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },

  selectedCategorySubtext: {
    color: "#9CA3AF",
  },

  // Action Button
  actionButton: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 195, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 195, 0, 0.3)",
  },

  selectedActionButton: {
    backgroundColor: "#FFC300",
    borderColor: "#FFC300",
  },

  // Skeleton Styles
  skeletonContainer: {
    marginRight: 12,
    marginVertical: 4,
  },

  skeletonCard: {
    width: 110,
    height: 130,
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  skeletonImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
    marginBottom: 8,
  },

  skeletonContent: {
    alignItems: "center",
    gap: 4,
  },

  skeletonText: {
    width: 60,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E2E8F0",
  },

  skeletonSubtext: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F1F5F9",
  },
})
