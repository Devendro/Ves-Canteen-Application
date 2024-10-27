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
  ScrollView,
  FlatList,
  StatusBar,
  RefreshControl,
  Pressable,
  ActivityIndicator
} from "react-native";
import CategoryItem from "./CategoryItem";
import { useNavigation } from "@react-navigation/native";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import FoodDetail from "../FoodDetail";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../context/actions/category";
import SearchBar from "../../components/SearchBar";
import FoodCard from "../../components/FoodCard";
import UnloadedFoodCard from "../../components/UnloadedFoodCard";
import { getFoods } from "../../context/actions/food";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FLOATING_BUTTON } from "../../context/constants/food";
import FloatingButton from "../../components/FloatingButton";
import Animated from "react-native-reanimated";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();
  const navigation = useNavigation();
  const [categoryData, setCategoryData] = useState({});
  const [foods, setFoods] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isFoodLoading, setIsFoodLoading] = useState(false);
  const [isBottomSheetClose, setIsBottomSheetClose] = useState(false);
  const [foodDetail, setFoodDetail] = useState({});
  const [loading, setLoading] = useState(false);
  const snapPoints = useMemo(() => ["85%"], []);
  const userDetail = useSelector((state) => state?.user)
  useEffect(() => {
    setIsCategoryLoading(true);
    setIsFoodLoading(true);
    dispatch(
      getCategories({}, (response) => {
        setCategoryData(response);
        setIsCategoryLoading(false);
      })
    );

    dispatch(
      getFoods({}, (response) => {
        setFoods(response);
        setIsFoodLoading(false);
      })
    );
  }, []);

  const updatedSelectedCategory = (categoryId) => {
    if (selectedCategory == categoryId) {
      setLoading(true)
      setSelectedCategory("")
      dispatch(
        getFoods({}, (response) => {
          setFoods(response);
          setIsFoodLoading(false);
          setLoading(false)
        })
      );
    } else {
      setSelectedCategory(categoryId);
    }
  };

  const handleSheetChanges = useCallback((index) => {
    index == 0 ? setIsBottomSheetClose(false) : setIsBottomSheetClose(true);
    index == 0
      ? dispatch({ type: FLOATING_BUTTON, data: false })
      : dispatch({ type: FLOATING_BUTTON, data: true });
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

  const getFoodByCategory = (category) => {
    setLoading(true)
    setIsFoodLoading(true);
    dispatch(
      getFoods({ category: category }, (response) => {
        setFoods(response);
        setIsFoodLoading(false);
        setLoading(false);
      })
    );
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        // paddingTop: 43,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#FFF"/>
      <ScrollView stickyHeaderIndices={[3]} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            paddingHorizontal: 5,
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
          <Pressable
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.navigate("SettingMenu");
            }}
          >
            {userDetail?.loggedIn ? <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: "rgba(255, 195, 0, 0.2)",
                textAlign: "center",
                alignItems: "center",
                justifyContent: 'center'
              }}>
              <Text style={{
                color: "#FFC300",
                fontFamily: "Poppins-SemiBold",
                fontSize: 20,
                marginTop: 4
              }}>{userDetail?.name?.charAt(0)}</Text>
            </View> : <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                backgroundColor: "rgba(255, 195, 0, 0.2)",
                textAlign: "center",
                alignItems: "center",
                justifyContent: 'center'
              }}>
              <FontAwesomeIcon icon={faUser} color="#FFC300"/>
            </View>}
            {/* <Image
              source={require("../../assets/images/actor.jpeg")}
              style={{ width: 40, height: 40, borderRadius: 10 }}
            /> */}
          </Pressable>
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
          <SearchBar />
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
                if (selectedCategory !== id) { getFoodByCategory(id) };
                updatedSelectedCategory(id);
              }}
              selectedCategory={selectedCategory}
              navigation={navigation}
              isLoading={isCategoryLoading}
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
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Foods", { category: selectedCategory });
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text style={{ fontFamily: "Poppins-Medium" }}>
              View All <Text style={{ fontSize: 16 }}>{">"}</Text>{" "}
            </Text>
          </TouchableOpacity>
        </View>
        {loading && <ActivityIndicator size={"large"} />}
        {foods &&
          foods?.docs?.map((item, key) => {
            return (
              <FoodCard
                data={item}
                key={item?._id}
                handleSheetChanges={(index) => {
                  setFoodDetail(item);
                  handleSheetChanges(index);
                }}
              />
            );
          })}
        {isFoodLoading && (
          <View>
            <UnloadedFoodCard />
            <UnloadedFoodCard />
            <UnloadedFoodCard />
            <UnloadedFoodCard />
            <UnloadedFoodCard />
          </View>
        )}
      </ScrollView>
      <FloatingButton />
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={{
          backgroundColor: "#f2f2f2",
        }}
      // onClose={()=>{setFoodDetail({})}}
      >
        <BottomSheetView
          backdropComponent={({ style }) => (
            <View style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]} />
          )}
        >
          <FoodDetail
            isBottomSheetClose={isBottomSheetClose}
            data={foodDetail}
          />
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
