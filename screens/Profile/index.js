import { StyleSheet, Text, View, TextInput, Pressable, StatusBar } from 'react-native'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser, faEnvelope, faCircleInfo, faPhone, faBuilding } from '@fortawesome/free-solid-svg-icons'
import Header from '../../components/Header'
import { ScrollView } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import Animated, { FadeInDown } from 'react-native-reanimated'

const Profile = () => {
  const userDetail = useSelector((state) => state?.user)
  const initialColorState = {
    nameBorder: "#DADADA",
    departmentBorder: "#DADADA",
    emailBorder: "#DADADA",
    emailIcon: "#667C8A",
    nameIcon: "#667C8A",
    departmentIcon: "#667C8A",
  };
  const [inputState, setInputState] = useState(initialColorState);

  const [profileData, setProfileData] = useState({
    name: userDetail?.name,
    department: userDetail?.dept,
  });

  const [errorValidation, setErrorValidation] = useState({
    name: false,
  });
  const [fieldVisited, setFieldVisited] = useState({
    name: false,
  });

  // Handle Text Change
  const handleTextChange = (text, input) => {
    setProfileData((previousState) => {
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
      validation(field, profileData[field]);
    }
  };

  // Handle Validation of text input
  const validation = (field, value) => {
    const validators = {
      name: (name) => /^[a-zA-Z]+$/.test(name),
    };

    if (validators.hasOwnProperty(field)) {
      setErrorValidation((previousState) => ({
        ...previousState,
        [field]: !validators[field](value),
      }));
    }
  };

  const updateProfile = () => {

  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Header title={"Your Profile"} showProfile={false} />
      <ScrollView style={styles.profileSection}>
        <View style={styles.profile}>
          <View style={styles.profileImage}>
            <Text style={styles.profileImageText}>{userDetail?.name?.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.username}>{userDetail?.name}</Text>
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
                value={profileData?.name}
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
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              style={{ ...styles.input }}
            >
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{ ...styles.icon, color: inputState.emailIcon }}
                size={17}
              />
              <TextInput
                value={userDetail?.email}
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
              entering={FadeInDown.delay(600).duration(1000).springify()}
              style={{ ...styles.input }}
            >
              <FontAwesomeIcon
                icon={faPhone}
                style={{ ...styles.icon, color: inputState.emailIcon }}
                size={17}
              />
              <TextInput
                value={userDetail?.phone}
                selectionColor={"#FFC300"}
                style={{
                  flex: 1,
                  fontFamily: "Poppins-Regular",
                  paddingTop: 3,
                }}
                placeholder="Phone"
                placeholderTextColor="#667C8A"
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(800).duration(1000).springify()}
              style={{ ...styles.input, borderColor: inputState.departmentBorder }}
            >
              <FontAwesomeIcon
                icon={faBuilding}
                style={{ ...styles.icon, color: inputState.departmentIcon }}
                size={17}
              />
              <TextInput
                value={profileData?.dept}
                onBlur={() => {
                  setInputState(initialColorState);
                  handleBlur("department");
                }}
                onFocus={() =>
                  setInputState((prevState) => ({
                    ...prevState,
                    departmentBorder: "#FFC300",
                    departmentIcon: "#FFC300",
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
                placeholder="Department"
                placeholderTextColor="#667C8A"
              />
            </Animated.View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <Pressable onPress={updateProfile} style={styles.orderButton} >
          <Text style={styles.buttonText}>Update Profile</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  profileSection: {
    padding: 10
  },
  profile: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: "center"
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: "rgba(255, 195, 0, 0.2)",
    textAlign: "center",
    alignItems: "center",
    justifyContent: 'center'
  },
  profileImageText: {
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
    fontSize: 40,
    marginTop: 8
  },
  username: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 20
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
  inputContainer: {
    paddingTop: 20,
    width: "100%",
    gap: 15
  },
  bottomContainer: {
    // position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
  },
  orderButton: {
    backgroundColor: "#FFC300",
    fontSize: 17,
    fontFamily: "Poppins-Medium",
    textAlign: "right",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    textAlign: "center",
  },
})