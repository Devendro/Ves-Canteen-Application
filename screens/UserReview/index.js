"use client"

import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native"
import { useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faStar,
  faFilter,
  faSort,
  faTimes,
  faCheck,
  faUser,
  faCalendarDays,
  faUtensils,
  faChevronDown,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons"
import Header from "../../components/Header"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { CachedImage } from "../../utils/cachedImage"
import { APIURL } from "../../context/constants/api"

const { width } = Dimensions.get("window")

const UserReviews = () => {
  const [reviews, setReviews] = useState([])
  const [filteredReviews, setFilteredReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    rating: "all",
    sortBy: "newest",
  })

  // Mock data - replace with actual API call
  const mockReviews = [
    {
      _id: "6699780b54c4a55c20b46d56",
      deleted: false,
      food: {
        _id: "665cb4976ccf483e206f092c",
        name: "Chicken Biryani",
        image: "/uploads/chicken-biryani.jpg",
        price: 120,
      },
      rating: 5,
      orderId: "669973f9a7997f7ba81124b6",
      comment: "Absolutely delicious! The flavors were perfect and the portion size was generous. Will definitely order again!",
      user: {
        _id: "664dcec751cb122098f0d929",
        name: "Rahul Sharma",
      },
      createdAt: new Date("2024-07-18T20:16:11.882Z"),
      updatedAt: new Date("2024-07-18T20:16:11.882Z"),
    },
    {
      _id: "6699780b54c4a55c20b46d57",
      deleted: false,
      food: {
        _id: "665cb4976ccf483e206f092d",
        name: "Margherita Pizza",
        image: "/uploads/margherita-pizza.jpg",
        price: 180,
      },
      rating: 4,
      orderId: "669973f9a7997f7ba81124b7",
      comment: "Good taste but could use more cheese. Overall satisfied with the quality.",
      user: {
        _id: "664dcec751cb122098f0d930",
        name: "Priya Patel",
      },
      createdAt: new Date("2024-07-17T15:30:22.123Z"),
      updatedAt: new Date("2024-07-17T15:30:22.123Z"),
    },
    {
      _id: "6699780b54c4a55c20b46d58",
      deleted: false,
      food: {
        _id: "665cb4976ccf483e206f092e",
        name: "Masala Dosa",
        image: "/uploads/masala-dosa.jpg",
        price: 80,
      },
      rating: 5,
      orderId: "669973f9a7997f7ba81124b8",
      comment: "Crispy and perfectly cooked! The sambhar and chutney were excellent too.",
      user: {
        _id: "664dcec751cb122098f0d931",
        name: "Amit Kumar",
      },
      createdAt: new Date("2024-07-16T12:45:33.456Z"),
      updatedAt: new Date("2024-07-16T12:45:33.456Z"),
    },
    {
      _id: "6699780b54c4a55c20b46d59",
      deleted: false,
      food: {
        _id: "665cb4976ccf483e206f092f",
        name: "Veg Burger",
        image: "/uploads/veg-burger.jpg",
        price: 60,
      },
      rating: 3,
      orderId: "669973f9a7997f7ba81124b9",
      comment: "Average taste. The patty was a bit dry but the service was quick.",
      user: {
        _id: "664dcec751cb122098f0d932",
        name: "Sneha Joshi",
      },
      createdAt: new Date("2024-07-15T18:20:44.789Z"),
      updatedAt: new Date("2024-07-15T18:20:44.789Z"),
    },
    {
      _id: "6699780b54c4a55c20b46d60",
      deleted: false,
      food: {
        _id: "665cb4976ccf483e206f0930",
        name: "Paneer Butter Masala",
        image: "/uploads/paneer-butter-masala.jpg",
        price: 140,
      },
      rating: 5,
      orderId: "669973f9a7997f7ba81124c0",
      comment: "Outstanding! Rich, creamy, and full of flavor. Best paneer dish I've had in the canteen.",
      user: {
        _id: "664dcec751cb122098f0d933",
        name: "Vikash Singh",
      },
      createdAt: new Date("2024-07-14T14:10:55.321Z"),
      updatedAt: new Date("2024-07-14T14:10:55.321Z"),
    },
  ]

  const filterOptions = {
    rating: [
      { key: "all", label: "All Ratings" },
      { key: "5", label: "5 Stars" },
      { key: "4", label: "4 Stars" },
      { key: "3", label: "3 Stars" },
      { key: "2", label: "2 Stars" },
      { key: "1", label: "1 Star" },
    ],
    sortBy: [
      { key: "newest", label: "Newest First" },
      { key: "oldest", label: "Oldest First" },
      { key: "highest", label: "Highest Rating" },
      { key: "lowest", label: "Lowest Rating" },
    ],
  }

  useEffect(() => {
    loadReviews()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [reviews, activeFilters])

  const loadReviews = () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setReviews(mockReviews)
      setLoading(false)
    }, 1000)
  }

  const refreshReviews = () => {
    setRefreshing(true)
    setTimeout(() => {
      setReviews(mockReviews)
      setRefreshing(false)
    }, 1000)
  }

  const applyFilters = () => {
    let filtered = [...reviews]

    // Rating filter
    if (activeFilters.rating !== "all") {
      filtered = filtered.filter((review) => review.rating === parseInt(activeFilters.rating))
    }

    // Sort
    filtered.sort((a, b) => {
      switch (activeFilters.sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    setFilteredReviews(filtered)
  }

  const updateFilter = (category, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const clearFilters = () => {
    setActiveFilters({
      rating: "all",
      sortBy: "newest",
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (activeFilters.rating !== "all") count++
    if (activeFilters.sortBy !== "newest") count++
    return count
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          size={14}
          color={i <= rating ? "#FFC300" : "#E5E7EB"}
          style={styles.starIcon}
        />,
      )
    }
    return stars
  }

  const getAverageRating = () => {
    if (filteredReviews.length === 0) return 0
    const sum = filteredReviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / filteredReviews.length).toFixed(1)
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    filteredReviews.forEach((review) => {
      distribution[review.rating]++
    })
    return distribution
  }

  const renderReviewCard = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)} style={styles.reviewCard}>
      {/* Review Header */}
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>{item.user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <View style={styles.reviewMeta}>
              <FontAwesomeIcon icon={faCalendarDays} size={12} color="#9CA3AF" />
              <Text style={styles.reviewDate}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>{renderStars(item.rating)}</View>
          <Text style={styles.ratingText}>{item.rating}.0</Text>
        </View>
      </View>

      {/* Food Info */}
      <View style={styles.foodInfo}>
        <CachedImage uri={APIURL + item.food.image} style={styles.foodImage} />
        <View style={styles.foodDetails}>
          <Text style={styles.foodName}>{item.food.name}</Text>
          <Text style={styles.foodPrice}>₹{item.food.price}</Text>
        </View>
      </View>

      {/* Review Comment */}
      {item.comment && (
        <View style={styles.commentContainer}>
          <Text style={styles.commentText}>{item.comment}</Text>
        </View>
      )}

      {/* Order ID */}
      <View style={styles.orderInfo}>
        <FontAwesomeIcon icon={faUtensils} size={12} color="#9CA3AF" />
        <Text style={styles.orderText}>Order #{item.orderId.slice(-8)}</Text>
      </View>
    </Animated.View>
  )

  const FilterModal = () => (
    <Modal visible={showFilters} transparent={true} animationType="slide" onRequestClose={() => setShowFilters(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Reviews</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Rating Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Filter by Rating</Text>
            <View style={styles.filterGrid}>
              {filterOptions.rating.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.filterChip, activeFilters.rating === option.key && styles.filterChipActive]}
                  onPress={() => updateFilter("rating", option.key)}
                >
                  <Text
                    style={[styles.filterChipText, activeFilters.rating === option.key && styles.filterChipTextActive]}
                  >
                    {option.label}
                  </Text>
                  {activeFilters.rating === option.key && <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort Reviews</Text>
            <View style={styles.filterGrid}>
              {filterOptions.sortBy.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.filterChip, activeFilters.sortBy === option.key && styles.filterChipActive]}
                  onPress={() => updateFilter("sortBy", option.key)}
                >
                  <Text
                    style={[styles.filterChipText, activeFilters.sortBy === option.key && styles.filterChipTextActive]}
                  >
                    {option.label}
                  </Text>
                  {activeFilters.sortBy === option.key && <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={() => setShowFilters(false)}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )

  const distribution = getRatingDistribution()

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <Animated.View entering={FadeInUp.duration(300)}>
        <Header title={"Reviews & Ratings"} />
      </Animated.View>

      {/* Stats Section */}
      <Animated.View entering={FadeInUp.delay(100).duration(300)} style={styles.statsSection}>
        <View style={styles.overallRating}>
          <Text style={styles.averageRating}>{getAverageRating()}</Text>
          <View style={styles.averageStars}>{renderStars(Math.round(getAverageRating()))}</View>
          <Text style={styles.totalReviews}>{filteredReviews.length} reviews</Text>
        </View>

        <View style={styles.ratingDistribution}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <View key={rating} style={styles.distributionRow}>
              <Text style={styles.distributionLabel}>{rating}</Text>
              <FontAwesomeIcon icon={faStar} size={12} color="#FFC300" />
              <View style={styles.distributionBar}>
                <View
                  style={[
                    styles.distributionFill,
                    {
                      width: `${filteredReviews.length > 0 ? (distribution[rating] / filteredReviews.length) * 100 : 0}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.distributionCount}>{distribution[rating]}</Text>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* Control Bar */}
      <Animated.View entering={FadeInUp.delay(150).duration(300)} style={styles.controlBar}>
        <Text style={styles.reviewCount}>{filteredReviews.length} reviews</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <FontAwesomeIcon icon={faFilter} size={16} color="#FFC300" />
          <Text style={styles.filterButtonText}>Filter</Text>
          <FontAwesomeIcon icon={faChevronDown} size={12} color="#FFC300" />
          {getActiveFilterCount() > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      {/* Reviews List */}
      <FlatList
        data={filteredReviews}
        renderItem={renderReviewCard}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshReviews} colors={["#FFC300"]} />}
        contentContainerStyle={styles.listContent}
        style={styles.reviewsList}
      />

      <FilterModal />
    </SafeAreaView>
  )
}

export default UserReviews

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  statsSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  overallRating: {
    alignItems: "center",
    flex: 1,
  },

  averageRating: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFC300",
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },

  averageStars: {
    flexDirection: "row",
    marginBottom: 4,
  },

  starIcon: {
    marginHorizontal: 1,
  },

  totalReviews: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
  },

  ratingDistribution: {
    flex: 2,
    gap: 4,
  },

  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  distributionLabel: {
    fontSize: 12,
    color: "#374151",
    fontFamily: "Poppins-Medium",
    width: 8,
  },

  distributionBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },

  distributionFill: {
    height: "100%",
    backgroundColor: "#FFC300",
    borderRadius: 3,
  },

  distributionCount: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Poppins-Medium",
    width: 20,
    textAlign: "right",
  },

  controlBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  reviewCount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FFC300",
    gap: 6,
    position: "relative",
  },

  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
  },

  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  filterBadgeText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },

  reviewsList: {
    flex: 1,
    paddingHorizontal: 16,
  },

  listContent: {
    paddingTop: 16,
    paddingBottom: 100,
  },

  reviewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFC300",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  userAvatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 2,
  },

  reviewMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  reviewDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
  },

  ratingContainer: {
    alignItems: "flex-end",
  },

  starsContainer: {
    flexDirection: "row",
    marginBottom: 2,
  },

  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
  },

  foodInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },

  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    resizeMode: "cover",
  },

  foodDetails: {
    flex: 1,
    marginLeft: 12,
  },

  foodName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 2,
  },

  foodPrice: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFC300",
    fontFamily: "Poppins-SemiBold",
  },

  commentContainer: {
    marginBottom: 12,
  },

  commentText: {
    fontSize: 14,
    color: "#374151",
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },

  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  orderText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: "70%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins-Bold",
  },

  closeButton: {
    padding: 8,
  },

  filterSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },

  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
  },

  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
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
  },

  filterChipActive: {
    backgroundColor: "#FFC300",
    borderColor: "#FFC300",
  },

  filterChipText: {
    fontSize: 13,
    color: "#374151",
    fontFamily: "Poppins-Medium",
  },

  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },

  clearButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Poppins-SemiBold",
  },

  applyButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#FFC300",
    alignItems: "center",
  },

  applyButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
})
