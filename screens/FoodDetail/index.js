import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import LottieView from "lottie-react-native";
import { AirbnbRating, Rating } from "react-native-ratings";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const FoodDetail = ({ data }) => {
  const likeRef = useRef();
  const [liked, setLiked] = useState(false);
  /**
   * @description this function is to add food to favourite
   */
  const handleLike = () => {
    if (liked) {
      likeRef?.current?.play(60, 0);
    } else {
      likeRef?.current?.play(0, 60);
    }
    setLiked(!liked);
  };
  return (
    <View style={styles.container}>
      <View style={styles.foodImage}>
        <Image
          source={require("../../assets/images/Noodlessss.jpg")}
          style={{
            alignItems: "center",
            borderRadius: 20,
            height: 210,
            width: "100%",
          }}
        />
      </View>
      <View style={styles.foodDetail}>
        <View style={styles.titleContainer}>
          <Text style={styles.foodTitle}>{data?.name}</Text>
          <Pressable onPress={handleLike}>
            <LottieView
              ref={likeRef}
              style={{ width: 50, height: 50 }}
              source={require("../../assets/images/Liked.json")}
              loop={false}
            />
          </Pressable>
        </View>
        <View>
          <AirbnbRating
            defaultRating={2.5}
            showRating= {false}
            isDisabled= {true}
            size={12}
            starContainerStyle={{width: 200}}
          />
          <Text>61 Ratings</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 20,
    backgroundColor: "white",
  },
  foodDetail: {
    paddingHorizontal: 5,
  },
  titleContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  foodTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
});

export default FoodDetail;
