"use client"

import { useState, useEffect, useContext } from "react"
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import { faFilter, faTimes, faCheck, faChartBar } from "@fortawesome/free-solid-svg-icons"
import FloatingButton from "../../components/FloatingButton"
import Header from "../../components/Header"
import OrderCard from "./OrderCard"
import { useDispatch, useSelector } from "react-redux"
import { getALlUserOrders } from "../../context/actions/order"
import UnloadedOrderedCard from "../../components/UnloadedOrderedCard"
import { SocketContext } from "../../context/actions/socket"
import NotFound from "../../components/NotFound"

const { width } = Dimensions.get("window")

const Orders = () => {
  const { backendSocket } = useContext(SocketContext)
  const userDetails = useSelector((state) => state?.user)
  const dispatch = useDispatch()
  const [orders, setOrders] = useState({})
  const [filteredOrders, setFilteredOrders] = useState({})
  const [orderLoading, setOrderLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    status: "all",
    timeRange: "all",
    sortBy: "newest",
  })

  const filterOptions = {
    status: [
      { key: "all", label: "All Orders" },
      { key: "pending", label: "Pending" },
      { key: "confirmed", label: "Confirmed" },
      { key: "preparing", label: "Preparing" },
      { key: "ready", label: "Ready to Collect" },
      { key: "completed", label: "Completed" },
      { key: "cancelled", label: "Cancelled" },
    ],
    timeRange: [
      { key: "all", label: "All Time" },
      { key: "today", label: "Today" },
      { key: "week", label: "This Week" },
      { key: "month", label: "This Month" },
    ],
    sortBy: [
      { key: "newest", label: "Newest First" },
      { key: "oldest", label: "Oldest First" },
      { key: "amount_high", label: "Amount: High to Low" },
      { key: "amount_low", label: "Amount: Low to High" },
    ],
  }

  useEffect(() => {
    setOrderLoading(true)
    dispatch(
      getALlUserOrders({}, (res) => {
        setOrders(res)
        setFilteredOrders(res)
        setOrderLoading(false)
      }),
    )
  }, [])

  useEffect(() => {
    backendSocket.off("orderStatusUpdate").on("orderStatusUpdate", (res, err) => {
      if (res?.user == userDetails._id) {
        console.log(res)
        const mainOrderIndex = orders?.docs?.findIndex((item) => item._id == res?.mainOrderId)
        const orderIndex = orders?.docs[mainOrderIndex]?.orders?.findIndex((item) => item._id == res?.orderId)
        setOrders((prevState) => {
          const arr = [...prevState?.docs]
          arr[mainOrderIndex].orders[orderIndex].orderStatus = res?.orderStatus
          return {
            ...prevState,
            docs: arr,
          }
        })
      }
    })
  }, [orders])

  useEffect(() => {
    applyFilters()
  }, [orders, activeFilters])

  const applyFilters = () => {
    if (!orders?.docs) return

    let filtered = [...orders.docs]

    // Status filter
    if (activeFilters.status !== "all") {
      filtered = filtered.filter((order) =>
        order.orders.some(
          (item) =>
            item.orderStatus?.toLowerCase() === activeFilters.status ||
            (activeFilters.status === "ready" &&
              (item.orderStatus?.toLowerCase() === "ready to collect" || item.orderStatus?.toLowerCase() === "ready")),
        ),
      )
    }

    // Time range filter
    if (activeFilters.timeRange !== "all") {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt)
        switch (activeFilters.timeRange) {
          case "today":
            return orderDate >= today
          case "week":
            return orderDate >= weekAgo
          case "month":
            return orderDate >= monthAgo
          default:
            return true
        }
      })
    }

    // Sort
    filtered.sort((a, b) => {
      const aTotal = a.orders.reduce(
        (sum, order) => sum + Number.parseInt(order.foodDetails?.price) * Number.parseInt(order.count),
        0,
      )
      const bTotal = b.orders.reduce(
        (sum, order) => sum + Number.parseInt(order.foodDetails?.price) * Number.parseInt(order.count),
        0,
      )

      switch (activeFilters.sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "amount_high":
          return bTotal - aTotal
        case "amount_low":
          return aTotal - bTotal
        default: // newest
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    setFilteredOrders({ ...orders, docs: filtered })
  }

  const refreshOrder = () => {
    setRefreshing(true)
    dispatch(
      getALlUserOrders({}, (res) => {
        setOrders(res)
        setRefreshing(false)
      }),
    )
  }

  const updateFilter = (category, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const clearFilters = () => {
    setActiveFilters({
      status: "all",
      timeRange: "all",
      sortBy: "newest",
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (activeFilters.status !== "all") count++
    if (activeFilters.timeRange !== "all") count++
    if (activeFilters.sortBy !== "newest") count++
    return count
  }

  const getFilteredStats = () => {
    const totalOrders = filteredOrders?.docs?.length || 0
    const totalItems = filteredOrders?.docs?.reduce((acc, order) => acc + (order?.orders?.length || 0), 0) || 0
    const totalAmount =
      filteredOrders?.docs?.reduce((acc, order) => {
        const orderTotal = order.orders.reduce(
          (sum, item) => sum + Number.parseInt(item.foodDetails?.price) * Number.parseInt(item.count),
          0,
        )
        return acc + orderTotal
      }, 0) || 0

    return { totalOrders, totalItems, totalAmount }
  }

  const stats = getFilteredStats()

  const renderOrderCard = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
      <OrderCard foodData={item} />
    </Animated.View>
  )

  const FilterModal = () => (
    <Modal visible={showFilters} transparent={true} animationType="slide" onRequestClose={() => setShowFilters(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort Orders</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Status Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Order Status</Text>
            <View style={styles.filterGrid}>
              {filterOptions.status.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.filterChip, activeFilters.status === option.key && styles.filterChipActive]}
                  onPress={() => updateFilter("status", option.key)}
                >
                  <Text
                    style={[styles.filterChipText, activeFilters.status === option.key && styles.filterChipTextActive]}
                  >
                    {option.label}
                  </Text>
                  {activeFilters.status === option.key && <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Range Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Time Period</Text>
            <View style={styles.filterGrid}>
              {filterOptions.timeRange.map((option) => (
                <TouchableOpacity
                  key={option.key}
                  style={[styles.filterChip, activeFilters.timeRange === option.key && styles.filterChipActive]}
                  onPress={() => updateFilter("timeRange", option.key)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      activeFilters.timeRange === option.key && styles.filterChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {activeFilters.timeRange === option.key && (
                    <FontAwesomeIcon icon={faCheck} size={12} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By Filter */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Sort Orders</Text>
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

  const StatsModal = () => (
    <Modal visible={showStats} transparent={true} animationType="slide" onRequestClose={() => setShowStats(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.statsModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Order Statistics</Text>
            <TouchableOpacity onPress={() => setShowStats(false)} style={styles.closeButton}>
              <FontAwesomeIcon icon={faTimes} size={20} color="#666666" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalOrders}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalItems}</Text>
              <Text style={styles.statLabel}>Items Ordered</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>₹{stats.totalAmount}</Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.closeStatsButton} onPress={() => setShowStats(false)}>
            <Text style={styles.closeStatsButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <Animated.View entering={FadeInUp.duration(300)}>
        <Header title={"Order History"} />
      </Animated.View>

      {/* Compact Control Bar */}
      <Animated.View entering={FadeInUp.delay(100).duration(300)} style={styles.controlBar}>
        <View style={styles.orderCount}>
          <Text style={styles.orderCountText}>{stats.totalOrders} orders</Text>
        </View>

        <View style={styles.controlButtons}>
          <TouchableOpacity style={styles.controlButton} onPress={() => setShowStats(true)}>
            <FontAwesomeIcon icon={faChartBar} size={16} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton} onPress={() => setShowFilters(true)}>
            <FontAwesomeIcon icon={faFilter} size={16} color="#666666" />
            {getActiveFilterCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <Animated.View entering={FadeInDown.duration(300)} style={styles.activeFiltersContainer}>
          <View style={styles.activeFilters}>
            {activeFilters.status !== "all" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  {filterOptions.status.find((f) => f.key === activeFilters.status)?.label}
                </Text>
                <TouchableOpacity onPress={() => updateFilter("status", "all")}>
                  <FontAwesomeIcon icon={faTimes} size={10} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
            {activeFilters.timeRange !== "all" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  {filterOptions.timeRange.find((f) => f.key === activeFilters.timeRange)?.label}
                </Text>
                <TouchableOpacity onPress={() => updateFilter("timeRange", "all")}>
                  <FontAwesomeIcon icon={faTimes} size={10} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
            {activeFilters.sortBy !== "newest" && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>
                  {filterOptions.sortBy.find((f) => f.key === activeFilters.sortBy)?.label}
                </Text>
                <TouchableOpacity onPress={() => updateFilter("sortBy", "newest")}>
                  <FontAwesomeIcon icon={faTimes} size={10} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Animated.View>
      )}

      {/* Loading State */}
      {orderLoading && (
        <View style={styles.orderContainer}>
          <UnloadedOrderedCard />
          <UnloadedOrderedCard />
          <UnloadedOrderedCard />
        </View>
      )}

      {/* Empty State */}
      {(!filteredOrders?.docs || filteredOrders?.docs?.length == 0) && !orderLoading && <NotFound />}

      {/* Orders List */}
      {filteredOrders?.docs && filteredOrders?.docs?.length > 0 && (
        <FlatList
          style={styles.orderContainer}
          data={filteredOrders?.docs}
          renderItem={renderOrderCard}
          keyExtractor={(item) => item?._id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshOrder}
              colors={["#FFC300"]}
              tintColor={"#FFC300"}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <FilterModal />
      <StatsModal />
      <FloatingButton />
    </SafeAreaView>
  )
}

export default Orders

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
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

  orderCount: {
    flex: 1,
  },

  orderCountText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  controlButtons: {
    flexDirection: "row",
    gap: 12,
  },

  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8F9FA",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    position: "relative",
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

  activeFiltersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  activeFilters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFC300",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  activeFilterText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
  },

  orderContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  listContent: {
    paddingBottom: 100,
  },

  // Stats Modal
  statsModalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: "50%",
  },

  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFC300",
    fontFamily: "Poppins-Bold",
    marginBottom: 6,
  },

  statLabel: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },

  closeStatsButton: {
    marginHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  closeStatsButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    fontFamily: "Poppins-SemiBold",
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
    maxHeight: "85%",
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
    minWidth: (width - 64) / 2 - 4,
    justifyContent: "center",
  },

  filterChipActive: {
    backgroundColor: "#FFC300",
    borderColor: "#FFC300",
  },

  filterChipText: {
    fontSize: 13,
    color: "#374151",
    fontFamily: "Poppins-Medium",
    textAlign: "center",
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
