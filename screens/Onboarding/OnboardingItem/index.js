import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
} from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

export default function OnboardingItem({ item }) {
  const { width } = useWindowDimensions();
  return (
    <View style={[styles.container, { width }]}>
      {/* <Image
        source={item.image}
        style={[styles.image, { width: width, resizeMode: "contain" }]}
      /> */}
      <LottieView style={[styles.image, { width: width, resizeMode: "contain" }]} source={item.image} autoPlay loop/>
      <View style={{ flex: 0.3 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    marginTop: 30,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    marginBottom: 10,
    color: "#FFC300",
    textAlign: "center",
  },
  description: {
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    paddingHorizontal: 50,
  },
});
