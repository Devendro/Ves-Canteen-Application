"use client"

import { useEffect, useRef, useState } from "react"
import { View, Text, StyleSheet, Pressable, Dimensions, Animated, ActivityIndicator, TextInput } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useDispatch } from "react-redux"
import { ADD_CART_ITEM } from "../../context/constants/cart"
import { CachedImage } from "../../utils/cachedImage"
import { APIURL } from "../../context/constants/api"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faStar,
  faLeaf,
  faFire,
  faPlus,
  faMinus,
  faShoppingCart,
  faCheck,
  faClock,
  faUtensils,
  faInfoCircle,
  faHeart,
} from "@fortawesome/free-solid-svg-icons"

const { width, height } = Dimensions.get("window")

const FoodDetail = ({ data, isBottomSheetClose, _handleLike }) => {
  const likeRef = useRef()
  const dispatch = useDispatch()
  const scrollViewRef = useRef()

  // State management
  const [liked, setLiked] = useState(data?.liked ? true : false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [itemCount, setItemCount] = useState(1)
  const [preparationNotes, setPreparationNotes] = useState("")
  const [imageLoaded, setImageLoaded] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)

  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current
  const countScale = useRef(new Animated.Value(1)).current
  const heartScale = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (isBottomSheetClose) {
      setItemCount(1)
      setLiked(data?.liked ? true : false)
      setAddedToCart(false)
      setPreparationNotes("")
      setShowFullDescription(false)
      setImageLoaded(false)
    } else {
      setLiked(data?.liked ? true : false)
    }
  }, [isBottomSheetClose, data?.liked])

  const handleLike = () => {
    // Heart animation
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start()

    if (liked) {
      likeRef?.current?.play(60, 0)
      _handleLike(false, data?._id)
    } else {
      likeRef?.current?.play(0, 60)
      _handleLike(true, data?._id)
    }
    setLiked(!liked)
  }

  const handleCounts = (operation) => {
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

    operation === "inc"
      ? setItemCount((prevState) => (prevState >= 10 ? 10 : prevState + 1))
      : setItemCount((prevState) => (prevState <= 1 ? 1 : prevState - 1))
  }

  const addItemToCart = (item) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    setAddedToCart(true)
    const cartObj = {
      ...item,
      count: itemCount,
      notes: preparationNotes,
    }
    dispatch({ type: ADD_CART_ITEM, data: cartObj })
  }

  const handlePreparationNoteChange = (text) => {
    setPreparationNotes(text)
  }

  const totalPrice = (data?.price * itemCount).toFixed(0)
  const imageUri = data?.image ? APIURL + data?.image : `https://picsum.photos/400/300?random=${data?._id}`

  return (
    <View style={styles.bottomSheetContainer} key={data?._id}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {!imageLoaded && (
              <View style={styles.imagePlaceholder}>
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#FFC300" />
                  <Text style={styles.loadingText}>Loading image...</Text>
                </View>
              </View>
            )}
            <CachedImage
              uri={imageUri}
              style={[styles.foodImage, { opacity: imageLoaded ? 1 : 0 }]}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />

            {/* Gradient Overlay */}
            <View style={styles.gradientOverlay} />

            {/* Image Overlay Content */}
            <View style={styles.imageOverlay}>
              <View style={styles.topBadges}>
                <View style={[styles.vegBadge, { backgroundColor: data?.veg ? "#4CAF50" : "#FF5722" }]}>
                  <FontAwesomeIcon icon={data?.veg ? faLeaf : faFire} size={8} color="#FFFFFF" />
                  <Text style={styles.vegText}>{data?.veg ? "VEG" : "NON-VEG"}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <FontAwesomeIcon icon={faUtensils} size={8} color="#FFC300" />
                  <Text style={styles.categoryText}>{data?.categoryData?.name}</Text>
                </View>
              </View>

              <Animated.View style={[styles.likeButton, { transform: [{ scale: heartScale }] }]}>
                <Pressable onPress={handleLike} style={styles.likeButtonInner}>
                  <FontAwesomeIcon icon={faHeart} size={16} color={liked ? "#EF4444" : "rgba(255,255,255,0.8)"} />
                </Pressable>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={styles.foodTitle}>{data?.name}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                <FontAwesomeIcon icon={faStar} size={10} color="#FFC300" />
                <Text style={styles.ratingValue}>4.2</Text>
                <Text style={styles.ratingCount}>(61)</Text>
              </View>
              <View style={styles.timeContainer}>
                <FontAwesomeIcon icon={faClock} size={10} color="#9CA3AF" />
                <Text style={styles.timeText}>15-20 min</Text>
              </View>
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.currentPrice}>₹{data?.price}</Text>
            {data?.originalPrice && <Text style={styles.originalPrice}>₹{data?.originalPrice}</Text>}
            {data?.originalPrice && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>
                  {Math.round(((data?.originalPrice - data?.price) / data?.originalPrice) * 100)}% OFF
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionSection}>
            <View style={styles.descriptionHeader}>
              <FontAwesomeIcon icon={faInfoCircle} size={12} color="#9CA3AF" />
              <Text style={styles.descriptionTitle}>About this item</Text>
            </View>
            <Text style={styles.description} numberOfLines={showFullDescription ? undefined : 3}>
              {data?.description ||
                "Delicious and freshly prepared with the finest ingredients. A perfect blend of flavors that will satisfy your taste buds and leave you craving for more."}
            </Text>
            {(data?.description?.length > 100 || (!data?.description && true)) && (
              <Pressable onPress={() => setShowFullDescription(!showFullDescription)} style={styles.readMoreButton}>
                <Text style={styles.readMoreText}>{showFullDescription ? "Show Less" : "Read More"}</Text>
              </Pressable>
            )}
          </View>

          {/* Preparation Notes */}
          <View style={styles.notesSection}>
            <View style={styles.notesHeader}>
              <FontAwesomeIcon icon={faUtensils} size={12} color="#9CA3AF" />
              <Text style={styles.notesTitle}>Special Instructions</Text>
              <Text style={styles.optionalText}>(Optional)</Text>
            </View>
            <TextInput
              onChangeText={handlePreparationNoteChange}
              style={styles.notesInput}
              placeholder="e.g., Extra spicy, no onions, less oil..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              value={preparationNotes}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <View style={styles.actionBarContent}>
          {/* Quantity Selector */}
          <Animated.View style={[styles.quantityContainer, { transform: [{ scale: countScale }] }]}>
            <Pressable
              onPress={() => handleCounts("dec")}
              style={[styles.quantityButton, itemCount <= 1 && styles.quantityButtonDisabled]}
              disabled={itemCount <= 1}
            >
              <FontAwesomeIcon icon={faMinus} size={12} color={itemCount <= 1 ? "#D1D5DB" : "#FFC300"} />
            </Pressable>
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{itemCount}</Text>
            </View>
            <Pressable
              onPress={() => handleCounts("inc")}
              style={[styles.quantityButton, itemCount >= 10 && styles.quantityButtonDisabled]}
              disabled={itemCount >= 10}
            >
              <FontAwesomeIcon icon={faPlus} size={12} color={itemCount >= 10 ? "#D1D5DB" : "#FFC300"} />
            </Pressable>
          </Animated.View>

          {/* Add to Cart Button */}
          <Animated.View style={[styles.addToCartContainer, { transform: [{ scale: buttonScale }] }]}>
            {!addedToCart ? (
              <Pressable style={styles.addToCartButton} onPress={() => addItemToCart(data)}>
                <FontAwesomeIcon icon={faShoppingCart} size={14} color="#FFFFFF" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
                <Text style={styles.totalPriceText}>₹{totalPrice}</Text>
              </Pressable>
            ) : (
              <View style={styles.addedToCartButton}>
                <FontAwesomeIcon icon={faCheck} size={14} color="#FFFFFF" />
                <Text style={styles.addedToCartText}>Added to Cart</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  bottomSheetContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    minHeight: height * 0.82,
  },

  scrollContent: {
    paddingBottom: 100,
  },

  // Image Section
  imageSection: {
    backgroundColor: "#F8F9FA",
    marginBottom: 6,
  },

  imageContainer: {
    height: 220, // Reduced height
    position: "relative",
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: "hidden",
  },

  foodImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingContainer: {
    alignItems: "center",
    gap: 8,
  },

  loadingText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontFamily: "Poppins-Medium",
  },

  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.15)",
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: "space-between",
  },

  topBadges: {
    flexDirection: "row",
    gap: 6,
  },

  vegBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },

  vegText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },

  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 3,
  },

  categoryText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },

  likeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.95)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  likeButtonInner: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  // Content Section
  contentSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  titleSection: {
    marginBottom: 12,
  },

  foodTitle: {
    fontSize: 18, // Reduced from 24
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
    marginBottom: 6,
    lineHeight: 22,
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },

  ratingValue: {
    fontSize: 11, // Reduced
    fontWeight: "600",
    color: "#B8860B",
    fontFamily: "Poppins-SemiBold",
  },

  ratingCount: {
    fontSize: 10, // Reduced
    color: "#9CA3AF",
    fontFamily: "Poppins-Medium",
  },

  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  timeText: {
    fontSize: 10, // Reduced
    color: "#9CA3AF",
    fontFamily: "Poppins-Medium",
  },

  // Price Section
  priceSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 6,
  },

  currentPrice: {
    fontSize: 22, // Reduced from 28
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  originalPrice: {
    fontSize: 14, // Reduced
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    fontFamily: "Poppins-Medium",
  },

  discountBadge: {
    backgroundColor: "#10B981",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },

  discountText: {
    color: "#FFFFFF",
    fontSize: 8, // Reduced
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },

  // Description Section
  descriptionSection: {
    marginBottom: 16,
  },

  descriptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },

  descriptionTitle: {
    fontSize: 13, // Reduced
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  description: {
    fontSize: 12, // Reduced
    color: "#6B7280",
    lineHeight: 18,
    fontFamily: "Poppins-Regular",
  },

  readMoreButton: {
    marginTop: 6,
  },

  readMoreText: {
    fontSize: 11, // Reduced
    color: "#FFC300",
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },

  // Notes Section
  notesSection: {
    marginBottom: 16,
  },

  notesHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  notesTitle: {
    fontSize: 13, // Reduced
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  optionalText: {
    fontSize: 10, // Reduced
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
  },

  notesInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    fontSize: 12, // Reduced
    color: "#374151",
    fontFamily: "Poppins-Regular",
    minHeight: 60, // Reduced
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  // Bottom Action Bar
  bottomActionBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  actionBarContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },

  // Quantity Selector
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },

  quantityButton: {
    width: 36, // Reduced
    height: 36, // Reduced
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  quantityButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },

  quantityDisplay: {
    width: 36, // Reduced
    height: 36, // Reduced
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
  },

  quantityText: {
    fontSize: 14, // Reduced
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  // Add to Cart Button
  addToCartContainer: {
    flex: 1,
  },

  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC300",
    paddingVertical: 12, // Reduced
    borderRadius: 12,
    gap: 6,
    shadowColor: "#FFC300",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  addToCartText: {
    fontSize: 14, // Reduced
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
  },

  totalPriceText: {
    fontSize: 14, // Reduced
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    marginLeft: 6,
  },

  addedToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 12, // Reduced
    borderRadius: 12,
    gap: 6,
  },

  addedToCartText: {
    fontSize: 14, // Reduced
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
  },
})

export default FoodDetail
