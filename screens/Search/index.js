import {
  StyleSheet,
  TextInput,
  View,
  Platform,
  Pressable,
  Keyboard,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState, useRef } from "react";
import Animated from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import RecentSearch from "./RecentSearch";
import Categories from "./Categories";
import { useSelector } from "react-redux";

const Search = () => {
  const categoryData = useSelector((state) => state.categories.docs);
  const navigation = useNavigation();
  const textInputRef = useRef(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isloaded, setIsloaded] = useState(false);

  // handle search input function
  const handleSearchInput = (text) => {
    setSearchKeyword(text);
  };

  useEffect(() => {
    setIsloaded(true);
    setTimeout(() => {
      textInputRef.current.focus();
    }, 500);
  }, []);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.searchBarContainer}>
        <Animated.View sharedTransitionTag="search" style={styles.searchBar}>
          <Pressable
            style={{ flex: 0.05 }}
            onPress={() => {
              Keyboard.dismiss();
              setTimeout(() => {
                navigation.goBack();
              }, 50);
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} color="#667C8A" size={15} />
          </Pressable>

          <TextInput
            ref={textInputRef}
            selectionColor={"#667C8A"}
            style={styles.searchInput}
            placeholder="Search our delicious Chinese samosa"
            placeholderTextColor="#667C8A"
            onChangeText={handleSearchInput}
            value={searchKeyword}
            autoFocus
          />
          {searchKeyword && (
            <TouchableOpacity
              style={{ flex: 0.04 }}
              onPress={() => {
                handleSearchInput("");
              }}
            >
              <FontAwesomeIcon icon={faXmark} color="#667C8A" size={15} />
            </TouchableOpacity>
          )}
        </Animated.View>
        <Text style={styles.recentSearchHead}>Recent Search</Text>
        {searchKeyword && (
          <View style={styles.recentSearch}>
            <RecentSearch title={"Aloo Paratha"} searchKeyword={searchKeyword}/>
            <RecentSearch title={"Vada Pav"} searchKeyword={searchKeyword}/>
            <RecentSearch title={"Mini Lunch"} searchKeyword={searchKeyword}/>
          </View>
        )}
        {!searchKeyword && (
          <View style={styles.recentSearch}>
            <RecentSearch title={"Aloo Paratha"} recent={true} />
            <RecentSearch title={"Vada Pav"} recent={true} />
            <RecentSearch title={"Mini Lunch"} recent={true} />
          </View>
        )}
      </View>
      {!searchKeyword && (
        <View style={styles.categories}>
          <View>
            <Text style={styles.categoriesHead}>Categories Available</Text>
          </View>
          <FlatList
            data={categoryData}
            keyExtractor={(item) => item?._id}
            renderItem={({ item, index }) => (
              <Categories item={item} index={index} navigation={navigation} />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchBarContainer: {
    backgroundColor: "#fff",
    paddingTop: 18,
    paddingBottom: 8,
    paddingHorizontal: 10,
    // flex:
  },
  searchInput: {
    flex: 0.91,
    fontSize: 14,
    width: "100%",
    color: "#667C8A",
    padding: 8,
    marginTop: 2,
    fontFamily: "Poppins-Regular",
    alignItems: "center", // This line isn't necessary for vertical centering
    textAlignVertical: "center", // Add this line for vertical centering
  },
  searchBar: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 5,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
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
  },
  recentSearchHead: {
    marginTop: 14,
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  recentSearch: {
    marginTop: 8,
    backgroundColor: "#fff",
  },
  categories: {
    marginTop: 8,
    backgroundColor: "#fff",
  },
  categoriesHead: {
    marginVertical: 8,
    fontSize: 12,
    paddingLeft: 15,
    fontFamily: "Poppins-Regular",
  },
});