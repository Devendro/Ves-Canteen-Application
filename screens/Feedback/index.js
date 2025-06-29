"use client"

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faStar,
  faArrowLeft,
  faPaperPlane,
  faLightbulb,
  faBug,
  faHeart,
  faComment,
  faUser,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { useNavigation } from "@react-navigation/native"

const Feedback = () => {
  const navigation = useNavigation()
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    category: "",
    subject: "",
    message: "",
    name: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState(null)

  const feedbackCategories = [
    {
      key: "general",
      label: "General Feedback",
      icon: faComment,
      color: "#3B82F6",
      description: "Share your overall experience",
    },
    {
      key: "suggestion",
      label: "Suggestion",
      icon: faLightbulb,
      color: "#F59E0B",
      description: "Ideas for improvement",
    },
    {
      key: "bug",
      label: "Report Bug",
      icon: faBug,
      color: "#EF4444",
      description: "Technical issues or problems",
    },
    {
      key: "appreciation",
      label: "Appreciation",
      icon: faHeart,
      color: "#10B981",
      description: "Compliments and praise",
    },
  ]

  const handleRatingPress = (rating) => {
    setFeedbackData((prev) => ({
      ...prev,
      rating: rating,
    }))
  }

  const handleCategorySelect = (category) => {
    setFeedbackData((prev) => ({
      ...prev,
      category: category,
    }))
  }

  const handleInputChange = (field, value) => {
    setFeedbackData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const validateForm = () => {
    if (feedbackData.rating === 0) {
      Alert.alert("Rating Required", "Please select a rating before submitting.")
      return false
    }
    if (!feedbackData.category) {
      Alert.alert("Category Required", "Please select a feedback category.")
      return false
    }
    if (!feedbackData.subject.trim()) {
      Alert.alert("Subject Required", "Please enter a subject for your feedback.")
      return false
    }
    if (!feedbackData.message.trim()) {
      Alert.alert("Message Required", "Please enter your feedback message.")
      return false
    }
    if (!feedbackData.name.trim()) {
      Alert.alert("Name Required", "Please enter your name.")
      return false
    }
    if (!feedbackData.email.trim() || !/\S+@\S+\.\S+/.test(feedbackData.email)) {
      Alert.alert("Valid Email Required", "Please enter a valid email address.")
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      Alert.alert(
        "Thank You!",
        "Your feedback has been submitted successfully. We appreciate your input and will review it carefully.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ],
      )
    }, 2000)
  }

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} style={styles.starButton} onPress={() => handleRatingPress(i)}>
          <FontAwesomeIcon icon={faStar} size={32} color={i <= feedbackData.rating ? "#FFC300" : "#E5E7EB"} />
        </TouchableOpacity>,
      )
    }
    return stars
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

  const getSelectedCategory = () => {
    return feedbackCategories.find((cat) => cat.key === feedbackData.category)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Give Feedback</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rating Section */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>How was your experience?</Text>
            <Text style={styles.sectionSubtitle}>Your rating helps us improve our service</Text>

            <View style={styles.starsContainer}>{renderStars()}</View>
            <Text style={styles.ratingText}>{getRatingText(feedbackData.rating)}</Text>
          </Animated.View>

          {/* Category Selection */}
          <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.categorySection}>
            <Text style={styles.sectionTitle}>What type of feedback?</Text>
            <Text style={styles.sectionSubtitle}>Choose the category that best describes your feedback</Text>

            <View style={styles.categoriesGrid}>
              {feedbackCategories.map((category) => (
                <TouchableOpacity
                  key={category.key}
                  style={[styles.categoryCard, feedbackData.category === category.key && styles.categoryCardActive]}
                  onPress={() => handleCategorySelect(category.key)}
                >
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
                    <FontAwesomeIcon icon={category.icon} size={20} color={category.color} />
                  </View>
                  <Text
                    style={[styles.categoryLabel, feedbackData.category === category.key && styles.categoryLabelActive]}
                  >
                    {category.label}
                  </Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Feedback Form */}
          <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.formSection}>
            <Text style={styles.sectionTitle}>Tell us more</Text>

            {/* Subject Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject</Text>
              <View style={[styles.inputContainer, focusedField === "subject" && styles.inputFocused]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Brief summary of your feedback"
                  placeholderTextColor="#9CA3AF"
                  value={feedbackData.subject}
                  onChangeText={(text) => handleInputChange("subject", text)}
                  onFocus={() => setFocusedField("subject")}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#FFC300"
                />
              </View>
            </View>

            {/* Message Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Message</Text>
              <View style={[styles.textAreaContainer, focusedField === "message" && styles.inputFocused]}>
                <TextInput
                  style={styles.textArea}
                  placeholder="Share your detailed feedback, suggestions, or report any issues you've encountered..."
                  placeholderTextColor="#9CA3AF"
                  value={feedbackData.message}
                  onChangeText={(text) => handleInputChange("message", text)}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  multiline={true}
                  numberOfLines={5}
                  textAlignVertical="top"
                  selectionColor="#FFC300"
                  maxLength={1000}
                />
                <Text style={styles.characterCount}>{feedbackData.message.length}/1000</Text>
              </View>
            </View>

            {/* Contact Information */}
            <Text style={styles.contactTitle}>Contact Information</Text>
            <Text style={styles.contactSubtitle}>We may reach out for follow-up questions</Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Name</Text>
              <View style={[styles.inputContainer, focusedField === "name" && styles.inputFocused]}>
                <FontAwesomeIcon icon={faUser} size={16} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={feedbackData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  selectionColor="#FFC300"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={[styles.inputContainer, focusedField === "email" && styles.inputFocused]}>
                <FontAwesomeIcon icon={faEnvelope} size={16} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9CA3AF"
                  value={feedbackData.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#FFC300"
                />
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Submit Button */}
        <Animated.View entering={FadeInUp.delay(400).duration(300)} style={styles.bottomContainer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              size={16}
              color="#FFFFFF"
              style={[styles.submitIcon, isSubmitting && styles.submitIconDisabled]}
            />
            <Text style={[styles.submitButtonText, isSubmitting && styles.submitButtonTextDisabled]}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Feedback

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

  ratingSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },

  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
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

  categorySection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 16,
  },

  categoryCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },

  categoryCardActive: {
    borderColor: "#FFC300",
    backgroundColor: "#FFFBF0",
  },

  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
    textAlign: "center",
  },

  categoryLabelActive: {
    color: "#FFC300",
  },

  categoryDescription: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 16,
  },

  formSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 52,
  },

  inputFocused: {
    borderColor: "#FFC300",
    backgroundColor: "#FFFBF0",
  },

  inputIcon: {
    marginRight: 12,
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
    paddingVertical: 0,
  },

  textAreaContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    position: "relative",
  },

  textArea: {
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "Poppins-Regular",
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

  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
    marginTop: 8,
  },

  contactSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
  },

  bottomContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFC300",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },

  submitButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },

  submitIcon: {
    marginRight: 4,
  },

  submitIconDisabled: {
    color: "#9CA3AF",
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
