import { StyleSheet, View, StatusBar, Text, Pressable, FlatList } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCaretDown,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import FoodCard from "../../components/FoodCard";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { getFoods } from "../../context/actions/food";

const Foods = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({
    veg: false,
    nonveg: false,
    rating: false,
  });
  const [foods, setFoods] = useState()
  const [sortBy, setSortBy] = useState();

  /**
   * @description useEffect to call functions on initial screen load
   */
  useEffect(() => {
    console.log(route.params)
    getAllFoods();
  }, []);

  /**
   * @description This function will called on Initial screen load to show all the foods
   */
  const getAllFoods = () => {
    dispatch(
      getFoods({keyword: route?.params?.keyword ? route.params.keyword : "Idli"}, (res) => {
        setFoods(res);
      })
    );
  };

  const handleFilterChanges = (filterOptionName) => {
    setFilters((previousState) => {
      return {
        ...previousState,
        [filterOptionName]: !previousState[filterOptionName],
      };
    });
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
        <FoodCard data={item}/>
      )}
      />
      {/* <ScrollView>
        <FoodCard />
        <FoodCard />
        <FoodCard />
        <FoodCard />
      </ScrollView> */}
    </View>
  );
};

export default Foods;

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingTop: 18,
  },
  filters: {
    height: 38,
    margin: 10,
  },
  filterOption: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 5,
    borderWidth: 0.7,
    // borderColor: "#DADADA",
    borderRadius: 7,
    // backgroundColor: "rgba(255, 195, 0, 0.1)",
  },
  filterText: {
    fontFamily: "Poppins-Medium",
    color: "#000",
  },
});
