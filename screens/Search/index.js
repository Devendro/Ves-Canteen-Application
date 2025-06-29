"use client"

import {
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Keyboard,
  Text,
  StatusBar,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faArrowLeft, faXmark, faSearch, faTags } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { useNavigation } from "@react-navigation/native"
import RecentSearch from "./RecentSearch"
import Categories from "./Categories"
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { searchFoods } from "../../context/actions/food"
import { RECENT_SEARCHED } from "../../context/constants/food"

const Search = () => {
  const categoryData = useSelector((state) => state.categories.docs)
  const recentSearchedData = useSelector((state) => state.food.recentSearched)

  const navigation = useNavigation()
  const textInputRef = useRef(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSearchInput = useCallback((text) => {
    setSearchKeyword(text)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchKeyword("")
    setSearchResults([])
    textInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      textInputRef.current?.focus()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const getData = setTimeout(() => {
      if (searchKeyword?.length > 0) {
        setIsLoading(true)
        dispatch(
          searchFoods({ name: searchKeyword }, (res) => {
            setSearchResults(res?.docs || [])
            setIsLoading(false)
          }),
        )
      } else {
        setSearchResults([])
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(getData)
  }, [searchKeyword, dispatch])

  const handlePartialSearchClick = useCallback(
    (keyword) => {
      navigation.navigate("Foods", { keyword: keyword })
    },
    [navigation],
  )

  const handleCategoriesSearchClick = useCallback(
    (category) => {
      navigation.navigate("Foods", { category: category })
    },
    [navigation],
  )

  const handleSearchedResultClick = useCallback(
    (data) => {
      let updatedRecentSearches
      if (recentSearchedData?.length <= 5) {
        updatedRecentSearches = recentSearchedData.filter((obj) => obj._id !== data?._id).concat(data)
      } else {
        updatedRecentSearches = recentSearchedData.slice(1).concat(data)
      }
      dispatch({ type: RECENT_SEARCHED, data: updatedRecentSearches })
      navigation.navigate("Foods", { keyword: data.name })
    },
    [recentSearchedData, dispatch, navigation],
  )

  const removeRecentSearch = useCallback(
    (data) => {
      const updatedRecentSearches = recentSearchedData.filter((obj) => obj._id !== data?._id)
      dispatch({ type: RECENT_SEARCHED, data: updatedRecentSearches })
    },
    [recentSearchedData, dispatch],
  )

  const goBack = useCallback(() => {
    Keyboard.dismiss()
    setTimeout(() => {
      navigation.goBack()
    }, 50)
  }, [navigation])

  // Memoized components for performance
  const renderRecentSearch = useCallback(
    ({ item, index }) => (
      <RecentSearch
        title={item?.name}
        recent={true}
        index={index}
        removeRecentSearch={() => removeRecentSearch(item)}
      />
    ),
    [removeRecentSearch],
  )

  const renderSearchResult = useCallback(
    ({ item, index }) => (
      <RecentSearch
        title={item?.name}
        searchKeyword={searchKeyword}
        index={index}
        handleSearchedResultClick={() => handleSearchedResultClick(item)}
      />
    ),
    [searchKeyword, handleSearchedResultClick],
  )

  const renderCategory = useCallback(
    ({ item, index }) => (
      <Categories item={item} index={index} handleCategoriesSearchClick={handleCategoriesSearchClick} />
    ),
    [handleCategoriesSearchClick],
  )

  const hasRecentSearches = useMemo(() => recentSearchedData && recentSearchedData.length > 0, [recentSearchedData])

  const hasSearchResults = useMemo(() => searchResults && searchResults.length > 0, [searchResults])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Search Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.searchBarContainer}>
        <Animated.View sharedTransitionTag="search" style={styles.searchBar}>
          <Pressable style={styles.backButton} onPress={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} color="#6B7280" size={18} />
          </Pressable>

          <TextInput
            ref={textInputRef}
            selectionColor="#FFC300"
            style={styles.searchInput}
            placeholder="Search delicious food items..."
            placeholderTextColor="#9CA3AF"
            onChangeText={handleSearchInput}
            value={searchKeyword}
            autoFocus
          />

          {searchKeyword && (
            <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
              <FontAwesomeIcon icon={faXmark} color="#9CA3AF" size={16} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </Animated.View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {!searchKeyword ? (
          // Recent Searches & Categories
          <>
            {hasRecentSearches && (
              <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <FontAwesomeIcon icon={faSearch} size={16} color="#6B7280" />
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                </View>
                <FlatList
                  data={recentSearchedData}
                  keyExtractor={(item) => item?._id}
                  renderItem={renderRecentSearch}
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator={false}
                />
              </Animated.View>
            )}

            <Animated.View
              entering={FadeInUp.duration(400).delay(200)}
              style={[styles.section, styles.categoriesSection]}
            >
              <View style={styles.sectionHeader}>
                <FontAwesomeIcon icon={faTags} size={16} color="#6B7280" />
                <Text style={styles.sectionTitle}>Browse Categories</Text>
              </View>
              <FlatList
                data={categoryData}
                keyExtractor={(item) => item?._id}
                renderItem={renderCategory}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
              />
            </Animated.View>
          </>
        ) : (
          // Search Results
          <Animated.View entering={FadeInUp.duration(400)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <FontAwesomeIcon icon={faSearch} size={16} color="#FFC300" />
              <Text style={styles.sectionTitle}>{isLoading ? "Searching..." : `Results for "${searchKeyword}"`}</Text>
            </View>

            {/* Search for exact keyword */}
            <RecentSearch
              title={searchKeyword}
              index={0}
              handleSearchedResultClick={() => handlePartialSearchClick(searchKeyword)}
            />

            {/* Search results */}
            {hasSearchResults && (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item?._id}
                renderItem={renderSearchResult}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                style={styles.resultsList}
              />
            )}

            {!isLoading && !hasSearchResults && searchKeyword.length > 2 && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>No items found for "{searchKeyword}"</Text>
                <Text style={styles.noResultsSubtext}>Try searching with different keywords</Text>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },

  // Search Header
  searchBarContainer: {
    backgroundColor: "#FFFFFF",
    paddingTop: 8,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
    paddingLeft: 5,
    paddingRight: 15,
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  

  clearButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Content
  contentContainer: {
    flex: 1,
  },

  section: {
    backgroundColor: "#FFFFFF",
    marginTop: 8,
    paddingTop: 16,
  },

  categoriesSection: {
    flex: 1,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  resultsList: {
    marginTop: 8,
  },

  noResults: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 32,
  },

  noResultsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Poppins-SemiBold",
    textAlign: "center",
    marginBottom: 8,
  },

  noResultsSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
})

export default Search
