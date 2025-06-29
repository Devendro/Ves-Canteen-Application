"use client"

import { useEffect } from "react"
import { StyleSheet, View, Dimensions } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withRepeat, withDelay } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")

const LightBeam = ({ delay, angle, width, opacity: maxOpacity }) => {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0)

  useEffect(() => {
    opacity.value = withDelay(delay, withRepeat(withTiming(maxOpacity, { duration: 3000 }), -1, true))

    scale.value = withDelay(delay, withRepeat(withTiming(1, { duration: 4000 }), -1, true))
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${angle}deg` }, { scaleY: scale.value }],
  }))

  return (
    <Animated.View style={[styles.beamContainer, animatedStyle]}>
      <LinearGradient
        colors={[
          "transparent",
          "rgba(255, 195, 0, 0.1)",
          "rgba(255, 195, 0, 0.2)",
          "rgba(255, 195, 0, 0.1)",
          "transparent",
        ]}
        style={[styles.beam, { width }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
    </Animated.View>
  )
}

export default function LightBeams() {
  return (
    <View style={styles.container}>
      <LightBeam delay={0} angle={15} width={80} opacity={0.3} />
      <LightBeam delay={1000} angle={-20} width={60} opacity={0.25} />
      <LightBeam delay={2000} angle={35} width={100} opacity={0.2} />
      <LightBeam delay={3000} angle={-45} width={70} opacity={0.28} />
      <LightBeam delay={4000} angle={60} width={90} opacity={0.22} />
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
    zIndex: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  beamContainer: {
    position: "absolute",
    height: SCREEN_HEIGHT * 1.5,
  },
  beam: {
    height: "100%",
  },
})
