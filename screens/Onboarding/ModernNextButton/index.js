"use client"

import { useEffect } from "react"
import { StyleSheet, Text, Pressable, View } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons"

export default function ModernNextButton({ onPress, progress, isLastSlide }) {
  const buttonScale = useSharedValue(1)
  const progressWidth = useSharedValue(0)
  const glowOpacity = useSharedValue(0.3)

  useEffect(() => {
    const validProgress = Math.max(0, Math.min(1, progress || 0))
    progressWidth.value = withTiming(validProgress * 100, { duration: 300 })
  }, [progress])

  useEffect(() => {
    // Subtle glow animation
    glowOpacity.value = withSpring(0.5, { damping: 20 }, () => {
      glowOpacity.value = withSpring(0.3, { damping: 20 })
    })
  }, [])

  const handlePress = () => {
    buttonScale.value = withSpring(0.95, { damping: 15 }, () => {
      buttonScale.value = withSpring(1, { damping: 15 })
    })
    onPress()
  }

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${Math.max(0, Math.min(100, progressWidth.value))}%`,
  }))

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }))

  return (
    <View style={styles.container}>
      {/* Background with subtle transparency */}
      <View style={styles.buttonBackground}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, progressAnimatedStyle]} />
        </View>

        <Animated.View style={buttonAnimatedStyle}>
          {/* Glow effect */}
          <Animated.View style={[styles.buttonGlow, glowAnimatedStyle]} />

          <Pressable onPress={handlePress} style={styles.button}>
            <View style={styles.iconContainer}>
              {isLastSlide ? (
                <>
                  <FontAwesomeIcon icon={faCheck} size={16} color="#1F2937" />
                  <Text style={styles.buttonText}>Start</Text>
                </>
              ) : (
                <FontAwesomeIcon icon={faArrowRight} size={18} color="#1F2937" />
              )}
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  buttonBackground: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
    borderRadius: 40,
    backdropFilter: "blur(10px)", // iOS blur effect
  },
  progressContainer: {
    width: 60,
    height: 3,
    backgroundColor: "rgba(255, 195, 0, 0.3)",
    borderRadius: 1.5,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFC300",
    borderRadius: 1.5,
    shadowColor: "#FFC300",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonGlow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFC300",
    zIndex: 0,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFC300",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFC300",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 8,
    color: "#1F2937",
    marginTop: 1,
    fontWeight: "600",
  },
})
