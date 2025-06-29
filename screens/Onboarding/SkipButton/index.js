"use client"

import { StyleSheet, Text, Pressable } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"

export default function SkipButton({ onSkip }) {
  const scale = useSharedValue(1)

  const handlePress = () => {
    scale.value = withSpring(0.95, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 })
    })
    onSkip()
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable onPress={handlePress} style={styles.button}>
        <Text style={styles.text}>Skip</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 195, 0, 0.3)",
  },
  text: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#B8860B",
    fontWeight: "600",
  },
})
