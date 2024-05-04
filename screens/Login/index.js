import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const initialColorState = {
  emailBorder: "#DADADA",
  passwordBorder: "#DADADA",
  emailIcon: "#667C8A",
  passwordIcon: "#667C8A",
};

const styles = StyleSheet.create({
  head: {
    backgroundColor: "#FFC300",
    width: screenWidth,
    height: 245,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: screenWidth,
    borderBottomRightRadius: screenWidth,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    transform: [{ scaleX: 1.5 }],
    padding: 10,
  },
  headMainText: {
    marginTop: 60,
    fontSize: 32,
    color: "#ffffff",
    fontFamily: "Poppins-Medium",
    transform: [{ scaleX: 1 / 1.5 }],
  },
  headText: {
    fontSize: 18,
    color: "#000000",
    fontFamily: "Poppins-Medium",
    transform: [{ scaleX: 1 / 1.5 }],
  },
  inputContainer: {
    backgroundColor: "#fff",
    marginTop: 70,
    paddingHorizontal: 12,
    gap: 22,
  },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DADADA",
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
    height: 55,
  },
  icon: {
    marginHorizontal: 12,
    color: "#667C8A",
  },
  forgotPassword: {
    color: "#FFC300",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    textAlign: "right",
    paddingTop: 8,
    paddingHorizontal: 12,
  },
  loginButton: {
    backgroundColor: "#FFC300",
    fontSize: 17,
    fontFamily: "Poppins-Medium",
    textAlign: "right",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginHorizontal: 12,
    borderRadius: 10,
    marginTop: 40,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    textAlign: "center",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  register: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
  },
});

const Login = () => {
  const [inputState, setInputState] = useState(initialColorState);
  const [showPassword, setShowPasssword] = useState(false);
  const navigation = useNavigation();
  const showPasswordHandle = () => {
    setShowPasssword((previousState) => {
      return !previousState;
    });
  };

  return (
    <View style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}>
      <View style={[styles.head]}>
        <Text style={styles.headMainText}>Login</Text>
        <Text style={styles.headText}>Welcome back</Text>
      </View>
      <View style={styles.inputContainer}>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          style={{ ...styles.input, borderColor: inputState.emailBorder }}
        >
          <FontAwesomeIcon
            icon={faEnvelope}
            style={{ ...styles.icon, color: inputState.emailIcon }}
            size={17}
          />
          <TextInput
            onBlur={() => setInputState(initialColorState)}
            onFocus={() =>
              setInputState((prevState) => ({
                ...prevState,
                emailBorder: "#FFC300",
                emailIcon: "#FFC300",
              }))
            }
            selectionColor={"#FFC300"}
            style={{
              flex: 1,
              fontFamily: "Poppins-Regular",
              paddingTop: 3,
            }}
            placeholder="Email"
            placeholderTextColor="#667C8A"
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={{ ...styles.input, borderColor: inputState.passwordBorder }}
        >
          <FontAwesomeIcon
            icon={faLock}
            style={{ ...styles.icon, color: inputState.passwordIcon }}
            size={17}
          />
          <TextInput
            secureTextEntry={!showPassword}
            onBlur={() => setInputState(initialColorState)}
            selectionColor={"#FFC300"}
            onFocus={() =>
              setInputState((prevState) => ({
                ...prevState,
                passwordBorder: "#FFC300",
                passwordIcon: "#FFC300",
              }))
            }
            style={{
              flex: 1,
              fontFamily: "Poppins-Regular",
              paddingTop: 3,
            }}
            placeholder="Password"
            placeholderTextColor="#667C8A"
          />
          <TouchableOpacity onPress={showPasswordHandle} style={styles.icon}>
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              style={{ color: inputState.passwordIcon }}
              size={17}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <Animated.View
        entering={FadeInDown.delay(600).duration(1000).springify()}
      >
        <Text style={styles.forgotPassword}>Forgot password?</Text>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(800).duration(1000).springify()}
      >
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(1000).duration(1000).springify()}
        style={styles.registerContainer}
      >
        <Text style={styles.register}>Create a new account? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.push("Register");
          }}
        >
          <Text style={{ ...styles.register, color: "#FFC300" }}>Register</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default Login;
