import { StyleSheet, View, StatusBar, Text } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import SearchBar from "../../components/SearchBar";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faCaretDown,
  faSliders,
  faSortDown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import FoodCard from "../../components/FoodCard";
import { useState } from "react";

const Foods = () => {
  const navigation = useNavigation();
  const [filters, setfilters] = useState({
    rating: false,
  });
  const [sortBy, setSortBy] = useState();
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
        <View style={styles.filterOption}>
          <FontAwesomeIcon icon={faSliders} />
          <Text style={styles.filterText}>Sort</Text>
          <FontAwesomeIcon icon={faCaretDown} />
        </View>
        <View style={styles.filterOption}>
          <Text style={styles.filterText}>Pure Veg</Text>
          {/* <FontAwesomeIcon icon={faXmark} /> */}
        </View>
        <View style={styles.filterOption}>
          <Text style={styles.filterText}>Non veg</Text>
          {/* <FontAwesomeIcon icon={faXmark} /> */}
        </View>
        <View style={styles.filterOption}>
          <Text style={styles.filterText}>Rating 4.0+</Text>
          {/* <FontAwesomeIcon icon={faXmark} /> */}
        </View>
      </ScrollView>
      <ScrollView>
        <FoodCard />
        <FoodCard />

        <FoodCard />

        <FoodCard />
      </ScrollView>
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
    borderColor: "#DADADA",
    borderRadius: 7,
  },
  filterText: {
    fontFamily: "Poppins-SemiBold",
    color: "#000",
  },
});
