"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { StyleSheet, View, StatusBar, Dimensions, SafeAreaView, BackHandler, Platform, Text } from "react-native"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import slides from "./slides"
import OnboardingItem from "./OnboardingItem"
import ModernPaginator from "./ModernPaginator"
import ModernNextButton from "./ModernNextButton"
import SkipButton from "./SkipButton"
import SimpleBackground from "./AnimatedBackground"
import { setItem } from "../../utils/asyncStorage"

const { width: SCREEN_WIDTH } = Dimensions.get("window")

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [preloadedAnimations, setPreloadedAnimations] = useState(new Set())
  const navigation = useNavigation()
  const scrollViewRef = useRef(null)

  // Animated values
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.98)

  // Refs
  const isScrolling = useRef(false)
  const scrollTimeout = useRef(null)
  const animationRefs = useRef({})

  // Preload animations
  const preloadAnimation = useCallback((index) => {
    if (!preloadedAnimations.has(index) && animationRefs.current[index]) {
      setPreloadedAnimations(prev => new Set([...prev, index]))
    }
  }, [preloadedAnimations])

  // Initialize app with simple entrance and preload first animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
      opacity.value = withTiming(1, { duration: 600 })
      scale.value = withSpring(1, { damping: 20, stiffness: 150 })
      
      // Preload first animation immediately
      preloadAnimation(0)
      
      // Preload next animation after a short delay
      setTimeout(() => {
        preloadAnimation(1)
      }, 500)
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  // Preload adjacent animations when index changes
  useEffect(() => {
    // Preload current, next, and previous animations
    const indicesToPreload = [
      currentIndex - 1,
      currentIndex,
      currentIndex + 1,
      currentIndex + 2 // Preload one extra ahead
    ].filter(index => index >= 0 && index < slides.length)

    indicesToPreload.forEach(index => {
      setTimeout(() => preloadAnimation(index), index * 100)
    })
  }, [currentIndex, preloadAnimation])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [])

  // Handle Android back button
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (currentIndex > 0) {
          goToPrevious()
          return true
        }
        return false
      }

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress)
      return () => subscription?.remove()
    }, [currentIndex]),
  )

  // Simple scroll handler without complex animations
  const handleScroll = useCallback(
    (event) => {
      const offsetX = event.nativeEvent.contentOffset.x
      const newIndex = Math.round(offsetX / SCREEN_WIDTH)

      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < slides.length) {
        setCurrentIndex(newIndex)
      }
    },
    [currentIndex],
  )

  const handleScrollBeginDrag = useCallback(() => {
    isScrolling.current = true
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current)
    }
  }, [])

  const handleScrollEndDrag = useCallback(() => {
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false
    }, 100)
  }, [])

  // Navigation functions with preloading
  const goToNext = useCallback(() => {
    if (isScrolling.current) return

    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1
      
      // Preload the next animation before navigating
      preloadAnimation(nextIndex)
      preloadAnimation(nextIndex + 1) // Preload one ahead
      
      setCurrentIndex(nextIndex)
      scrollViewRef.current?.scrollTo({
        x: nextIndex * SCREEN_WIDTH,
        animated: true,
      })
    } else {
      completeOnboarding()
    }
  }, [currentIndex, preloadAnimation])

  const goToPrevious = useCallback(() => {
    if (isScrolling.current || currentIndex === 0) return

    const prevIndex = currentIndex - 1
    preloadAnimation(prevIndex)
    
    setCurrentIndex(prevIndex)
    scrollViewRef.current?.scrollTo({
      x: prevIndex * SCREEN_WIDTH,
      animated: true,
    })
  }, [currentIndex, preloadAnimation])

  const goToSlide = useCallback(
    (index) => {
      if (isScrolling.current || index === currentIndex || index < 0 || index >= slides.length) return

      // Preload target animation
      preloadAnimation(index)
      preloadAnimation(index + 1)
      
      setCurrentIndex(index)
      scrollViewRef.current?.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true,
      })
    },
    [currentIndex, preloadAnimation],
  )

  const completeOnboarding = useCallback(async () => {
    try {
      // Quick fade out
      opacity.value = withTiming(0, { duration: 300 })

      setTimeout(async () => {
        await setItem("onboarded", "1")
        navigation.replace("Login")
      }, 300)
    } catch (error) {
      console.error("Error completing onboarding:", error)
      navigation.replace("Login")
    }
  }, [navigation])

  const skipOnboarding = useCallback(() => {
    completeOnboarding()
  }, [completeOnboarding])

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }))

  const isLastSlide = currentIndex === slides.length - 1

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🍔</Text>
        </View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent />

        {/* Simple Background */}
        <SimpleBackground />

        <Animated.View style={[styles.content, containerAnimatedStyle]}>
          {/* Skip Button */}
          {!isLastSlide && <SkipButton onSkip={skipOnboarding} />}

          {/* Slides Container */}
          <View style={styles.slidesWrapper}>
            <Animated.ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              onScrollBeginDrag={handleScrollBeginDrag}
              onScrollEndDrag={handleScrollEndDrag}
              onMomentumScrollEnd={handleScrollEndDrag}
              scrollEventThrottle={16}
              decelerationRate="fast"
              bounces={false}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
            >
              {slides.map((slide, index) => (
                <View key={slide.id} style={styles.slideWrapper}>
                  <OnboardingItem
                    item={slide}
                    index={index}
                    currentIndex={currentIndex}
                    isVisible={Math.abs(index - currentIndex) <= 1}
                    isPreloaded={preloadedAnimations.has(index)}
                    onAnimationRef={(ref) => {
                      animationRefs.current[index] = ref
                    }}
                  />
                </View>
              ))}
            </Animated.ScrollView>
          </View>

          {/* Bottom Section - Transparent Background */}
          <View style={styles.bottomSection}>
            <ModernPaginator data={slides} currentIndex={currentIndex} onDotPress={goToSlide} />
            <ModernNextButton
              onPress={goToNext}
              progress={(currentIndex + 1) / slides.length}
              isLastSlide={isLastSlide}
            />
          </View>
        </Animated.View>
      </SafeAreaView>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFC300",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#FFC300",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 40,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
  },
  content: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 20 : 40,
  },
  slidesWrapper: {
    flex: 1,
    marginBottom: 140, // Fixed space for bottom section
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexDirection: "row",
  },
  slideWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    paddingTop: 20,
    backgroundColor: "transparent", // Made transparent
  },
})

export default Onboarding
