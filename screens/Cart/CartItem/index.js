"use client"

import { memo, useRef, useState } from "react"
import { StyleSheet, Text, View, Pressable, Dimensions, Animated, ActivityIndicator } from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faPlus, faMinus, faTrash, faLeaf, faFire } from "@fortawesome/free-solid-svg-icons"
import { CachedImage } from "../../../utils/cachedImage"
import { APIURL } from "../../../context/constants/api"

const { width } = Dimensions.get("window")

const CartItem = memo(({ data, _removeCartItem, _handleCounts }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const removeScale = useRef(new Animated.Value(1)).current
  const countScale = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  const handleRemove = () => {
    Animated.sequence([
      Animated.timing(removeScale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(removeScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      _removeCartItem(data?._id)
    })
  }

  const handleCountChange = (operation) => {
    Animated.spring(countScale, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(countScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start()
    })
    _handleCounts(operation, data?._id)
  }

  const imageUri = data?.image ? APIURL + data?.image : `https://picsum.photos/400/300?random=${data?._id}`
  const totalItemPrice = (data?.price * data?.count).toFixed(0)

  return (
    <Animated.View
      style={[
        styles.cartItemContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Pressable
        style={styles.itemContent}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        android_ripple={{ color: "rgba(255, 195, 0, 0.1)" }}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          {!imageLoaded && (
            <View style={styles.imagePlaceholder}>
              <ActivityIndicator size="small" color="#FFC300" />
            </View>
          )}
          <CachedImage
            uri={imageUri}
            style={[styles.itemImage, { opacity: imageLoaded ? 1 : 0 }]}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />

          {/* Veg/Non-veg Badge */}
          <View style={styles.vegBadge}>
            <FontAwesomeIcon icon={data?.veg ? faLeaf : faFire} size={8} color={data?.veg ? "#4CAF50" : "#FF5722"} />
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>
              {data?.name}
            </Text>
            <Text style={styles.itemPrice}>₹{data?.price}</Text>
            {data?.notes && (
              <Text style={styles.itemNotes} numberOfLines={1}>
                Note: {data?.notes}
              </Text>
            )}
          </View>

          {/* Quantity Controls */}
          <Animated.View style={[styles.quantityContainer, { transform: [{ scale: countScale }] }]}>
            <Pressable
              style={[styles.quantityButton, data?.count <= 1 && styles.quantityButtonDisabled]}
              onPress={() => handleCountChange("dec")}
              disabled={data?.count <= 1}
            >
              <FontAwesomeIcon icon={faMinus} size={10} color={data?.count <= 1 ? "#D1D5DB" : "#FFC300"} />
            </Pressable>

            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{data?.count}</Text>
            </View>

            <Pressable
              style={[styles.quantityButton, data?.count >= 10 && styles.quantityButtonDisabled]}
              onPress={() => handleCountChange("inc")}
              disabled={data?.count >= 10}
            >
              <FontAwesomeIcon icon={faPlus} size={10} color={data?.count >= 10 ? "#D1D5DB" : "#FFC300"} />
            </Pressable>
          </Animated.View>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSection}>
          <Animated.View style={{ transform: [{ scale: removeScale }] }}>
            <Pressable style={styles.removeButton} onPress={handleRemove}>
              <FontAwesomeIcon icon={faTrash} size={14} color="#EF4444" />
            </Pressable>
          </Animated.View>

          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPrice}>₹{totalItemPrice}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  cartItemContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
  },

  itemContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },

  // Image Section
  imageContainer: {
    position: "relative",
    marginRight: 16,
  },

  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "cover",
  },

  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  vegBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Content Section
  contentSection: {
    flex: 1,
    justifyContent: "space-between",
  },

  itemDetails: {
    marginBottom: 12,
  },

  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
    lineHeight: 20,
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },

  itemNotes: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
    fontStyle: "italic",
  },

  // Quantity Controls
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignSelf: "flex-start",
  },

  quantityButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  quantityButtonDisabled: {
    backgroundColor: "#F8FAFC",
  },

  quantityDisplay: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FAFC",
  },

  // Actions Section
  actionsSection: {
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: 12,
  },

  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  totalPriceContainer: {
    alignItems: "center",
  },

  totalPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },
})

export default CartItem
