import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
  const navigation = useNavigation();
  setTimeout(() => {
    navigation.navigate("Home")
  }, 3000);
  return (
    <View style={styles.container}>
      <LottieView
        style={styles.icon}
        source={require("../../assets/images/splash.json")}
        autoPlay
        loop={false}
      />
      <Animated.Text
        entering={FadeInUp.delay(2000).springify().damping(8)}
        style={styles.text}
      >
        VESTEEN
      </Animated.Text>
    </View>
  );
};

export default Splash;

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
  },
});
