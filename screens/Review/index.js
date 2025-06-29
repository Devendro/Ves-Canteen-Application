"use client"

import { useState } from "react"
import {
  Text,
  View,
  StyleSheet,
  StatusBar,
  Pressable,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faArrowLeft, faStar } from "@fortawesome/free-solid-svg-icons"
import { TouchableOpacity } from "react-native-gesture-handler"
import { APIURL } from "../../context/constants/api"
import { CachedImage } from "../../utils/cachedImage"
import { useDispatch } from "react-redux"
import { createRating } from "../../context/actions/rating"
import Toast from "react-native-toast-message"
import { useNavigation } from "@react-navigation/native"

export function Review({ route }) {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [reviewData, setReviewData] = useState({
    food: route?.params?.data?._id,
    orderId: route?.params?.orderId,
    rating: 0,
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReviewText = (text) => {
    setReviewData((prevState) => ({
      ...prevState,
      comment: text,
    }))
  }

  const handleRatingPress = (rating) => {
    setReviewData((prevState) => ({
      ...prevState,
      rating: rating,
    }))
  }

  const submitReview = () => {
    if (reviewData.rating === 0) {
      Toast.show({
        type: "error",
        text1: "Please select a rating",
      })
      return
    }

    setIsSubmitting(true)
    dispatch(
      createRating(reviewData, (res) => {
        setIsSubmitting(false)
        if (res) {
          Toast.show({
            type: "success",
            text1: "Thanks for your feedback! 🎉",
          })
          navigation.goBack()
        } else {
          Toast.show({
            type: "error",
            text1: "Failed to submit review",
          })
        }
      }),
    )
  }

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Poor"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Very Good"
      case 5:
        return "Excellent"
      default:
        return "Tap to rate"
    }
  }

  const isFormValid = reviewData.rating > 0

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rate & Review</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Food Item Card */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.foodCard}>
            <CachedImage uri={APIURL + route?.params?.data?.image} style={styles.foodImage} />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{route?.params?.data?.name}</Text>
              <Text style={styles.foodCategory}>{route?.params?.data?.categoryDetails?.name}</Text>
              <Text style={styles.foodPrice}>₹{route?.params?.data?.price}</Text>
            </View>
          </Animated.View>

          {/* Rating Section */}
          <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>How was your experience?</Text>
            <Text style={styles.sectionSubtitle}>Your rating helps others make better choices</Text>

            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  onPress={() => handleRatingPress(star)}
                  activeOpacity={0.7}
                >
                  <FontAwesomeIcon icon={faStar} size={32} color={star <= reviewData.rating ? "#FFC300" : "#E5E7EB"} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingText}>{getRatingText(reviewData.rating)}</Text>
          </Animated.View>

          {/* Comment Section */}
          <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.commentSection}>
            <Text style={styles.sectionTitle}>Share your thoughts</Text>
            <Text style={styles.sectionSubtitle}>Tell others what you liked or didn't like (optional)</Text>

            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={`What did you think about ${route?.params?.data?.name}?`}
                placeholderTextColor="#9CA3AF"
                value={reviewData.comment}
                onChangeText={handleReviewText}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
              <Text style={styles.characterCount}>{reviewData.comment.length}/500</Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Submit Button */}
        <Animated.View entering={FadeInUp.delay(400).duration(300)} style={styles.bottomContainer}>
          <Pressable
            onPress={submitReview}
            style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
            disabled={!isFormValid || isSubmitting}
          >
            <Text style={[styles.submitButtonText, !isFormValid && styles.submitButtonTextDisabled]}>
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Text>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>

      <Toast />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  placeholder: {
    width: 36,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flex: 1,
    padding: 16,
  },

  foodCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },

  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "cover",
  },

  foodInfo: {
    flex: 1,
    marginLeft: 16,
  },

  foodName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },

  foodCategory: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },

  foodPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFC300",
    fontFamily: "Poppins-Bold",
  },

  ratingSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 24,
  },

  starsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },

  starButton: {
    padding: 4,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
  },

  commentSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  textInputContainer: {
    position: "relative",
  },

  textInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 120,
    textAlignVertical: "top",
  },

  characterCount: {
    position: "absolute",
    bottom: 8,
    right: 12,
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
  },

  bottomContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  submitButton: {
    backgroundColor: "#FFC300",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  submitButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },

  submitButtonTextDisabled: {
    color: "#9CA3AF",
  },
})
