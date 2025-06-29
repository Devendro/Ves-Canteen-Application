"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { StyleSheet, Text, View, ActivityIndicator } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay } from "react-native-reanimated"
import LottieView from "lottie-react-native"

export default function OnboardingItem({ 
  item, 
  index, 
  currentIndex, 
  isVisible, 
  isPreloaded, 
  onAnimationRef 
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [shouldRender, setShouldRender] = useState(index === 0)
  const [animationReady, setAnimationReady] = useState(false)
  const animationRef = useRef(null)

  // Animation values
  const opacity = useSharedValue(index === 0 ? 1 : 0)
  const translateY = useSharedValue(index === 0 ? 0 : 20)

  // Pass animation ref to parent
  useEffect(() => {
    if (animationRef.current && onAnimationRef) {
      onAnimationRef(animationRef.current)
    }
  }, [onAnimationRef])

  // Determine if this slide should be rendered
  useEffect(() => {
    const shouldShow = Math.abs(index - currentIndex) <= 2 // Render more slides for preloading
    if (shouldShow && !shouldRender) {
      setShouldRender(true)
    }
  }, [currentIndex, index, shouldRender])

  // Handle animations when slide becomes active
  useEffect(() => {
    if (index === currentIndex && shouldRender) {
      // Animate in
      opacity.value = withDelay(50, withTiming(1, { duration: 400 }))
      translateY.value = withDelay(100, withSpring(0, { damping: 15, stiffness: 120 }))
    } else if (shouldRender) {
      // Animate out
      opacity.value = withTiming(0, { duration: 200 })
      translateY.value = withTiming(20, { duration: 200 })
    }
  }, [currentIndex, index, shouldRender])

  // Handle animation loading
  const handleAnimationLoad = useCallback(() => {
    setIsLoaded(true)
    setAnimationReady(true)
  }, [])

  // Preload animation when needed
  useEffect(() => {
    if (isPreloaded && animationRef.current && !animationReady) {
      // Force load the animation
      animationRef.current.play()
      setTimeout(() => {
        animationRef.current.pause()
        setAnimationReady(true)
      }, 100)
    }
  }, [isPreloaded, animationReady])

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  // Don't render if not needed
  if (!shouldRender) {
    return <View style={styles.container} />
  }

  const shouldPlayAnimation = index === currentIndex && isVisible && animationReady

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Animation Section */}
      <View style={styles.animationSection}>
        <View style={styles.animationContainer}>
          {!isLoaded && !animationReady && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFC300" />
            </View>
          )}
          <LottieView
            ref={animationRef}
            style={[
              styles.animation, 
              (!isLoaded && !animationReady) && styles.hiddenAnimation
            ]}
            source={item.image}
            autoPlay={shouldPlayAnimation}
            loop={item.loop !== false}
            speed={0.9}
            resizeMode="contain"
            onAnimationLoaded={handleAnimationLoad}
            cacheComposition={true}
            renderMode="AUTOMATIC"
            hardwareAccelerationAndroid={true}
            // Preload settings
            progress={animationReady && !shouldPlayAnimation ? 0 : undefined}
          />
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>

        {/* Features Section */}
        {item.features && (
          <View style={styles.featuresContainer}>
            {item.features.map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 160, // Extra space for bottom section
  },
  animationSection: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  animationContainer: {
    width: "100%",
    maxWidth: 280,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent", // Transparent background
  },
  animation: {
    width: "90%",
    height: "90%",
    backgroundColor: "transparent", // Transparent Lottie background
  },
  hiddenAnimation: {
    opacity: 0,
  },
  loadingContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  contentSection: {
    flex: 0.5,
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
    marginBottom: 8, // Add margin to prevent cutoff
  },
  featuresContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20, // Extra padding to prevent cutoff
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 195, 0, 0.15)",
    minWidth: "75%",
  },
  featureDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFC300",
    marginRight: 10,
  },
  featureText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#4B5563",
    flex: 1,
    fontWeight: "500",
  },
})
