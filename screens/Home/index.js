import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  Text,
  View,
  Image,
  Platform,
  ScrollView,
  FlatList,
  StatusBar,
  Pressable,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import CategoryItem from "./CategoryItem";
import { useNavigation } from "@react-navigation/native";
import Animated from "react-native-reanimated";
import PopularFoodItem from "./PopularFoodItem";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import FoodDetail from "../FoodDetail";
import { useDispatch } from "react-redux";
import { getCategories } from "../../context/actions/category";

export default function Home() {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();
  const navigation = useNavigation();
  const [categoryData, setCategoryData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const snapPoints = useMemo(() => ["85%"], []);
  useEffect(() => {
    dispatch(
      getCategories({}, (response) => {
        setCategoryData(response);
      })
    );
  }, []);

  const updatedSelectedCategory = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSheetChanges = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        // paddingTop: 43,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <ScrollView stickyHeaderIndices={[3]}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingHorizontal: 10,
            marginTop: 2,
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 75,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: -15,
            }}
          >
            <Image
              source={require("../../assets/icons/gg_menu-right.png")}
              style={{ width: 24, height: 24 }}
            />
          </View>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text
              style={{
                marginHorizontal: 90,
                fontSize: 16,
                fontWeight: "bold",
                fontFamily: "Poppins-Light",
              }}
            >
              VESIT
            </Text>
          </View>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../assets/images/actor.jpeg")}
              style={{ width: 40, height: 40, borderRadius: 10 }}
            />
          </View>
        </View>

        <Text
          style={{
            color: "#000",
            fontSize: 45,
            fontFamily: "Poppins-SemiBold",
            paddingHorizontal: 10,
          }}
        >
          Hey!
        </Text>
        <Text
          style={{
            color: "#667C8A",
            fontSize: 16,
            fontFamily: "Poppins-Medium",
            paddingHorizontal: 10,
            marginBottom: 15,
          }}
        >
          Let's get your order
        </Text>

        <View style={{ backgroundColor: "#fff", paddingBottom: 8 }}>
          <Pressable
            onPress={() => {
              navigation.navigate("Search");
            }}
          >
            <Animated.View
              sharedTransitionTag="search"
              style={{
                alignItems: "center",
                flexDirection: "row",
                marginTop: 5,
                backgroundColor: "white",
                borderRadius: 10,
                paddingHorizontal: 15,
                marginHorizontal: 10,
                ...Platform.select({
                  ios: {
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                  },
                  android: {
                    elevation: 4,
                  },
                }),
              }}
            >
              <FontAwesomeIcon icon={faSearch} color="#667C8A" size={15} />

              <View
                selectionColor={"#667C8A"}
                showSoftInputOnFocus={false}
                style={{
                  fontSize: 14,
                  width: "100%",
                  color: "#667C8A",
                  padding: 10,
                  fontFamily: "Poppins-Regular",
                  textAlignVertical: "center",
                }}
                placeholder="Search our delicious Chinese samosa"
                placeholderTextColor="#667C8A"
              >
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    color: "#667C8A",
                    textAlignVertical: "center",
                    fontSize: 14,
                  }}
                >
                  Search our delicious Chinese samosa
                </Text>
              </View>
            </Animated.View>
          </Pressable>
        </View>

        <FlatList
          data={categoryData?.docs}
          horizontal
          style={{ marginRight: 6, height: 220 }}
          renderItem={({ item, index }) => (
            <CategoryItem
              item={item}
              index={index}
              _updatedSelectedCategory={(id) => {
                updatedSelectedCategory(id);
              }}
              selectedCategory={selectedCategory}
              navigation={navigation}
            />
          )}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 18 }}>
            Popular
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontFamily: "Poppins-Medium" }}>
              View All <Text style={{ fontSize: 16 }}>{">"}</Text>{" "}
            </Text>
          </View>
        </View>

        <PopularFoodItem
          navigation={navigation}
          handleSheetChanges={(index) => {
            handleSheetChanges(index);
          }}
        />
      </ScrollView>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
      >
        <BottomSheetView
          backdropComponent={({ style }) => (
            <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
          )}
        >
          <FoodDetail />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
