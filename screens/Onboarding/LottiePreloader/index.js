"use client"

import { useEffect, useRef } from "react"
import { View, StyleSheet } from "react-native"
import LottieView from "lottie-react-native"

const LottiePreloader = ({ animations, onPreloadComplete }) => {
  const preloadRefs = useRef({})
  const preloadedCount = useRef(0)
  const totalAnimations = animations.length

  useEffect(() => {
    // Reset counter when animations change
    preloadedCount.current = 0

    // Preload each animation
    animations.forEach((animation, index) => {
      // Small delay between each preload to prevent overwhelming
      setTimeout(() => {
        if (preloadRefs.current[index]) {
          // Force the animation to load by playing it briefly
          preloadRefs.current[index].play()
          
          // After a short time, pause and reset
          setTimeout(() => {
            if (preloadRefs.current[index]) {
              preloadRefs.current[index].pause()
              preloadRefs.current[index].reset()
              
              preloadedCount.current += 1
              
              // Check if all animations are preloaded
              if (preloadedCount.current === totalAnimations) {
                onPreloadComplete?.()
              }
            }
          }, 200) // Give enough time for the animation to load
        }
      }, index * 100) // Stagger the preloading
    })
  }, [animations, onPreloadComplete, totalAnimations])

  const handleAnimationFinish = (index) => {
    // Additional callback when animation finishes loading
    console.log(`Animation ${index} preloaded`)
  }

  return (
    <View style={styles.preloaderContainer} pointerEvents="none">
      {animations.map((animation, index) => (
        <LottieView
          key={`preload-${index}`}
          ref={(ref) => {
            preloadRefs.current[index] = ref
          }}
          source={animation}
          style={styles.hiddenAnimation}
          autoPlay={false}
          loop={false}
          cacheComposition={true}
          renderMode="AUTOMATIC"
          hardwareAccelerationAndroid={true}
          onAnimationFinish={() => handleAnimationFinish(index)}
          resizeMode="contain"
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  preloaderContainer: {
    position: "absolute",
    top: -1000, // Hide completely off-screen
    left: -1000,
    width: 1,
    height: 1,
    opacity: 0,
    zIndex: -1000,
  },
  hiddenAnimation: {
    width: 1,
    height: 1,
    opacity: 0,
  },
})

export default LottiePreloader
