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
import { faEnvelope, faEye, faEyeSlash, faLock } from "@fortawesome/free-solid-svg-icons"
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
import { login } from "../../context/actions/user"
import Toast from "react-native-toast-message"
import PushNotification from "../../PushNotification"
import LoadingOverlay from "../LoadingOverlay"

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

const Login = ({ route }) => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [focusedField, setFocusedField] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [touched, setTouched] = useState({})

  const dispatch = useDispatch()
  const navigation = useNavigation()

  const buttonScale = useSharedValue(1)

  const handleTextChange = (fieldname, text) => {
    setLoginData((prevState) => ({
      ...prevState,
      [fieldname]: text,
    }))
  }

  const validateField = (fieldname, value) => {
    let error = null

    if (fieldname === "email") {
      if (!value.trim()) {
        error = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Please enter a valid email"
      }
    }

    if (fieldname === "password") {
      if (!value.trim()) {
        error = "Password is required"
      } else if (value.length < 6) {
        error = "Password too short"
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
    validateField(fieldname, loginData[fieldname])
  }

  const validateForm = () => {
    const emailValid = validateField("email", loginData.email)
    const passwordValid = validateField("password", loginData.password)
    setTouched({ email: true, password: true })
    return emailValid && passwordValid
  }

  const handleLogin = async () => {
    if (!validateForm()) return

    try {
      const notificationToken = await PushNotification()
      setLoading(true)

      dispatch(
        login({ ...loginData, notificationToken }, (res) => {
          setLoading(false)
          if (!res.errors) {
            Toast.show({
              type: "success",
              text1: "Welcome back! 🎉",
            })
            route?.params?.lastPage ? navigation.replace(route.params.lastPage) : navigation.replace("Home")
          } else {

            Toast.show({
              type: "error",
              text1: "Invalid credentials",
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
    handleLogin()
  }

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }],
    }
  })

  const isFormValid = loginData.email.trim() && loginData.password.trim() && !formErrors.email && !formErrors.password

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="transparent"
        // translucent={true}
      />

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
        <FloatingIcon style={styles.backgroundIcon13} delay={800}>
          🥞
        </FloatingIcon>
        <FloatingIcon style={styles.backgroundIcon14} delay={1600}>
          🍖
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
            <Text style={styles.brandTagline}>Delicious meals delivered to your door</Text>
          </Animated.View>

          {/* Welcome Section with Separator */}
          <Animated.View entering={FadeInUp.delay(400).duration(600)} style={styles.welcomeSection}>
            <View style={styles.welcomeSeparator}>
              <View style={styles.separatorLine} />
              <View style={styles.separatorDot} />
              <View style={styles.separatorLine} />
            </View>

            <View style={styles.welcomeContainer}>
              {/* <Text style={styles.welcomeTitle}>
                  Welcome <Text style={styles.welcomeTitleAccent}>Back</Text>
                </Text> */}
              <Text style={styles.welcomeSubtitle}>Sign in to continue!</Text>
            </View>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.formContainer}>
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
                  placeholder="hi.kitbase@gmail.com"
                  placeholderTextColor="#AAAAAA"
                  value={loginData.email}
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
                  placeholder="••••••"
                  placeholderTextColor="#AAAAAA"
                  value={loginData.password}
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

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Forgot?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                style={[styles.loginButton, !isFormValid && styles.loginButtonDisabled]}
                onPress={handleButtonPress}
                disabled={!isFormValid || loading}
                activeOpacity={1}
              >
                <Text style={[styles.loginButtonText, !isFormValid && styles.loginButtonTextDisabled]}>
                  {loading ? "Signing In..." : "Login"}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.replace("Register")}>
                <Text style={styles.registerLink}>Sign up</Text>
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
    top: 100,
    left: 20,
    transform: [{ rotate: "-15deg" }],
  },

  backgroundIcon2: {
    position: "absolute",
    fontSize: 32,
    opacity: 0.15,
    top: 180,
    right: 30,
    transform: [{ rotate: "20deg" }],
  },

  backgroundIcon3: {
    position: "absolute",
    fontSize: 26,
    opacity: 0.1,
    top: 320,
    left: 40,
    transform: [{ rotate: "10deg" }],
  },

  backgroundIcon4: {
    position: "absolute",
    fontSize: 30,
    opacity: 0.13,
    top: 420,
    right: 25,
    transform: [{ rotate: "-10deg" }],
  },

  backgroundIcon5: {
    position: "absolute",
    fontSize: 24,
    opacity: 0.09,
    top: 520,
    left: 35,
    transform: [{ rotate: "25deg" }],
  },

  backgroundIcon6: {
    position: "absolute",
    fontSize: 28,
    opacity: 0.11,
    top: 620,
    right: 45,
    transform: [{ rotate: "-20deg" }],
  },

  backgroundIcon7: {
    position: "absolute",
    fontSize: 26,
    opacity: 0.08,
    top: 720,
    left: 50,
    transform: [{ rotate: "15deg" }],
  },

  backgroundIcon8: {
    position: "absolute",
    fontSize: 30,
    opacity: 0.12,
    top: 280,
    right: 60,
    transform: [{ rotate: "-25deg" }],
  },

  backgroundIcon9: {
    position: "absolute",
    fontSize: 24,
    opacity: 0.1,
    top: 150,
    left: 70,
    transform: [{ rotate: "30deg" }],
  },

  backgroundIcon10: {
    position: "absolute",
    fontSize: 28,
    opacity: 0.11,
    top: 380,
    right: 15,
    transform: [{ rotate: "-30deg" }],
  },

  backgroundIcon11: {
    position: "absolute",
    fontSize: 26,
    opacity: 0.09,
    top: 480,
    left: 15,
    transform: [{ rotate: "35deg" }],
  },

  backgroundIcon12: {
    position: "absolute",
    fontSize: 32,
    opacity: 0.13,
    top: 580,
    right: 20,
    transform: [{ rotate: "-35deg" }],
  },

  backgroundIcon13: {
    position: "absolute",
    fontSize: 24,
    opacity: 0.08,
    top: 680,
    left: 25,
    transform: [{ rotate: "40deg" }],
  },

  backgroundIcon14: {
    position: "absolute",
    fontSize: 28,
    opacity: 0.1,
    top: 240,
    left: 60,
    transform: [{ rotate: "-40deg" }],
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
    paddingTop: 60,
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

  welcomeSection: {
    alignItems: "center",
    marginBottom: 32,
  },

  welcomeSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "60%",
  },

  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 195, 0, 0.3)",
  },

  separatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFC300",
    marginHorizontal: 12,
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

  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 24,
  },

  forgotText: {
    color: "#FFC300",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },

  loginButton: {
    backgroundColor: "#FFC300",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },

  loginButtonDisabled: {
    backgroundColor: "#F0F0F0",
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },

  loginButtonTextDisabled: {
    color: "#AAAAAA",
  },

  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  registerText: {
    color: "#666666",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },

  registerLink: {
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
})

export default Login
