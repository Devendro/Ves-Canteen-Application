"use client"

import { useEffect } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  interpolate,
  Extrapolation,
} from "react-native-reanimated"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const Particle = ({ delay, size, color, startX, startY, endX, endY, duration }) => {
  const progress = useSharedValue(0)
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0)

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }))
    scale.value = withDelay(delay, withTiming(1, { duration: 500 }))

    progress.value = withDelay(delay, withRepeat(withTiming(1, { duration: duration }), -1, false))
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    const x = interpolate(progress.value, [0, 1], [startX, endX], Extrapolation.CLAMP)
    const y = interpolate(progress.value, [0, 1], [startY, endY], Extrapolation.CLAMP)

    // Add some curve to the movement
    const curveOffset = Math.sin(progress.value * Math.PI) * 30

    return {
      transform: [{ translateX: x + curveOffset }, { translateY: y }, { scale: scale.value }],
      opacity: opacity.value * (1 - progress.value * 0.3), // Fade out slightly as it moves
    }
  })

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  )
}

export default function ParticleSystem() {
  const particles = Array.from({ length: 15 }, (_, index) => ({
    id: index,
    delay: Math.random() * 3000,
    size: Math.random() * 8 + 4,
    color: `rgba(255, ${Math.floor(Math.random() * 60) + 195}, 0, ${Math.random() * 0.4 + 0.1})`,
    startX: Math.random() * SCREEN_WIDTH,
    startY: SCREEN_HEIGHT + 50,
    endX: Math.random() * SCREEN_WIDTH,
    endY: -50,
    duration: Math.random() * 5000 + 8000,
  }))

  return (
    <View style={styles.container}>
      {particles.map((particle) => (
        <Particle
          key={particle.id}
          delay={particle.delay}
          size={particle.size}
          color={particle.color}
          startX={particle.startX}
          startY={particle.startY}
          endX={particle.endX}
          endY={particle.endY}
          duration={particle.duration}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    shadowColor: "#FFC300",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 3,
  },
})
