"use client"

import { useEffect } from "react"
import { StyleSheet, View, Text } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
} from "react-native-reanimated"

const FloatingEmoji = ({ emoji, delay = 0, style }) => {
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.4, { duration: 1000 }))
    translateY.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(-10, { duration: 2000 }), withTiming(10, { duration: 2000 })), -1, true),
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={[style, animatedStyle]}>
      <Text style={styles.emojiText}>{emoji}</Text>
    </Animated.View>
  )
}

const SimpleOrb = ({ size, delay = 0, style }) => {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(0.15, { duration: 1000 }))
    scale.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1.1, { duration: 3000 }), withTiming(1, { duration: 3000 })), -1, true),
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={[style, animatedStyle]}>
      <View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    </Animated.View>
  )
}

export default function SimpleBackground() {
  const backgroundOpacity = useSharedValue(0)

  useEffect(() => {
    backgroundOpacity.value = withTiming(1, { duration: 800 })
  }, [])

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }))

  return (
    <Animated.View style={[styles.container, backgroundAnimatedStyle]} pointerEvents="none">
      {/* Simple gradient overlay */}
      <View style={styles.gradientOverlay} />

      {/* Minimal floating emojis */}
      <FloatingEmoji emoji="🍔" delay={0} style={[styles.floatingEmoji, { top: "20%", left: "15%" }]} />
      <FloatingEmoji emoji="🍕" delay={500} style={[styles.floatingEmoji, { top: "30%", right: "20%" }]} />
      <FloatingEmoji emoji="🌮" delay={1000} style={[styles.floatingEmoji, { top: "60%", left: "10%" }]} />
      <FloatingEmoji emoji="🥗" delay={1500} style={[styles.floatingEmoji, { top: "70%", right: "15%" }]} />

      {/* Simple orbs */}
      <SimpleOrb size={80} delay={0} style={{ position: "absolute", top: -20, right: -20 }} />
      <SimpleOrb size={60} delay={1000} style={{ position: "absolute", bottom: 100, left: -15 }} />
      <SimpleOrb size={70} delay={2000} style={{ position: "absolute", bottom: 200, right: -20 }} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 195, 0, 0.03)",
  },
  floatingEmoji: {
    position: "absolute",
  },
  emojiText: {
    fontSize: 24,
    opacity: 0.6,
  },
  orb: {
    backgroundColor: "rgba(255, 195, 0, 0.1)",
    shadowColor: "#FFC300",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
})
