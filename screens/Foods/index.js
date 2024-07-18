import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Pressable,
  FlatList,
} from "react-native";
import React, { useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import FoodDetail from "../FoodDetail";
import {
  faCaretDown,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import FoodCard from "../../components/FoodCard";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getFoods } from "../../context/actions/food";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";

const Foods = ({ route, state }) => {
  const navigation = useNavigation();
  const [page, setPage] = useState(1)
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();
  const snapPoints = useMemo(() => ["85%"], []);
  const [isBottomSheetClose, setIsBottomSheetClose] = useState(false);
  const [filters, setFilters] = useState({
    veg: false,
    nonveg: false,
    rating: false,
  });
  const [foods, setFoods] = useState();
  const [sortBy, setSortBy] = useState();
  const [foodDetail, setFoodDetail] = useState();

  /**
   * @description useEffect to call functions on initial screen load
   */
  useEffect(() => {
    getAllFoods();
  }, []);

  /**
   * @description This function will called on Initial screen load to show all the foods
   */
  const getAllFoods = () => {
    dispatch(
      getFoods(
        { keyword: route?.params?.keyword ? route.params.keyword : "", category: route?.params?.category, page: 1 },
        (res) => {
          setFoods(res);
        }
      )
    );
  };

  /**
   * @description This function will called to handle changes in filters for food
   * @param {filterOptionName} string
   */
  const handleFilterChanges = (filterOptionName) => {
    const filterObj = {
      ...filters,
      [filterOptionName]: !filters[filterOptionName]
    }
    setFilters((previousState) => {
      return {
        ...previousState,
        [filterOptionName]: !previousState[filterOptionName],
      };
    });
    dispatch(
      getFoods(
        { keyword: route?.params?.keyword ? route.params.keyword : "", ...filterObj },
        (res) => {
          setFoods(res);
        }
      )
    );
  };

  /**
   * @description This function will called on click on food card to open bottom sheet
   * @param {number} index
   */
  const handleSheetChanges = useCallback((index, data) => {
    index == 0 ? setIsBottomSheetClose(false) : setIsBottomSheetClose(true);
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

  /**
   * @description This function will be called when the FlatList is scrolled to the bottom
   */
  const handleEndReached = () => {
    if (foods.hasNextPage) {
      if (foods.page == page) {
        setPage(foods.nextPage)
        dispatch(
          getFoods(
            { keyword: route?.params?.keyword ? route.params.keyword : "", category: route?.params?.category, page: foods.nextPage },
            (res) => {
              let arr = [...foods.docs, ...res.docs]
              let obj = {...res}
              obj.docs = arr
              setFoods(obj)
            }
          )
        );
      }

    }

  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <ScrollView
        horizontal={true}
        style={styles.filters}
        contentContainerStyle={{
          columnGap: 10,
        }}
      >
        <View style={{ ...styles.filterOption, borderColor: "#DADADA" }}>
          <FontAwesomeIcon icon={faSliders} />
          <Text style={styles.filterText}>Sort</Text>
          <FontAwesomeIcon icon={faCaretDown} />
        </View>

        <Pressable
          onPress={() => {
            handleFilterChanges("veg");
          }}
        >
          <View
            style={{
              ...styles.filterOption,
              backgroundColor: filters.veg
                ? "rgba(255, 195, 0, 0.1)"
                : "#FFFFFF",
              borderColor: filters.veg ? "rgba(255, 195, 0, 0.5)" : "#DADADA",
            }}
          >
            <Text style={styles.filterText}>Pure Veg</Text>
            {filters?.veg && <FontAwesomeIcon icon={faXmark} />}
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            handleFilterChanges("nonveg");
          }}
        >
          <View
            style={{
              ...styles.filterOption,
              backgroundColor: filters.nonveg
                ? "rgba(255, 195, 0, 0.1)"
                : "#FFFFFF",
              borderColor: filters.nonveg
                ? "rgba(255, 195, 0, 0.5)"
                : "#DADADA",
            }}
          >
            <Text style={styles.filterText}>Non veg</Text>
            {filters.nonveg && <FontAwesomeIcon icon={faXmark} />}
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            handleFilterChanges("rating");
          }}
        >
          <View
            style={{
              ...styles.filterOption,
              backgroundColor: filters.rating
                ? "rgba(255, 195, 0, 0.1)"
                : "#FFFFFF",
              borderColor: filters.rating
                ? "rgba(255, 195, 0, 0.5)"
                : "#DADADA",
            }}
          >
            <Text style={styles.filterText}>Rating 4.0+</Text>
            {filters.rating && <FontAwesomeIcon icon={faXmark} />}
          </View>
        </Pressable>
      </ScrollView>

      <FlatList
        data={foods?.docs}
        renderItem={({ item, index }) => (
          <FoodCard
            data={item}
            handleSheetChanges={(index, data) => {
              setFoodDetail(item);
              handleSheetChanges(index, data);
            }}
          />
        )}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5} // Adjust the threshold as needed
      />
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
};

export default Foods;

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingTop: 18,
  },
  filters: {
    margin: 10,
    minHeight: 35,
  },
  filterOption: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 5,
    borderWidth: 0.7,
    borderRadius: 7,
    minHeight: 35
  },
  filterText: {
    fontFamily: "Poppins-Medium",
    color: "#000",
  },
});
