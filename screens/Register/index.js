"use client"

import { useState, useEffect } from "react"
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native"
import { faEnvelope, faEye, faEyeSlash, faLock, faUser } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { useNavigation } from "@react-navigation/native"
import { useDispatch } from "react-redux"
import { register } from "../../context/actions/user"
import Toast from "react-native-toast-message"
import PushNotification from "../../PushNotification"
import LoadingOverlay from "../LoadingOverlay"
import { validateName, validateEmail, validatePassword, confirmPasswordMatches } from "./validation.js"

const FloatingIcon = ({ children, style, delay = 0 }) => {
  const translateY = useSharedValue(0)

  useEffect(() => {
    translateY.value = withRepeat(withTiming(10, { duration: 3000 + delay }), -1, true)
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    }
  })

  return <Animated.Text style={[style, animatedStyle]}>{children}</Animated.Text>
}

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [focusedField, setFocusedField] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [touched, setTouched] = useState({})

  const dispatch = useDispatch()
  const navigation = useNavigation()

  const buttonScale = useSharedValue(1)

  const handleTextChange = (fieldname, text) => {
    setRegisterData((prevState) => ({
      ...prevState,
      [fieldname]: text,
    }))
  }

  const validateField = (fieldname, value) => {
    let error = null

    if (fieldname === "name") {
      if (!validateName(value)) {
        error = "Please enter a valid name"
      }
    }

    if (fieldname === "email") {
      if (!validateEmail(value)) {
        error = "Please enter a valid email"
      }
    }

    if (fieldname === "password") {
      if (!validatePassword(value)) {
        error = "Password must contain uppercase, lowercase, number and special character"
      }
    }

    if (fieldname === "confirmPassword") {
      if (!confirmPasswordMatches(registerData.password, value)) {
        error = "Passwords do not match"
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      [fieldname]: error,
    }))

    return !error
  }

  const handleBlur = (fieldname) => {
    setFocusedField(null)
    setTouched((prev) => ({ ...prev, [fieldname]: true }))
    validateField(fieldname, registerData[fieldname])
  }

  const validateForm = () => {
    const nameValid = validateField("name", registerData.name)
    const emailValid = validateField("email", registerData.email)
    const passwordValid = validateField("password", registerData.password)
    const confirmPasswordValid = validateField("confirmPassword", registerData.confirmPassword)
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    return nameValid && emailValid && passwordValid && confirmPasswordValid
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    if (registerData.password !== registerData.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password mismatch",
      })
      return
    }

    try {
      const notificationToken = await PushNotification()
      setLoading(true)

      dispatch(
        register({ ...registerData, notificationToken }, (response) => {
          setLoading(false)
          if (!response.error) {
            Toast.show({
              type: "success",
              text1: "Account created successfully! 🎉",
            })
            navigation.replace("Home")
          } else {
            Toast.show({
              type: "error",
              text1: "Invalid Details",
            })
          }
        }),
      )
    } catch (error) {
      setLoading(false)
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      })
    }
  }

  const handleButtonPress = () => {
    buttonScale.value = withSpring(0.95, { duration: 100 })
    setTimeout(() => {
      buttonScale.value = withSpring(1, { duration: 100 })
    }, 100)
    handleRegister()
  }

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    }
  })

  const isFormValid =
    registerData.name.trim() &&
    registerData.email.trim() &&
    registerData.password.trim() &&
    registerData.confirmPassword.trim() &&
    !formErrors.name &&
    !formErrors.email &&
    !formErrors.password &&
    !formErrors.confirmPassword

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      {loading && <LoadingOverlay />}

      {/* Background Food Icons */}
      <View style={styles.backgroundContainer}>
        <FloatingIcon style={styles.backgroundIcon1} delay={0}>
          🍕
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon2} delay={500}>
          🍔
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon3} delay={1000}>
          🌮
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon4} delay={1500}>
          🍜
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon5} delay={2000}>
          🥗
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon6} delay={2500}>
          🍰
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon7} delay={3000}>
          🥙
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon8} delay={500}>
          🍱
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon9} delay={1200}>
          🍝
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon10} delay={1800}>
          🥘
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon11} delay={2200}>
          🍣
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon12} delay={2800}>
          🌯
        </FloatingIcon>
      </View>

      {/* Decorative Rings */}
      <View style={styles.decorativeContainer}>
        <View style={styles.topLeftRing} />
        <View style={styles.topRightRing} />
        <View style={styles.bottomLeftRing} />
        <View style={styles.bottomRightRing} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <View style={styles.content}>
          {/* Logo and Brand */}
          <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.brandContainer}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🍔</Text>
            </View>
            <Text style={styles.brandName}>
              Vesit <Text style={styles.brandNameAccent}>Canteen</Text>
            </Text>
            <Text style={styles.brandTagline}>Join our food community today</Text>
          </Animated.View>

          {/* Small Welcome Message */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.welcomeContainer}>
            <View style={styles.welcomeContainer}>
              {/* <Text style={styles.welcomeTitle}>
                              Welcome <Text style={styles.welcomeTitleAccent}>Back</Text>
                            </Text> */}
              <Text style={styles.welcomeSubtitle}>Sign in to continue!</Text>
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "name" && styles.inputFocused,
                  formErrors.name && touched.name && styles.inputError,
                ]}
              >
                <FontAwesomeIcon
                  icon={faUser}
                  size={16}
                  color={formErrors.name && touched.name ? "#FF4757" : focusedField === "name" ? "#FFC300" : "#AAAAAA"}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your full name"
                  placeholderTextColor="#AAAAAA"
                  value={registerData.name}
                  onChangeText={(text) => handleTextChange("name", text)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => handleBlur("name")}
                  autoCapitalize="words"
                  selectionColor="#FFC300"
                />
              </View>
              {formErrors.name && touched.name && <Text style={styles.errorText}>{formErrors.name}</Text>}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "email" && styles.inputFocused,
                  formErrors.email && touched.email && styles.inputError,
                ]}
              >
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size={16}
                  color={
                    formErrors.email && touched.email ? "#FF4757" : focusedField === "email" ? "#FFC300" : "#AAAAAA"
                  }
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#AAAAAA"
                  value={registerData.email}
                  onChangeText={(text) => handleTextChange("email", text)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => handleBlur("email")}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="#FFC300"
                />
              </View>
              {formErrors.email && touched.email && <Text style={styles.errorText}>{formErrors.email}</Text>}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "password" && styles.inputFocused,
                  formErrors.password && touched.password && styles.inputError,
                ]}
              >
                <FontAwesomeIcon
                  icon={faLock}
                  size={16}
                  color={
                    formErrors.password && touched.password
                      ? "#FF4757"
                      : focusedField === "password"
                        ? "#FFC300"
                        : "#AAAAAA"
                  }
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Create a password"
                  placeholderTextColor="#AAAAAA"
                  value={registerData.password}
                  onChangeText={(text) => handleTextChange("password", text)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => handleBlur("password")}
                  secureTextEntry={!showPassword}
                  selectionColor="#FFC300"
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword(!showPassword)}>
                  <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} size={16} color="#AAAAAA" />
                </TouchableOpacity>
              </View>
              {formErrors.password && touched.password && <Text style={styles.errorText}>{formErrors.password}</Text>}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  focusedField === "confirmPassword" && styles.inputFocused,
                  formErrors.confirmPassword && touched.confirmPassword && styles.inputError,
                ]}
              >
                <FontAwesomeIcon
                  icon={faLock}
                  size={16}
                  color={
                    formErrors.confirmPassword && touched.confirmPassword
                      ? "#FF4757"
                      : focusedField === "confirmPassword"
                        ? "#FFC300"
                        : "#AAAAAA"
                  }
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Confirm your password"
                  placeholderTextColor="#AAAAAA"
                  value={registerData.confirmPassword}
                  onChangeText={(text) => handleTextChange("confirmPassword", text)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => handleBlur("confirmPassword")}
                  secureTextEntry={!showConfirmPassword}
                  selectionColor="#FFC300"
                />
                <TouchableOpacity style={styles.eyeButton} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} size={16} color="#AAAAAA" />
                </TouchableOpacity>
              </View>
              {formErrors.confirmPassword && touched.confirmPassword && (
                <Text style={styles.errorText}>{formErrors.confirmPassword}</Text>
              )}
            </View>

            {/* Register Button */}
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[styles.registerButton, !isFormValid && styles.registerButtonDisabled]}
                onPress={handleButtonPress}
                disabled={!isFormValid || loading}
                activeOpacity={1}
              >
                <Text style={[styles.registerButtonText, !isFormValid && styles.registerButtonTextDisabled]}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.replace("Login")}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  backgroundIcon1: {
    position: "absolute",
    fontSize: 28,
    opacity: 0.12,
    top: 80,
    left: 20,
    transform: [{ rotate: "-15deg" }],
  },

  backgroundIcon2: {
    position: "absolute",
    fontSize: 32,
    opacity: 0.15,
    top: 160,
    right: 30,
    transform: [{ rotate: "20deg" }],
  },

  backgroundIcon3: {
    position: "absolute",
    fontSize: 26,
    opacity: 0.1,
    top: 280,
    left: 40,
    transform: [{ rotate: "10deg" }],
  },

  backgroundIcon4: {
    position: "absolute",
    fontSize: 30,
    opacity: 0.13,
    top: 380,
    right: 25,
    transform: [{ rotate: "-10deg" }],
  },

  backgroundIcon5: {
    position: "absolute",
    fontSize: 24,
    opacity: 0.09,
    top: 480,
    left: 35,
    transform: [{ rotate: "25deg" }],
  },

  backgroundIcon6: {
    position: "absolute",
    fontSize: 28,
    opacity: 0.11,
    top: 580,
    right: 45,
    transform: [{ rotate: "-20deg" }],
  },

  backgroundIcon7: {
    position: "absolute",
    fontSize: 26,
    opacity: 0.08,
    top: 680,
    left: 50,
    transform: [{ rotate: "15deg" }],
  },

  backgroundIcon8: {
    position: "absolute",
    fontSize: 30,
    opacity: 0.12,
    top: 240,
    right: 60,
    transform: [{ rotate: "-25deg" }],
  },

  backgroundIcon9: {
    position: "absolute",
    fontSize: 24,
    opacity: 0.1,
    top: 120,
    left: 70,
    transform: [{ rotate: "30deg" }],
  },

  backgroundIcon10: {
    position: "absolute",
    fontSize: 28,
    opacity: 0.11,
    top: 340,
    right: 15,
    transform: [{ rotate: "-30deg" }],
  },

  backgroundIcon11: {
    position: "absolute",
    fontSize: 26,
    opacity: 0.09,
    top: 440,
    left: 15,
    transform: [{ rotate: "35deg" }],
  },

  backgroundIcon12: {
    position: "absolute",
    fontSize: 32,
    opacity: 0.13,
    top: 540,
    right: 20,
    transform: [{ rotate: "-35deg" }],
  },

  decorativeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },

  topLeftRing: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 195, 0, 0.15)",
    top: -20,
    left: -30,
  },

  topRightRing: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 195, 0, 0.12)",
    top: 40,
    right: -20,
  },

  bottomLeftRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 195, 0, 0.10)",
    bottom: 100,
    left: -40,
  },

  bottomRightRing: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255, 195, 0, 0.08)",
    bottom: 200,
    right: -30,
  },

  keyboardAvoidingView: {
    flex: 1,
    zIndex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    justifyContent: "center",
  },

  brandContainer: {
    alignItems: "center",
    marginBottom: 30,
  },

  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFC300",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  logoEmoji: {
    fontSize: 28,
  },

  brandName: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1A1A1A",
    fontFamily: "Poppins-Black",
    letterSpacing: -1,
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  brandNameAccent: {
    color: "#FFC300",
    fontWeight: "900",
    fontFamily: "Poppins-Black",
  },

  brandTagline: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    fontStyle: "italic",
  },

  welcomeContainer: {
    alignItems: "center",
    marginBottom: 24,
  },

  welcomeMessage: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },

  formContainer: {
    width: "100%",
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 48,
  },

  inputFocused: {
    borderColor: "#FFC300",
    backgroundColor: "#FFFBF0",
  },

  inputError: {
    borderColor: "#FF4757",
    backgroundColor: "#FEF2F2",
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: "#333333",
    fontFamily: "Poppins-Medium",
    paddingVertical: 0,
    marginLeft: 12,
  },

  eyeButton: {
    padding: 8,
  },

  registerButton: {
    backgroundColor: "#FFC300",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    marginTop: 8,
  },

  registerButtonDisabled: {
    backgroundColor: "#F0F0F0",
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },

  registerButtonTextDisabled: {
    color: "#AAAAAA",
  },

  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  loginText: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },

  loginLink: {
    color: "#FFC300",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },

  errorText: {
    color: "#FF4757",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginTop: 4,
    marginLeft: 4,
  },

  welcomeContainer: {
    alignItems: "center",
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    fontFamily: "Poppins-ExtraBold",
    marginBottom: 6,
    letterSpacing: -0.5,
    textShadowColor: "rgba(0, 0, 0, 0.05)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },

  welcomeTitleAccent: {
    color: "#FFC300",
    fontWeight: "700",
    fontFamily: "Poppins-ExtraBold",
  },

  welcomeSubtitle: {
    fontSize: 15,
    color: "#718096",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    lineHeight: 20,
  },
})

export default Register
