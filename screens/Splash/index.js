"use client"

import { StyleSheet, View, StatusBar, BackHandler } from "react-native"
import React, { useEffect, useRef } from "react"
import LottieView from "lottie-react-native"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import Animated, { FadeInUp } from "react-native-reanimated"
import { useNavigation, useFocusEffect } from "@react-navigation/native"

const Splash = () => {
  const navigation = useNavigation()
  const timeoutRef = useRef(null)

  // Handle navigation to home
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      // Use replace instead of navigate to prevent going back to splash
      navigation.replace("Home")
    }, 3000)

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [navigation])

  // Handle back button press on Android
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Prevent going back from splash screen
        return true
      }

      const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress)

      return () => subscription?.remove()
    }, []),
  )

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFC300" barStyle="dark-content" />
      <LottieView style={styles.icon} source={require("../../assets/images/splash.json")} autoPlay loop={false} />
      <Animated.Text entering={FadeInUp.delay(2000).springify().damping(8)} style={styles.text}>
        VESIT CANTEEN
      </Animated.Text>
    </View>
  )
}

export default Splash

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFC300",
  },
  icon: {
    marginTop: -30,
    marginLeft: -2,
    width: wp("50%"),
    height: hp("25%"),
  },
  text: {
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    fontSize: 30,
    letterSpacing: 1,
  },
})
