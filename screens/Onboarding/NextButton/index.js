"use client"

import { StyleSheet, Text, TouchableOpacity, View, Animated } from "react-native"
import { useEffect, useRef } from "react"
import Svg, { G, Circle } from "react-native-svg"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons"

export default function NextButton({ percentage, scrollTo, isLastSlide }) {
  const size = 120
  const strokeWidth = 3
  const center = size / 2
  const radius = size / 2 - strokeWidth / 2
  const circumference = 2 * Math.PI * radius

  const progressAnimation = useRef(new Animated.Value(0)).current
  const scaleAnimation = useRef(new Animated.Value(1)).current
  const progressRef = useRef(null)

  const animation = (toValue) => {
    return Animated.timing(progressAnimation, {
      toValue,
      duration: 400,
      useNativeDriver: false,
    }).start()
  }

  useEffect(() => {
    animation(percentage)
  }, [percentage])

  useEffect(() => {
    const listener = progressAnimation.addListener((value) => {
      const strokeDashoffset = circumference - (circumference * value.value) / 100

      if (progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        })
      }
    })

    return () => {
      progressAnimation.removeListener(listener)
    }
  }, [])

  const handlePress = () => {
    // Scale animation on press
    Animated.sequence([
      Animated.timing(scaleAnimation, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()

    scrollTo()
  }

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: scaleAnimation }],
          },
        ]}
      >
        <Svg width={size} height={size}>
          <G rotation="-90" origin={center}>
            <Circle
              stroke="rgba(255, 195, 0, 0.2)"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <Circle
              ref={progressRef}
              stroke="#FFC300"
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeLinecap="round"
              fill="transparent"
            />
          </G>
        </Svg>

        <TouchableOpacity onPress={handlePress} style={styles.button} activeOpacity={0.8}>
          <View style={styles.buttonContent}>
            {isLastSlide ? (
              <>
                <FontAwesomeIcon icon={faCheck} size={24} color="#1F2937" />
                <Text style={styles.buttonText}>Start</Text>
              </>
            ) : (
              <FontAwesomeIcon icon={faArrowRight} size={28} color="#1F2937" />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 20,
  },
  buttonContainer: {
    position: "relative",
  },
  button: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFC300",
    borderRadius: 60,
    margin: 15,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFC300",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "#1F2937",
    marginTop: 2,
    fontWeight: "600",
  },
})
