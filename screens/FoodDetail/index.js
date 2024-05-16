import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import LottieView from "lottie-react-native";
import { AirbnbRating } from "react-native-ratings";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native";

const FoodDetail = ({ data }) => {
  const likeRef = useRef();
  const [liked, setLiked] = useState(false);
  const [ itemCount, setItemCount] = useState(1);
  
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
    <View style={styles.bottomSheetContainer}>
      <ScrollView
        contentContainerStyle={styles.topContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.foodImage}>
            <Image
              source={
                require("../../assets/images/Noodlessss.jpg")
              }
              style={{
                alignItems: "center",
                borderRadius: 20,
                height: 210,
                width: "100%",
              }}
            />
          </View>
          <View style={styles.foodDetail}>
            <View style={styles.topFoodHeader}>
              <Image
                source={data?.veg
                  ? require("../../assets/images/veg.png")
                  : require("../../assets/images/nonveg.png")}
                style={{ width: 15, height: 15 }}
              />
              <Text style={styles.category}>{data?.categoryData?.name}</Text>
            </View>
            <View style={styles.titleContainer}>
              <View style={{ paddingTop: 0, paddingBottom: 10 }}>
                <Text style={styles.foodTitle}>{data?.name}</Text>
                <View style={{ flexDirection: "row", gap: 7 }}>
                  <AirbnbRating
                    defaultRating={2.5}
                    showRating={false}
                    isDisabled={true}
                    size={12}
                    starStyle={{ marginHorizontal: -5 }}
                    starContainerStyle={styles.starContainerStyle}
                  />
                  <Text style={styles.ratingText}>61 Ratings</Text>
                </View>
              </View>
              <Pressable onPress={handleLike} style={{ marginTop: -40 }}>
                <LottieView
                  ref={likeRef}
                  style={{ width: 50, height: 50 }}
                  source={require("../../assets/images/Liked.json")}
                  loop={false}
                />
              </Pressable>
            </View>
            <View>
              <Text style={styles.description}>{data?.description}</Text>
            </View>
          </View>
        </View>
        <View style={{...styles.container, marginBottom: 90, paddingBottom: 8}}>
          <View style={{padding: 5}}>
            <Text style={styles.textInputHead}>
            Add Preparing Instructions (Optional)
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Eg: Don't make it spicy"
          />
          </View>
          
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View style={styles.cartItemCount}>
          <Text style={styles.cartItemCountSign}>-</Text>
          <Text style={styles.cartItemCountValue}>{itemCount}</Text>
          <Text style={styles.cartItemCountSign}>+</Text>
        </View>
        <Pressable style={styles.addToCart}>
          <Text style={styles.cartText}>Add Item: ₹{data?.price}</Text>
          {/* <Text style={styles.cartText}></Text> */}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {},
  topContainer: {
    marginHorizontal: 10,
    gap: 8,
  },
  container: {
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 20,
    borderRadius: 20,
    backgroundColor: "white",
  },
  foodDetail: {
    paddingHorizontal: 5,
  },
  topFoodHeader: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  category: {
    color: "#676767",
    paddingTop: 3,
    fontFamily: "Poppins-Medium",
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
  starContainerStyle: {
    gap: 0,
    borderRadius: 5,
    width: 80,
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 195, 0, 0.3)",
    paddingHorizontal: 10,
  },
  ratingText: {
    paddingTop: 3,
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  description: {
    fontFamily: "Poppins-Medium",
    color: "#676767",
  },
  textInputHead: {
    fontFamily: "Poppins-SemiBold",
    paddingVertical: 5,
  },
  textInput: {
    height: 110,
    borderRadius: 15,
    backgroundColor: "#F3F3F3",
    padding: 10,
    fontFamily: "Poppins-Medium",
    color: "#676767",
    textAlignVertical: 'top'
  },
  bottomContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    position: "absolute",
    bottom: 0,
    padding: 15,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cartItemCount: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderColor: "#FFC300",
    alignItems: "center",
    paddingVertical: 6.5,
    borderRadius: 2.5,
    borderWidth: 1,
    width: 100,
  },
  cartItemCountSign: {
    flex: 1,
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#FFC300",
    textAlign: "center",
  },
  cartItemCountValue: {
    flex: 1,
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    textAlign: "center",
  },
  addToCart:{
    alignItems: "center",
    backgroundColor: "#FFC300",
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 7
  },
  cartText:{
    marginTop: 2,
    color: "#FFF",
    fontFamily: "Poppins-SemiBold"
  }
});

export default FoodDetail;
