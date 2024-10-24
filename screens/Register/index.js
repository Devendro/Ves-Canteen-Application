// Imports
import React, { useState } from "react";
import { Tooltip } from "@rneui/themed";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar
} from "react-native";
import {
  faCircleInfo,
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import {
  validateName,
  validateEmail,
  validatePassword,
  confirmPasswordMatches,
} from "./validation.js";

const screenWidth = Dimensions.get("window").width;

// Initial Border Colors
const initialColorState = {
  nameBorder: "#DADADA",
  emailBorder: "#DADADA",
  passwordBorder: "#DADADA",
  confirmPasswordBorder: "#DADADA",
  nameIcon: "#667C8A",
  emailIcon: "#667C8A",
  passwordIcon: "#667C8A",
  confirmPasswordIcon: "#667C8A",
};

// Styles
const styles = StyleSheet.create({
  head: {
    backgroundColor: "#FFC300",
    width: screenWidth,
    height: 225,
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
    marginTop: 50,
    gap: 22,
    paddingHorizontal: 12,
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
  errorMsg: {
    paddingLeft: 7,
    color: "red",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    opacity: 0,
  },
  icon: {
    marginHorizontal: 12,
    color: "#667C8A",
  },
  registerButton: {
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
    marginTop: 50,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    textAlign: "center",
  },
  loginContainer: {
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

const ControlledTooltip = (props) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Tooltip
      visible={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      {...props}
    />
  );
};

const Register = () => {
  // States and Variables
  const [inputState, setInputState] = useState(initialColorState);
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPasssword] = useState(false);
  const [showConfirmPassword, setShowConfirmPasssword] = useState(false);
  const [errorValidation, setErrorValidation] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [fieldVisited, setFieldVisited] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigation = useNavigation();

  // Handle password show and hide
  const showPasswordHandle = () => {
    setShowPasssword((previousState) => {
      return !previousState;
    });
  };

  // Handle confirm password show and hide
  const showConfirmPasswordHandle = () => {
    setShowConfirmPasssword((previousState) => {
      return !previousState;
    });
  };

  // Handle Text Change
  const handleTextChange = (text, input) => {
    setRegisterData((previousState) => {
      return {
        ...previousState,
        [input]: text,
      };
    });

    if (fieldVisited[input]) {
      validation(input, text);
    }
  };

  // Handle field visited already
  const handleBlur = (field) => {
    if (!fieldVisited[field]) {
      setFieldVisited((previousState) => {
        return { ...previousState, [field]: true };
      });
      validation(field, registerData[field]);
    }
  };

  // Handle Validation of text input
  const validation = (field, value) => {
    const validators = {
      name: validateName,
      email: validateEmail,
      password: validatePassword,
      confirmPassword: (val) =>
        confirmPasswordMatches(registerData.password, val),
    };

    if (validators.hasOwnProperty(field)) {
      setErrorValidation((previousState) => ({
        ...previousState,
        [field]: !validators[field](value),
      }));
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, flexDirection: "column", backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#FFC300" barStyle="dark-content"/>
      <View style={[styles.head]}>
        <Text style={styles.headMainText}>Register</Text>
        <Text style={styles.headText}>Create an Account</Text>
      </View>
      <View style={styles.inputContainer}>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000).springify()}
          style={{ ...styles.input, borderColor: inputState.nameBorder }}
        >
          <FontAwesomeIcon
            icon={faUser}
            style={{ ...styles.icon, color: inputState.nameIcon }}
            size={17}
          />
          <TextInput
            onBlur={() => {
              setInputState(initialColorState);
              handleBlur("name");
            }}
            onFocus={() =>
              setInputState((prevState) => ({
                ...prevState,
                nameBorder: "#FFC300",
                nameIcon: "#FFC300",
              }))
            }
            onChangeText={(text) => {
              handleTextChange(text, "name");
            }}
            selectionColor={"#FFC300"}
            style={{
              flex: 1,
              fontFamily: "Poppins-Regular",
              paddingTop: 3,
            }}
            placeholder="Name"
            placeholderTextColor="#667C8A"
          />

          {errorValidation.name && (
            <View style={styles.view}>
              <ControlledTooltip
                width={200}
                backgroundColor={"#DADADA"}
                popover={<Text>Please enter valid Name</Text>}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  style={[styles.icon, { color: "#FF0000" }]}
                  size={16}
                />
              </ControlledTooltip>
            </View>
          )}
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={{ ...styles.input, borderColor: inputState.emailBorder }}
        >
          <FontAwesomeIcon
            icon={faEnvelope}
            style={{ ...styles.icon, color: inputState.emailIcon }}
            size={17}
          />
          <TextInput
            onBlur={() => {
              setInputState(initialColorState);
              handleBlur("email");
            }}
            onFocus={() =>
              setInputState((prevState) => ({
                ...prevState,
                emailBorder: "#FFC300",
                emailIcon: "#FFC300",
              }))
            }
            onChangeText={(text) => {
              handleTextChange(text, "email");
            }}
            selectionColor={"#FFC300"}
            style={{
              flex: 1,
              fontFamily: "Poppins-Regular",
              paddingTop: 3,
            }}
            placeholder="Email"
            placeholderTextColor="#667C8A"
          />
          {errorValidation.email && (
            <View style={styles.view}>
              <ControlledTooltip
                width={200}
                backgroundColor={"#DADADA"}
                popover={<Text>Please enter valid Email</Text>}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  style={[styles.icon, { color: "#FF0000" }]}
                  size={16}
                />
              </ControlledTooltip>
            </View>
          )}
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(600).duration(1000).springify()}
          style={{ ...styles.input, borderColor: inputState.passwordBorder }}
        >
          <FontAwesomeIcon
            icon={faLock}
            style={{ ...styles.icon, color: inputState.passwordIcon }}
            size={17}
          />
          <TextInput
            secureTextEntry={!showPassword}
            onBlur={() => {
              setInputState(initialColorState);
              handleBlur("password");
            }}
            selectionColor={"#FFC300"}
            onFocus={() =>
              setInputState((prevState) => ({
                ...prevState,
                passwordBorder: "#FFC300",
                passwordIcon: "#FFC300",
              }))
            }
            onChangeText={(text) => {
              handleTextChange(text, "password");
            }}
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
          {errorValidation.password && (
            <View style={styles.view}>
              <ControlledTooltip
                width={300}
                height={70}
                backgroundColor={"#DADADA"}
                popover={<Text>Password must be atleast One Uppercase, One Lowercase, One Numeric and One Special Character</Text>}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  style={[styles.icon, { color: "#FF0000" }]}
                  size={16}
                />
              </ControlledTooltip>
            </View>
          )}
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(800).duration(1000).springify()}
          style={{
            ...styles.input,
            borderColor: inputState.confirmPasswordBorder,
          }}
        >
          <FontAwesomeIcon
            icon={faLock}
            style={{ ...styles.icon, color: inputState.confirmPasswordIcon }}
            size={17}
          />
          <TextInput
            secureTextEntry={!showConfirmPassword}
            onBlur={() => {
              setInputState(initialColorState);
              handleBlur("confirmPassword");
            }}
            selectionColor={"#FFC300"}
            onFocus={() =>
              setInputState((prevState) => ({
                ...prevState,
                confirmPasswordBorder: "#FFC300",
                confirmPasswordIcon: "#FFC300",
              }))
            }
            onChangeText={(text) => {
              handleTextChange(text, "confirmPassword");
            }}
            style={{
              flex: 1,
              fontFamily: "Poppins-Regular",
              paddingTop: 3,
            }}
            placeholder="Confirm Password"
            placeholderTextColor="#667C8A"
          />
          <TouchableOpacity
            onPress={showConfirmPasswordHandle}
            style={styles.icon}
          >
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEye : faEyeSlash}
              style={{ color: inputState.confirmPasswordIcon }}
              size={17}
            />
          </TouchableOpacity>
          {errorValidation.password && (
            <View style={styles.view}>
              <ControlledTooltip
                width={300}
                height={70}
                backgroundColor={"#DADADA"}
                popover={<Text>Password must be atleast One Uppercase, One Lowercase, One Numeric and One Special Character</Text>}
              >
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  style={[styles.icon, { color: "#FF0000" }]}
                  size={16}
                />
              </ControlledTooltip>
            </View>
          )}
        </Animated.View>
      </View>
      <Animated.View
        entering={FadeInDown.delay(1000).duration(1000).springify()}
      >
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.delay(1200).duration(1000).springify()}
        style={styles.loginContainer}
      >
        <Text style={styles.register}>Already have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.push("Login");
          }}
        >
          <Text style={{ ...styles.register, color: "#FFC300" }}>Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

export default Register;
