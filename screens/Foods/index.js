"use client"

import React, { useEffect, useCallback, useRef, useMemo, useState } from "react"
import {
  StyleSheet,
  View,
  StatusBar,
  Text,
  Pressable,
  FlatList,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import SearchBar from "../../components/SearchBar"
import { ScrollView } from "react-native-gesture-handler"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import FoodDetail from "../FoodDetail"
import {
  faCaretDown,
  faSliders,
  faXmark,
  faCheck,
  faStar,
  faFilter,
  faArrowLeft,
  faLeaf,
  faFire,
  faHeart,
  faPlus,
} from "@fortawesome/free-solid-svg-icons"
import { useDispatch } from "react-redux"
import { getFoods } from "../../context/actions/food"
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { CachedImage } from "../../utils/cachedImage"
import { APIURL } from "../../context/constants/api"

const { width, height } = Dimensions.get("window")
const ITEM_HEIGHT = 280
const SKELETON_COUNT = 6

const Foods = ({ route, state }) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const bottomSheetRef = useRef()
  const flatListRef = useRef()
  const snapPoints = useMemo(() => ["85%"], [])

  // State management
  const [page, setPage] = useState(1)
  const [isBottomSheetClose, setIsBottomSheetClose] = useState(true)
  const [filters, setFilters] = useState({
    veg: false,
    nonveg: false,
    rating: false,
  })
  const [foods, setFoods] = useState()
  const [sortBy, setSortBy] = useState("Relevance")
  const [foodDetail, setFoodDetail] = useState()
  const [sortModalVisible, setSortModalVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [imageLoadedStates, setImageLoadedStates] = useState({})
  const cardScale = useRef(new Animated.Value(1)).current

  // Animation values
  const modalAnimation = useRef(new Animated.Value(0)).current
  const scaleAnimation = useRef(new Animated.Value(0)).current
  const headerOpacity = useRef(new Animated.Value(1)).current
  const scrollY = useRef(new Animated.Value(0)).current

  const sortOptions = [
    { label: "Relevance", value: "relevance", icon: faStar },
    { label: "Price: Low to High", value: "price_asc", icon: faCaretDown },
    { label: "Price: High to Low", value: "price_desc", icon: faCaretDown },
    { label: "Rating: High to Low", value: "rating_desc", icon: faStar },
    { label: "Newest First", value: "newest", icon: faCheck },
  ]

  useEffect(() => {
    getAllFoods()
  }, [])

  // Enhanced modal animations
  useEffect(() => {
    if (sortModalVisible) {
      Animated.parallel([
        Animated.timing(modalAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 120,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(modalAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnimation, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [sortModalVisible])

  const getAllFoods = useCallback(async () => {
    setLoading(true)
    dispatch(
      getFoods(
        {
          keyword: route?.params?.keyword ? route.params.keyword : "",
          category: route?.params?.category,
          page: 1,
          limit: 12,
        },
        (res) => {
          setFoods(res)
          setLoading(false)
        },
      ),
    )
  }, [route?.params])

  const handleFilterChanges = useCallback(
    (filterOptionName) => {
      const filterObj = {
        ...filters,
        [filterOptionName]: !filters[filterOptionName],
      }
      setFilters(filterObj)
      setLoading(true)

      dispatch(
        getFoods(
          {
            keyword: route?.params?.keyword ? route.params.keyword : "",
            ...filterObj,
            page: 1,
            limit: 12,
          },
          (res) => {
            setFoods(res)
            setLoading(false)
          },
        ),
      )
    },
    [filters, route?.params],
  )

  const handleSheetChanges = useCallback((index) => {
    const isOpen = index === 0
    setIsBottomSheetClose(!isOpen)
    bottomSheetRef.current?.snapToIndex(index)
  }, [])

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />,
    [],
  )

  const handleEndReached = useCallback(() => {
    if (foods?.hasNextPage && !loadingMore) {
      setLoadingMore(true)
      dispatch(
        getFoods(
          {
            keyword: route?.params?.keyword ? route.params.keyword : "",
            category: route?.params?.category,
            page: foods.nextPage,
            limit: 12,
          },
          (res) => {
            const updatedFoods = {
              ...res,
              docs: [...foods.docs, ...res.docs],
            }
            setFoods(updatedFoods)
            setLoadingMore(false)
          },
        ),
      )
    }
  }, [foods, loadingMore, route?.params])

  const handleSortSelection = useCallback((option) => {
    setSortBy(option.label)
    setSortModalVisible(false)
    // Implement sorting logic here
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(1)
    getAllFoods().finally(() => {
      setRefreshing(false)
    })
  }, [getAllFoods])

  const getActiveFiltersCount = useCallback(() => {
    return Object.values(filters).filter(Boolean).length
  }, [filters])

  // Optimized Food Card Component
  const OptimizedFoodCard = React.memo(({ item, index }) => {
    const [imageLoaded, setImageLoaded] = useState(false)
    const handlePressIn = () => {
      Animated.spring(cardScale, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start()
    }

    const handlePressOut = () => {
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    }

    const handlePress = () => {
      setFoodDetail(item)
      handleSheetChanges(0)
    }

    return (
      <Animated.View
        style={[
          styles.foodCard,
          {
            transform: [{ scale: cardScale }],
          },
        ]}
      >
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.cardPressable}
        >
          {/* Image Container */}
          <View style={styles.imageContainer}>
            {!imageLoaded && (
              <View style={styles.imagePlaceholder}>
                <ActivityIndicator size="small" color="#FFC300" />
              </View>
            )}
            <CachedImage
              uri={item?.image ? APIURL + item.image : `https://picsum.photos/400/300?random=${item._id}`}
              style={[styles.foodImage, { opacity: imageLoaded ? 1 : 0 }]}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Image Overlay */}
            <View style={styles.imageOverlay}>
              <View style={styles.topBadges}>
                <View style={[styles.vegBadge, { backgroundColor: item?.veg ? "#4CAF50" : "#FF5722" }]}>
                  <FontAwesomeIcon icon={item?.veg ? faLeaf : faFire} size={8} color="#FFFFFF" />
                </View>
                <View style={styles.ratingBadge}>
                  <FontAwesomeIcon icon={faStar} size={8} color="#FFC300" />
                  <Text style={styles.ratingText}>{(4.0 + Math.random()).toFixed(1)}</Text>
                </View>
              </View>

              <Pressable style={styles.favoriteButton}>
                <FontAwesomeIcon icon={faHeart} size={12} color="rgba(255,255,255,0.9)" />
              </Pressable>
            </View>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={styles.foodName} numberOfLines={2}>
              {item?.name}
            </Text>
            <Text style={styles.foodCategory} numberOfLines={1}>
              {item?.categoryData?.name}
            </Text>

            <View style={styles.cardFooter}>
              <View style={styles.priceContainer}>
                <Text style={styles.foodPrice}>₹{item?.price}</Text>
                {item?.originalPrice && <Text style={styles.originalPrice}>₹{item?.originalPrice}</Text>}
              </View>

              <Pressable style={styles.addButton}>
                <FontAwesomeIcon icon={faPlus} size={12} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    )
  })

  // Skeleton Loading Component
  const SkeletonCard = React.memo(() => (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonSubtitle} />
        <View style={styles.skeletonFooter}>
          <View style={styles.skeletonPrice} />
          <View style={styles.skeletonButton} />
        </View>
      </View>
    </View>
  ))

  const renderFoodItem = useCallback(({ item, index }) => <OptimizedFoodCard item={item} index={index} />, [])

  const renderSkeletonItem = useCallback(({ index }) => <SkeletonCard key={`skeleton-${index}`} />, [])

  const keyExtractor = useCallback((item, index) => `food-${item?._id || index}`, [])

  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Enhanced Header */}
      <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
        <View style={styles.headerTop}>
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
          </Pressable>
          <Text style={styles.headerTitle}>
            Foods
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>
      </Animated.View>

      {/* Modern Filters */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filters}
          contentContainerStyle={styles.filtersContent}
        >
          {/* Sort Button */}
          <Pressable
            onPress={() => setSortModalVisible(true)}
            style={({ pressed }) => [styles.filterChip, styles.sortChip, pressed && styles.chipPressed]}
          >
            <FontAwesomeIcon icon={faSliders} color="#666" size={14} />
            <Text style={styles.chipText}>Sort</Text>
            <FontAwesomeIcon icon={faCaretDown} color="#666" size={10} />
          </Pressable>

          {/* Filter Chips */}
          <Pressable
            onPress={() => handleFilterChanges("veg")}
            style={({ pressed }) => [
              styles.filterChip,
              filters.veg && styles.activeChip,
              pressed && styles.chipPressed,
            ]}
          >
            <View style={[styles.vegDot, { backgroundColor: "#4CAF50" }]} />
            <Text style={[styles.chipText, filters.veg && styles.activeChipText]}>Pure Veg</Text>
            {filters.veg && <FontAwesomeIcon icon={faXmark} size={10} color="#FFC300" />}
          </Pressable>

          <Pressable
            onPress={() => handleFilterChanges("nonveg")}
            style={({ pressed }) => [
              styles.filterChip,
              filters.nonveg && styles.activeChip,
              pressed && styles.chipPressed,
            ]}
          >
            <View style={[styles.vegDot, { backgroundColor: "#FF5722" }]} />
            <Text style={[styles.chipText, filters.nonveg && styles.activeChipText]}>Non Veg</Text>
            {filters.nonveg && <FontAwesomeIcon icon={faXmark} size={10} color="#FFC300" />}
          </Pressable>

          <Pressable
            onPress={() => handleFilterChanges("rating")}
            style={({ pressed }) => [
              styles.filterChip,
              filters.rating && styles.activeChip,
              pressed && styles.chipPressed,
            ]}
          >
            <FontAwesomeIcon icon={faStar} color="#FFC300" size={10} />
            <Text style={[styles.chipText, filters.rating && styles.activeChipText]}>4.0+</Text>
            {filters.rating && <FontAwesomeIcon icon={faXmark} size={10} color="#FFC300" />}
          </Pressable>
        </ScrollView>

        {/* Active Filters Indicator */}
        {getActiveFiltersCount() > 0 && (
          <View style={styles.activeFiltersIndicator}>
            <FontAwesomeIcon icon={faFilter} size={10} color="#FFC300" />
            <Text style={styles.activeFiltersText}>{getActiveFiltersCount()} active</Text>
          </View>
        )}
      </View>

      {/* Food List */}
      <FlatList
        ref={flatListRef}
        data={loading ? Array(SKELETON_COUNT).fill({}) : foods?.docs || []}
        renderItem={loading ? renderSkeletonItem : renderFoodItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.row}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.foodListContent}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={10}
        initialNumToRender={6}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        ListFooterComponent={() =>
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color="#FFC300" />
              <Text style={styles.loadingMoreText}>Loading more items...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={() =>
          !loading ? (
            <View style={styles.emptyState}>
              <FontAwesomeIcon icon={faFilter} size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No items found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your filters or search terms</Text>
            </View>
          ) : null
        }
      />

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView>
          {!isBottomSheetClose && <FoodDetail isBottomSheetClose={isBottomSheetClose} data={foodDetail} />}
        </BottomSheetView>
      </BottomSheet>

      {/* Enhanced Sort Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={sortModalVisible}
        onRequestClose={() => setSortModalVisible(false)}
        statusBarTranslucent
      >
        <Animated.View style={[styles.modalOverlay, { opacity: modalAnimation }]}>
          <Pressable style={styles.modalBackdrop} onPress={() => setSortModalVisible(false)} />

          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  { scale: scaleAnimation },
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>Sort Options</Text>
              <Pressable style={styles.modalCloseButton} onPress={() => setSortModalVisible(false)}>
                <FontAwesomeIcon icon={faXmark} size={16} color="#666" />
              </Pressable>
            </View>

            {/* Sort Options */}
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {sortOptions.map((option, index) => {
                const isSelected = sortBy === option.label
                return (
                  <Pressable
                    key={index}
                    onPress={() => handleSortSelection(option)}
                    style={({ pressed }) => [
                      styles.modalOption,
                      isSelected && styles.activeModalOption,
                      pressed && styles.modalOptionPressed,
                    ]}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[styles.optionIconContainer, isSelected && styles.activeOptionIcon]}>
                        <FontAwesomeIcon icon={option.icon} size={12} color={isSelected ? "#FFC300" : "#666"} />
                      </View>
                      <Text style={[styles.modalOptionText, isSelected && styles.activeOptionText]}>
                        {option.label}
                      </Text>
                    </View>

                    {isSelected && (
                      <View style={styles.checkContainer}>
                        <FontAwesomeIcon icon={faCheck} size={14} color="#FFC300" />
                      </View>
                    )}
                  </Pressable>
                )
              })}
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <Pressable style={styles.applyButton} onPress={() => setSortModalVisible(false)}>
                <Text style={styles.applyButtonText}>Apply Sorting</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </SafeAreaView>
  )
}

export default Foods

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flex: 1,
  },

  // Header Styles
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },

  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  headerSpacer: {
    width: 40,
  },

  searchBarContainer: {
    paddingHorizontal: 20,
  },

  // Filters Styles
  filtersWrapper: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  filters: {
    paddingHorizontal: 20,
  },

  filtersContent: {
    alignItems: "center",
    gap: 12,
  },

  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
    minHeight: 40,
  },

  sortChip: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FFC300",
  },

  activeChip: {
    backgroundColor: "#FFF8E1",
    borderColor: "#FFC300",
  },

  chipPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.8,
  },

  chipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    fontFamily: "Poppins-Medium",
  },

  activeChipText: {
    color: "#B8860B",
    fontWeight: "600",
  },

  vegDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  activeFiltersIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 4,
  },

  activeFiltersText: {
    fontSize: 11,
    color: "#FFC300",
    fontWeight: "600",
  },

  // Food List Styles
  foodListContent: {
    padding: 16,
    paddingBottom: 100,
  },

  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },

  // Food Card Styles
  foodCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },

  cardPressable: {
    flex: 1,
  },

  imageContainer: {
    height: 140,
    position: "relative",
  },

  foodImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imagePlaceholder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: 12,
    justifyContent: "space-between",
  },

  topBadges: {
    flexDirection: "row",
    gap: 6,
  },

  vegBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },

  ratingText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
  },

  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    padding: 12,
  },

  foodName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
    lineHeight: 18,
    fontFamily: "Poppins-SemiBold",
  },

  foodCategory: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },

  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  foodPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  originalPrice: {
    fontSize: 11,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
  },

  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFC300",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FFC300",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Skeleton Styles
  skeletonCard: {
    width: (width - 48) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  skeletonImage: {
    height: 140,
    backgroundColor: "#F3F4F6",
  },

  skeletonContent: {
    padding: 12,
  },

  skeletonTitle: {
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },

  skeletonSubtitle: {
    height: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    marginBottom: 12,
    width: "70%",
  },

  skeletonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  skeletonPrice: {
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    width: 60,
  },

  skeletonButton: {
    width: 28,
    height: 28,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
  },

  // Loading States
  loadingMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },

  loadingMoreText: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "Poppins-SemiBold",
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    fontFamily: "Poppins-Regular",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: width * 0.9,
    maxHeight: height * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  modalHeader: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    position: "relative",
  },

  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  modalCloseButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  modalContent: {
    maxHeight: 300,
    paddingHorizontal: 20,
  },

  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 4,
  },

  activeModalOption: {
    backgroundColor: "#FFF8E1",
  },

  modalOptionPressed: {
    backgroundColor: "#F8F9FA",
    transform: [{ scale: 0.98 }],
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  optionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  activeOptionIcon: {
    backgroundColor: "#FFF8E1",
  },

  modalOptionText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },

  activeOptionText: {
    color: "#B8860B",
    fontWeight: "600",
  },

  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFF8E1",
    alignItems: "center",
    justifyContent: "center",
  },

  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  applyButton: {
    backgroundColor: "#FFC300",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#FFC300",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },

  // Bottom Sheet Styles
  bottomSheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  bottomSheetIndicator: {
    backgroundColor: "#FFC300",
    width: 40,
    height: 4,
  },
})
