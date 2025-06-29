import React, { useState, useEffect, useMemo, useRef, useCallback } from "react"
import {
  Text,
  View,
  ScrollView,
  FlatList,
  StatusBar,
  RefreshControl,
  Pressable,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  ImageBackground,
  Alert,
  Platform,
} from "react-native"
import CategoryItem from "./CategoryItem"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet"
import FoodDetail from "../FoodDetail"
import { useDispatch, useSelector } from "react-redux"
import { getCategories } from "../../context/actions/category"
import SearchBar from "../../components/SearchBar"
import { getFoods } from "../../context/actions/food"
import { TouchableOpacity } from "react-native-gesture-handler"
import { FLOATING_BUTTON } from "../../context/constants/food"
import FloatingButton from "../../components/FloatingButton"
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInLeft,
  SlideInDown,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  runOnJS,
  FadeInRight,
} from "react-native-reanimated"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faUser,
  faChevronRight,
  faUtensils,
  faClock,
  faShoppingCart,
  faMapMarkerAlt,
  faGift,
  faStar,
  faHeart,
  faLeaf,
  faFire,
  faPlus,
  faWifi,
  faExclamationTriangle,
  faCrown,
  faThumbsUp,
  faEye,
} from "@fortawesome/free-solid-svg-icons"
import { updateFavorite } from "../../context/actions/favorites"
import { CachedImage } from "../../utils/cachedImage"
import { APIURL } from "../../context/constants/api"
import { createSelector } from 'reselect'

const { width, height } = Dimensions.get("window")
const isTablet = width > 768
const cardWidth = isTablet ? (width - 60) / 3 : (width - 52) / 2

const windowWidth = Dimensions.get("window").width;
const numColumns = 3;
const horizontalPadding = 40; // 20px left + 20px right
const gap = 12;
const totalGap = gap * (numColumns - 1);
const cardWidths = (windowWidth - horizontalPadding - totalGap) / numColumns;
const CARD_WIDTH = width - 40
const CARD_SPACING = 16

// Memoized selectors to fix Redux warning
const selectCategories = (state) => state?.categories
const selectFoodData = (state) => state?.food?.foodData
const selectUser = (state) => state?.user
const selectCartItems = (state) => state?.cart?.items

// const memoizedCategorySelector = createSelector(
//   [selectCategories],
//   (categories) => categories || []
// )

// const memoizedFoodSelector = createSelector(
//   [selectFoodData],
//   (foodData) => foodData || []
// )

// const memoizedUserSelector = createSelector(
//   [selectUser],
//   (user) => user || {}
// )

// const memoizedCartSelector = createSelector(
//   [selectCartItems],
//   (items) => items || []
// )

// Enhanced Lazy Loading Hook
const useLazyLoading = (threshold = 100) => {
  const [isVisible, setIsVisible] = useState(false)
  const scrollY = useSharedValue(0)

  const checkVisibility = useCallback((event) => {
    const { contentOffset } = event.nativeEvent
    scrollY.value = contentOffset.y

    if (contentOffset.y > threshold && !isVisible) {
      runOnJS(setIsVisible)(true)
    }
  }, [threshold, isVisible])

  return { isVisible, checkVisibility, scrollY }
}

// Enhanced Skeleton Loader with better animations
const SkeletonLoader = React.memo(() => {
  const shimmerValue = useSharedValue(0)

  useEffect(() => {
    shimmerValue.value = withRepeat(
      withSequence(
        withSpring(1, { duration: 1000 }),
        withSpring(0, { duration: 1000 })
      ),
      -1,
      false
    )
  }, [])

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: 0.3 + shimmerValue.value * 0.7,
  }))

  return (
    <View style={styles.skeletonContainer}>
      {[...Array(6)].map((_, index) => (
        <Animated.View
          key={index}
          entering={FadeInUp.delay(index * 100).duration(400)}
          style={[styles.skeletonCard, shimmerStyle]}
        >
          <View style={styles.skeletonImage} />
          <View style={styles.skeletonContent}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSubtitle} />
            <View style={styles.skeletonPrice} />
          </View>
        </Animated.View>
      ))}
    </View>
  )
})

// Enhanced Popular Picks Section (replacing Special Offers)
const PopularPicks = React.memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef()

  const popularItems = useMemo(
    () => [
      {
        id: 1,
        name: "Signature Burger",
        description: "Our chef's special creation",
        rating: 4.9,
        orders: 1250,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop&auto=format&q=80",
        badge: "Most Ordered",
        color: "#FF6B6B",
      },
      {
        id: 2,
        name: "Truffle Pasta",
        description: "Premium truffle with fresh pasta",
        rating: 4.8,
        orders: 890,
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop&auto=format&q=80",
        badge: "Chef's Choice",
        color: "#4ECDC4",
      },
      {
        id: 3,
        name: "Dragon Roll",
        description: "Fresh sushi with premium ingredients",
        rating: 4.7,
        orders: 650,
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop&auto=format&q=80",
        badge: "Trending",
        color: "#45B7D1",
      },
    ],
    [],
  )

  // Auto-scroll with proper index management
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % popularItems?.length

        if (carouselRef.current) {
          carouselRef.current.scrollToOffset({
            offset: nextIndex * (CARD_WIDTH + CARD_SPACING),
            animated: true,
          })
        }

        return nextIndex
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [popularItems.length])

  // Handle manual scroll
  const handleScroll = useCallback((event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING))
    setCurrentIndex(index)
  }, [])

  const PopularCard = React.memo(({ item, index }) => (
    <Animated.View entering={FadeInRight.delay(index * 200).duration(600)} style={styles.popularCard}>
      <TouchableOpacity activeOpacity={0.9} style={styles.cardTouchable}>
        <ImageBackground source={{ uri: item.image }} style={styles.popularBackground} imageStyle={styles.popularImage}>
          {/* Lighter gradient overlay for better image visibility */}
          <View style={[styles.popularGradient, { backgroundColor: `${item.color}99` }]}>
            <View style={styles.popularContent}>
              <Animated.View
                entering={SlideInLeft.delay(300)}
                style={[styles.popularBadge, { backgroundColor: item.color }]}
              >
                <FontAwesomeIcon icon={faCrown} size={10} color="#FFFFFF" />
                <Text style={styles.popularBadgeText}>{item.badge}</Text>
              </Animated.View>

              <Animated.View entering={SlideInLeft.delay(400)} style={styles.popularInfo}>
                <Text style={styles.popularTitle}>{item.name}</Text>
                <Text style={styles.popularDescription}>{item.description}</Text>

                <View style={styles.popularStats}>
                  <View style={styles.popularStat}>
                    <FontAwesomeIcon icon={faStar} size={12} color="#FFD700" />
                    <Text style={styles.popularStatText}>{item.rating}</Text>
                  </View>
                  <View style={styles.popularStat}>
                    <FontAwesomeIcon icon={faThumbsUp} size={12} color="#FFFFFF" />
                    <Text style={styles.popularStatText}>{item.orders}+ orders</Text>
                  </View>
                </View>
              </Animated.View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  ))

  const renderItem = useCallback(({ item, index }) => <PopularCard item={item} index={index} />, [])

  const keyExtractor = useCallback((item) => item.id.toString(), [])

  const getItemLayout = useCallback(
    (data, index) => ({
      length: CARD_WIDTH + CARD_SPACING,
      offset: (CARD_WIDTH + CARD_SPACING) * index,
      index,
    }),
    [],
  )

  return (
    <Animated.View entering={FadeInUp.delay(100).duration(600)} style={styles.popularSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.popularHeaderLeft}>
          <FontAwesomeIcon icon={faCrown} size={20} color="#FFD700" />
          <Text style={styles.sectionTitle}>Popular Picks</Text>
        </View>
        <View style={styles.carouselIndicators}>
          {popularItems.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentIndex(index)
                carouselRef.current?.scrollToOffset({
                  offset: index * (CARD_WIDTH + CARD_SPACING),
                  animated: true,
                })
              }}
            >
              <Animated.View style={[styles.carouselDot, currentIndex === index && styles.carouselDotActive]} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        ref={carouselRef}
        data={popularItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.popularCarousel}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={getItemLayout}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        snapToAlignment="start"
        decelerationRate="fast"
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={3}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
      />
    </Animated.View>
  )
})

// Enhanced Network Status Component
const NetworkStatus = React.memo(({ isOnline }) => {
  if (isOnline) return null

  return (
    <Animated.View
      entering={SlideInDown.duration(300)}
      style={styles.networkBanner}
    >
      <FontAwesomeIcon icon={faWifi} size={16} color="#FFFFFF" />
      <Text style={styles.networkText}>No internet connection</Text>
    </Animated.View>
  )
})

export default function Home() {
  const dispatch = useDispatch()
  const bottomSheetRef = useRef()
  const navigation = useNavigation()
  const scrollViewRef = useRef()
  const searchBarRef = useRef()

  // Use memoized selectors
  const categoryData = useSelector(selectCategories)
  const foodsData = useSelector(selectFoodData)
  const userDetail = useSelector(selectUser)
  const cartItems = useSelector(selectCartItems)

  const [selectedCategory, setSelectedCategory] = useState("")
  const [isCategoryLoading, setIsCategoryLoading] = useState(false)
  const [isFoodLoading, setIsFoodLoading] = useState(false)
  const [isBottomSheetClose, setIsBottomSheetClose] = useState(true)
  const [foodDetail, setFoodDetail] = useState({})
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMoreData, setHasMoreData] = useState(true)
  const [isOnline, setIsOnline] = useState(true)
  const [error, setError] = useState(null)
  const [searchBarPosition, setSearchBarPosition] = useState(0)

  const snapPoints = useMemo(() => ["85%"], [])
  const { isVisible: isFoodSectionVisible, checkVisibility } = useLazyLoading(200)

  // Fix search bar position on focus
  // useFocusEffect(
  //   useCallback(() => {
  //     // Reset search bar position when screen comes into focus
  //     if (searchBarRef.current) {
  //       setSearchBarPosition(0)
  //     }
  //   }, [])
  // )

  // Enhanced data fetching with error handling
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = useCallback(async () => {
    try {
      setIsCategoryLoading(true)
      setIsFoodLoading(true)
      setError(null)

      const categoryPromise = new Promise((resolve, reject) => {
        dispatch(
          getCategories({}, (response) => {
            setIsCategoryLoading(false)
            if (response?.error) {
              reject(response.error)
            } else {
              resolve(response)
            }
          }),
        )
      })

      const foodPromise = new Promise((resolve, reject) => {
        dispatch(
          getFoods(
            {
              user: userDetail?._id,
              page: 1,
              limit: 20,
            },
            (response) => {
              setIsFoodLoading(false)
              if (response?.error) {
                reject(response.error)
              } else {
                setHasMoreData(response?.length >= 20)
                resolve(response)
              }
            },
          ),
        )
      })

      await Promise.all([categoryPromise, foodPromise])
    } catch (error) {
      setError(error.message || "Failed to load data")
      setIsCategoryLoading(false)
      setIsFoodLoading(false)
      Alert.alert("Error", "Failed to load data. Please try again.")
    }
  }, [dispatch, userDetail?._id])

  const loadMoreFoods = useCallback(() => {
    if (loading || !hasMoreData) return

    setLoading(true)
    const nextPage = page + 1

    dispatch(
      getFoods(
        {
          user: userDetail?._id,
          category: selectedCategory || undefined,
          page: nextPage,
          limit: 20,
        },
        (response) => {
          setPage(nextPage)
          setLoading(false)
          setHasMoreData(response?.length >= 20)
        },
      ),
    )
  }, [dispatch, userDetail?._id, selectedCategory, page, loading, hasMoreData])

  const updatedSelectedCategory = useCallback(
    (categoryId) => {
      if (selectedCategory === categoryId) {
        setSelectedCategory("")
        setPage(1)
        setLoading(true)
        dispatch(
          getFoods(
            {
              user: userDetail?._id,
              page: 1,
              limit: 20,
            },
            (response) => {
              setLoading(false)
              setHasMoreData(response?.length >= 20)
            },
          ),
        )
      } else {
        setSelectedCategory(categoryId)
        getFoodByCategory(categoryId)
      }
    },
    [selectedCategory, dispatch, userDetail?._id],
  )

  const getFoodByCategory = useCallback(
    (category) => {
      setLoading(true)
      setPage(1)
      dispatch(
        getFoods(
          {
            category: category,
            user: userDetail?._id,
            page: 1,
            limit: 20,
          },
          (response) => {
            setLoading(false)
            setHasMoreData(response?.length >= 20)
          },
        ),
      )
    },
    [dispatch, userDetail?._id],
  )

  const _handleLike = useCallback(
    (like, food) => {
      if (userDetail?.loggedIn) {
        dispatch(updateFavorite({ food: food, like: like }, (res) => { }))
      } else {
        Alert.alert(
          "Login Required",
          "Please login to add items to favorites",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => navigation.navigate("Login") },
          ]
        )
      }
    },
    [dispatch, userDetail?.loggedIn, navigation],
  )

  const handleSheetChanges = useCallback(
    (index) => {
      const isOpen = index === 0
      setIsBottomSheetClose(!isOpen)
      dispatch({ type: FLOATING_BUTTON, data: !isOpen })
    },
    [dispatch],
  )

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    [],
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setPage(1)
    setSelectedCategory("")
    loadInitialData().finally(() => {
      setRefreshing(false)
    })
  }, [loadInitialData])

  const getGreeting = useCallback(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }, [])

  // Enhanced Quick Actions with better animations
  const renderQuickActions = useMemo(
    () => (
      <Animated.View
        entering={FadeInUp.delay(200).duration(600)}
        style={styles.quickActionsContainer}
      >
        {[
          {
            icon: faUtensils,
            title: "Full Menu",
            subtitle: "Browse all items",
            color: "#F59E0B",
            bgColor: "#FEF3C7",
            onPress: () => navigation.navigate("Foods"),
          },
          {
            icon: faClock,
            title: "My Orders",
            subtitle: "Track orders",
            color: "#10B981",
            bgColor: "#ECFDF5",
            onPress: () => navigation.navigate("Orders"),
          },
          {
            icon: faEye,
            title: "Live Kitchen",
            subtitle: "Watch cooking",
            color: "#8B5CF6",
            bgColor: "#F3E8FF",
            onPress: () => { },
          },
        ].map((action, index) => (
          <Animated.View
            key={index}
            entering={SlideInUp.delay(300 + index * 100).duration(500)}
          >
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={action.onPress}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.bgColor }]}>
                <FontAwesomeIcon icon={action.icon} size={20} color={action.color} />
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
              {/* <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text> */}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </Animated.View>
    ),
    [navigation],
  )

  // Enhanced Lazy Loading Food Grid
  const renderLazyFoodGrid = useMemo(() => {
    if (!isFoodSectionVisible) {
      return (
        <View style={styles.lazyPlaceholder}>
          <ActivityIndicator size="large" color="#FFC300" />
          <Text style={styles.lazyPlaceholderText}>Loading delicious food...</Text>
        </View>
      )
    }

    if (!foodsData || foodsData?.length === 0) {
      return (
        <Animated.View
          entering={FadeInUp.duration(600)}
          style={styles.emptyState}
        >
          <FontAwesomeIcon icon={faUtensils} size={48} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>No items found</Text>
          <Text style={styles.emptyStateSubtitle}>
            {selectedCategory ? "Try selecting a different category" : "Check back later for trending items"}
          </Text>
        </Animated.View>
      )
    }

    const OptimizedFoodCard = React.memo(({ item, index }) => {
      const cardHeight = 200 + (index % 2) * 40
      const animationDelay = index * 50

      return (
        <Animated.View
          entering={FadeInUp.delay(animationDelay).duration(400)}
          style={[styles.foodCard, { width: cardWidth, height: cardHeight }]}
        >
          <Pressable
            style={styles.cardPressable}
            onPress={() => {
              setFoodDetail(item)
              bottomSheetRef.current?.expand()
            }}
            android_ripple={{ color: 'rgba(255, 195, 0, 0.2)' }}
          >
            <CachedImage
              uri={item?.image ? APIURL + item.image : `https://picsum.photos/400/600?random=${item._id}`}
              style={styles.cardImage}
              placeholder={
                <View style={[styles.cardImage, styles.imagePlaceholder]}>
                  <ActivityIndicator size="small" color="#FFC300" />
                </View>
              }
            />

            <View style={styles.cardOverlay}>
              <View style={styles.cardTopRow}>
                <View style={styles.cardBadges}>
                  <View style={[styles.vegBadge, { backgroundColor: item?.veg ? "#10B981" : "#EF4444" }]}>
                    <FontAwesomeIcon icon={item?.veg ? faLeaf : faFire} size={8} color="#FFFFFF" />
                  </View>
                  <View style={styles.ratingBadge}>
                    <FontAwesomeIcon icon={faStar} size={8} color="#FFC300" />
                    <Text style={styles.ratingText}>{(4.0 + Math.random()).toFixed(1)}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => _handleLike(!item?.isFavorite, item)}
                  activeOpacity={0.8}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    size={12}
                    color={item?.isFavorite ? "#EF4444" : "rgba(255,255,255,0.8)"}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.cardContent}>
                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item?.name}
                  </Text>
                  <Text style={styles.cardCategory} numberOfLines={1}>
                    {item?.categoryData?.name}
                  </Text>
                  <Text style={styles.cardPrice}>₹{item?.price}</Text>
                </View>
                <TouchableOpacity
                  style={styles.addButton}
                  activeOpacity={0.8}
                >
                  <FontAwesomeIcon icon={faPlus} size={12} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      )
    })

    // Enhanced masonry layout
    const createMasonryLayout = () => {
      const leftColumn = []
      const rightColumn = []
      const thirdColumn = isTablet ? [] : null
      let leftHeight = 0
      let rightHeight = 0
      let thirdHeight = 0

      foodsData.forEach((item, index) => {
        const cardHeight = 200 + (index % 2) * 40
        const cardData = { item, index }

        if (isTablet) {
          if (leftHeight <= rightHeight && leftHeight <= thirdHeight) {
            leftColumn.push(cardData)
            leftHeight += cardHeight + 12
          } else if (rightHeight <= thirdHeight) {
            rightColumn.push(cardData)
            rightHeight += cardHeight + 12
          } else {
            thirdColumn.push(cardData)
            thirdHeight += cardHeight + 12
          }
        } else {
          if (leftHeight <= rightHeight) {
            leftColumn.push(cardData)
            leftHeight += cardHeight + 12
          } else {
            rightColumn.push(cardData)
            rightHeight += cardHeight + 12
          }
        }
      })

      return { leftColumn, rightColumn, thirdColumn }
    }

    const { leftColumn, rightColumn, thirdColumn } = createMasonryLayout()

    return (
      <View style={styles.gridContainer}>
        <View style={styles.gridColumns}>
          <View style={styles.gridColumn}>
            {leftColumn.map((cardData) => (
              <OptimizedFoodCard
                key={`left-${cardData.item._id}`}
                item={cardData.item}
                index={cardData.index}
              />
            ))}
          </View>
          <View style={styles.gridColumn}>
            {rightColumn.map((cardData) => (
              <OptimizedFoodCard
                key={`right-${cardData.item._id}`}
                item={cardData.item}
                index={cardData.index}
              />
            ))}
          </View>
          {isTablet && thirdColumn && (
            <View style={styles.gridColumn}>
              {thirdColumn.map((cardData) => (
                <OptimizedFoodCard
                  key={`third-${cardData.item._id}`}
                  item={cardData.item}
                  index={cardData.index}
                />
              ))}
            </View>
          )}
        </View>

        {hasMoreData && !loading && (
          <Animated.View entering={FadeInUp.duration(400)}>
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={loadMoreFoods}
              activeOpacity={0.8}
            >
              <Text style={styles.loadMoreText}>Load More Items</Text>
              <FontAwesomeIcon icon={faChevronRight} size={14} color="#FFC300" />
            </TouchableOpacity>
          </Animated.View>
        )}

        {loading && (
          <Animated.View
            entering={FadeInUp.duration(300)}
            style={styles.loadingMore}
          >
            <ActivityIndicator size="small" color="#FFC300" />
            <Text style={styles.loadingMoreText}>Loading more items...</Text>
          </Animated.View>
        )}
      </View>
    )
  }, [isFoodSectionVisible, foodsData, _handleLike, hasMoreData, loading, loadMoreFoods, isTablet])

  const cartItemCount = useMemo(() => cartItems?.length, [cartItems])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      <NetworkStatus isOnline={isOnline} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        stickyHeaderIndices={[2]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FFC300"]}
            tintColor="#FFC300"
            progressBackgroundColor="#FFFFFF"
          />
        }
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        onScroll={checkVisibility}
      >
        {/* Enhanced Header */}
        <Animated.View
          entering={FadeInUp.duration(600)}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <View style={styles.locationContainer}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size={14} color="#10B981" />
              <Text style={styles.locationLabel}>VESIT Canteen</Text>
            </View>
            <Text style={styles.locationSubtext}>Main Campus • Open Now</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.cartButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Cart")}
            >
              <FontAwesomeIcon icon={faShoppingCart} size={20} color="#FFC300" />
              {cartItemCount > 0 && (
                <Animated.View
                  entering={FadeInUp.duration(300)}
                  style={styles.cartBadge}
                >
                  <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                </Animated.View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.profileButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("SettingMenu")}
              android_ripple={{ color: 'rgba(255, 195, 0, 0.2)', borderless: true }}
            >
              {userDetail?.loggedIn ? (
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {userDetail?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Text>
                </View>
              ) : (
                <View style={styles.guestAvatar}>
                  <FontAwesomeIcon icon={faUser} color="#FFC300" size={18} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Enhanced Greeting */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          style={styles.greetingSection}
        >
          <Text style={styles.greetingText}>
            {getGreeting()}
            {userDetail?.loggedIn ? `, ${userDetail?.name?.split(" ")[0] || "Friend"}!` : "!"}
          </Text>
          <Text style={styles.orderPrompt}>What delicious meal are you craving today?</Text>
        </Animated.View>

        {/* Fixed Sticky Search Bar */}
        <Animated.View
          // ref={searchBarRef}
          sharedTransitionTag="search"
          entering={FadeInDown.delay(300).duration(300)}
          style={[styles.stickySearchContainer, { transform: [{ translateX: searchBarPosition }] }]}
        >
          <SearchBar />
        </Animated.View>

        {/* <View style={styles.welcomeSeparator}>
          <View style={styles.separatorLine} />
          <View style={styles.separatorDot} />
          <View style={styles.separatorLine} />
        </View> */}

        {/* Popular Picks Section (replacing Special Offers) */}
        <PopularPicks />

        {/* Quick Actions */}
        {/* {renderQuickActions} */}

        {/* Categories Section */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={styles.categoriesSection}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <TouchableOpacity
              style={styles.viewAllButton}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <FontAwesomeIcon icon={faChevronRight} size={12} color="#FFC300" />
            </TouchableOpacity>
          </View>

          {isCategoryLoading ? (
            <SkeletonLoader />
          ) : (
            <FlatList
              data={categoryData?.docs || []}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
              renderItem={({ item, index }) => (
                <CategoryItem
                  item={item}
                  index={index}
                  _updatedSelectedCategory={updatedSelectedCategory}
                  selectedCategory={selectedCategory}
                  navigation={navigation}
                  isLoading={isCategoryLoading}
                />
              )}
              keyExtractor={(item, index) => `category-${item?._id || index}`}
              removeClippedSubviews={true}
              maxToRenderPerBatch={8}
              windowSize={8}
              getItemLayout={(data, index) => ({
                length: 120,
                offset: 120 * index,
                index,
              })}
            />
          )}
        </Animated.View>

        {/* Enhanced Food Grid with Lazy Loading */}
        <Animated.View
          entering={FadeInDown.delay(750).duration(500)}
          style={styles.popularSection}
        >
          <View style={styles.sectionHeader}>
            <View style={styles.popularTitleContainer}>
              <FontAwesomeIcon icon={faFire} size={18} color="#EF4444" />
              <Text style={styles.sectionTitle}>
                {selectedCategory ? "Filtered Items" : "Trending Now"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Foods", { category: selectedCategory })}
              style={styles.viewAllButton}
              activeOpacity={0.8}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <FontAwesomeIcon icon={faChevronRight} size={12} color="#FFC300" />
            </TouchableOpacity>
          </View>

          {isFoodLoading ? (
            <SkeletonLoader />
          ) : (
            renderLazyFoodGrid
          )}
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* <FloatingButton /> */}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
      >
        <BottomSheetView>
          {!isBottomSheetClose && (
            <FoodDetail
              isBottomSheetClose={isBottomSheetClose}
              data={foodDetail}
              _handleLike={_handleLike}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  )
}

// Enhanced styles with better performance and modern design
const styles = {
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollView: {
    flex: 1,
  },

  // Network Status
  networkBanner: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 8,
  },

  networkText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },

  // Enhanced Skeleton Loader
  skeletonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },

  skeletonCard: {
    width: cardWidth,
    height: 200,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    overflow: "hidden",
  },

  skeletonImage: {
    width: "100%",
    height: "60%",
    backgroundColor: "#E5E7EB",
  },

  skeletonContent: {
    padding: 12,
    gap: 8,
  },

  skeletonTitle: {
    height: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    width: "80%",
  },

  skeletonSubtitle: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    width: "60%",
  },

  skeletonPrice: {
    height: 14,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    width: "40%",
  },

  // Enhanced Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderColor: "#F1F1F1"
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 1 },
    //     shadowOpacity: 0.05,
    //     shadowRadius: 8,
    //   },
    //   android: {
    //     elevation: 1,
    //   },
    // }),
  },

  headerLeft: {
    flex: 1,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  locationLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  locationSubtext: {
    fontSize: 13,
    color: "#10B981",
    fontFamily: "Poppins-Medium",
    marginTop: 2,
  },

  cartButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFBEB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFC300",
    position: "relative",
  },

  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
  },

  cartBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },

  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFC300",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  userAvatarText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    fontWeight: "700",
  },

  guestAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 195, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFC300",
  },

  // Enhanced Greeting
  greetingSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 2,
  },

  greetingText: {
    color: "#1A1A1A",
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    fontWeight: "700",
    lineHeight: 34,
    marginBottom: 4,
  },

  orderPrompt: {
    color: "#6B7280",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    lineHeight: 22,
  },

  // Fixed Sticky Search
  stickySearchContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 12,
    // borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  welcomeSeparator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  separatorLine: {
    flex: 1,
    marginHorizontal: 20,
    height: 1,
    backgroundColor: "rgba(255, 195, 0, 0.3)",
  },

  separatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFC300",
    marginHorizontal: 12,
  },

  // Enhanced Popular Picks (replacing Special Offers)
  popularSection: {
    paddingVertical: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  popularHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  popularCarousel: {
    paddingLeft: 20,
    paddingRight: 4, // Reduced right padding to prevent cut-off
  },

  popularCard: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 24,
    overflow: "hidden",
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 8 },
    //     shadowOpacity: 0.15,
    //     shadowRadius: 16,
    //   },
    //   android: {
    //     elevation: 6,
    //   },
    // }),
  },

  cardTouchable: {
    width: "100%",
    height: "100%",
  },

  popularBackground: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },

  popularImage: {
    borderRadius: 24,
  },

  popularGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    // Lighter gradient for better image visibility
  },

  popularContent: {
    padding: 20,
    justifyContent: "space-between",
    height: "100%",
  },

  popularBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 4,
    // Enhanced shadow for badge
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  popularBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
  },

  popularInfo: {
    marginTop: "auto",
  },

  popularTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  popularDescription: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.95)",
    fontFamily: "Poppins-Medium",
    marginBottom: 12,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  popularStats: {
    flexDirection: "row",
    gap: 16,
  },

  popularStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  popularStatText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  carouselIndicators: {
    flexDirection: "row",
    gap: 6,
  },

  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },

  carouselDotActive: {
    backgroundColor: "#FFC300",
    width: 20,
  },

  // Enhanced Quick <Actions></Actions>
  quickActionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },

  quickActionCard: {
    width: cardWidths,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F3F4F6",
    minHeight: 120,
    justifyContent: "center",
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  quickActionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
    textAlign: "center",
  },

  quickActionSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },

  // Categories and sections
  categoriesSection: {
    paddingVertical: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  sectionTitle: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  popularTitleContainer: {
    flexDirection: "row",
    // paddingHorizontal: 20,
    alignItems: "center",
    gap: 8,
  },

  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  viewAllText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#FFC300",
    fontWeight: "600",
  },

  categoriesList: {
    paddingLeft: 20,
    paddingRight: 10,
  },

  // Lazy Loading
  lazyPlaceholder: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  lazyPlaceholderText: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
    marginTop: 16,
  },

  // Enhanced Grid
  gridContainer: {
    paddingHorizontal: 20,
  },

  gridColumns: {
    flexDirection: "row",
    gap: 12,
  },

  gridColumn: {
    flex: 1,
    gap: 12,
  },

  foodCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  cardPressable: {
    width: "100%",
    height: "100%",
  },

  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  imagePlaceholder: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  cardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 12,
    justifyContent: "space-between",
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  cardBadges: {
    flexDirection: "row",
    gap: 6,
  },

  vegBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },

  ratingText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
  },

  heartButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  cardTextContainer: {
    flex: 1,
    paddingRight: 8,
  },

  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    marginBottom: 3,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    lineHeight: 16,
  },

  cardCategory: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Poppins-Medium",
    marginBottom: 3,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  cardPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFC300",
    fontFamily: "Poppins-Bold",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFC300",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#FFC300",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  loadMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFC300",
    gap: 8,
  },

  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
  },

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

  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Poppins-SemiBold",
    marginTop: 16,
    marginBottom: 8,
  },

  emptyStateSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: 20,
  },

  bottomSpacing: {
    height: 100,
  },

  bottomSheetBackground: {
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  bottomSheetIndicator: {
    backgroundColor: "#D1D5DB",
    width: 40,
    height: 4,
  },
}