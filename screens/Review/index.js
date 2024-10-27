import React, { useState } from "react";
import { Text, View, Image, StyleSheet, StatusBar, Pressable } from "react-native";
import Header from "../../components/Header";
import { AirbnbRating } from "react-native-ratings";
import { TextInput } from "react-native-gesture-handler";
import { APIURL } from "../../context/constants/api";
import { CachedImage } from "../../utils/cachedImage";
import { useDispatch } from "react-redux";
import { createRating } from "../../context/actions/rating";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

export function Review({ route }) {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const [reviewData, setReviewData] = useState({
    food: route?.params?.data?._id,
    orderId: route?.params?.orderId,
    rating: 0,
    comment: ""
  })
  const handleReviewText = (text) => {
    setReviewData((prevState) => {
      return {
        ...prevState,
        comment: text
      }
    })
  }
  const submitReview = () => {
    dispatch(createRating(reviewData, (res) => {
      if (res) {
        Toast.show({
          type: "success",
          text1: "Thanks for your feedback!",
        });
        navigation.goBack();
      }
    }))
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={"Rating"} />
      <View style={styles.ratingSection}>
        <CachedImage
          uri={APIURL + route?.params?.data?.image}
          style={styles.image}
        />
        <Text style={styles.foodName}>{route?.params?.data?.name}</Text>
        <View>
          <AirbnbRating showRating={false} size={25} defaultRating={0} onFinishRating={(e) => {
            setReviewData((prevState) => {
              return {
                ...prevState,
                rating: e
              }
            })
          }} />
        </View>
        <TextInput
          onChangeText={(text) => {
            handleReviewText(text);
          }}
          style={styles.textInput}
          placeholder={`Please write a review for ${route?.params?.data?.name}`}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Pressable onPress={submitReview} style={styles.orderButton} >
          <Text style={styles.buttonText}>Submit Rating</Text>
        </Pressable>
        <Toast />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  ratingSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    alignItems: "center"
  },
  image: {
    alignItems: "center",
    borderRadius: 15,
    height: 210,
    width: "100%",
  },
  foodName: {
    marginVertical: 10,
    fontFamily: "Poppins-Medium",
    fontSize: 16
  },
  textInput: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    backgroundColor: "#F3F3F3",
    padding: 10,
    fontFamily: "Poppins-Medium",
    color: "#676767",
    textAlignVertical: "top",
    marginTop: 25
  },
  bottomContainer: {
    position: "absolute",
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
});