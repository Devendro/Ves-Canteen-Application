"use client"

import { StyleSheet, View, Pressable } from "react-native"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"

export default function ModernPaginator({ data, currentIndex, onDotPress }) {
  const animatedStyles = data.map((_, index) => {
    const isActive = index === currentIndex

    return {
      width: isActive ? 24 : 8,
      opacity: isActive ? 1 : 0.6,
      transform: [
        { scale: isActive ? 1.1 : 1 }
      ],
    }
  })

  const stylesArray = animatedStyles.map((style, index) => {
    const isActive = index === currentIndex
    return [styles.dot, isActive && styles.activeDot, style]
  })

  const renderDot = (_, index) => {
    const isActive = index === currentIndex
    const animatedStyle = stylesArray[index]

    const handlePress = () => {
      if (onDotPress && !isActive) {
        onDotPress(index)
      }
    }

    return (
      <Pressable key={index} onPress={handlePress} style={styles.dotContainer}>
        <Animated.View style={animatedStyle} />
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.paginatorBackground}>
        {data.map(renderDot)}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  paginatorBackground: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Semi-transparent background
    borderRadius: 25,
    gap: 6,
    backdropFilter: "blur(10px)", // iOS blur effect
  },
  dotContainer: {
    padding: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFC300",
    shadowColor: "#FFC300",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  activeDot: {
    backgroundColor: "#F59E0B",
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
})
