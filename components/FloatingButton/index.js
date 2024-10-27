import { Pressable, StyleSheet, Text, View, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCartShopping, faCircle, faClockRotateLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const FloatingButton = () => {
  const firstValue = useSharedValue(30);
  const secondValue = useSharedValue(30);
  const isOpen = useSharedValue(false);
  const navigation = useNavigation();
  const showFloatingButton = useSelector(
    (state) => state?.food?.floatingButton
  );
  const progress = useDerivedValue(() => {
    return isOpen.value ? withTiming(1) : withTiming(0);
  });

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstValue.value = withTiming(30, config);
      secondValue.value = withDelay(50, withTiming(30, config));
    } else {
      firstValue.value = withDelay(200, withSpring(130));
      secondValue.value = withDelay(100, withSpring(210));
    }
    isOpen.value = !isOpen.value;
  };

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 130],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: firstValue.value,
      transform: [{ scale: scale }],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 210],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: secondValue.value,
      transform: [{ scale: scale }],
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });

  const navigateTo = (path) => {
    handlePress();
    navigation.navigate(path);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() => {
          navigateTo("Orders");
        }}
      >
        <Animated.View style={[styles.contentContainer, secondIcon]}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              style={styles.icon}
              color="#ffffff"
              size={25}
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback
        onPress={() => {
          navigateTo("Cart");
        }}
      >
        <Animated.View style={[styles.contentContainer, firstIcon]}>
          <View style={[styles.iconContainer]}>
            <FontAwesomeIcon
              icon={faCartShopping}
              style={styles.icon}
              color="#ffffff"
              size={25}
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
      <Pressable
        style={styles.contentContainer}
        onPress={() => {
          handlePress();
        }}
      >
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <FontAwesomeIcon
            icon={faPlus}
            style={styles.icon}
            color="#ffffff"
            size={27}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#FFC300",
    position: "absolute",
    bottom: 50,
    right: 30,
    borderRadius: 50,
    zIndex: 1000,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 26,
  },
});
