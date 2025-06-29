"use client"

import { StyleSheet, Text, View, Image, Pressable } from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faStar,
  faRotateRight,
  faCalendarDays,
  faHourglass,
  faCheckDouble,
  faUtensils,
  faHandHolding,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons"
import { APIURL } from "../../../context/constants/api"
import { useNavigation } from "@react-navigation/native"

const OrderCard = ({ foodData }) => {
  const navigation = useNavigation()

  function formatDate(dateString) {
    const date = new Date(dateString)
    const optionsDate = { year: "numeric", month: "short", day: "numeric" }
    const optionsTime = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }

    const formattedDate = date.toLocaleDateString(undefined, optionsDate)
    const formattedTime = date.toLocaleTimeString(undefined, optionsTime)

    return `${formattedDate} • ${formattedTime}`
  }

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
        return { color: "#6B7280", icon: faHourglass, bg: "#F3F4F6", label: "Pending" }
      case "confirmed":
        return { color: "#3B82F6", icon: faCheckDouble, bg: "#EFF6FF", label: "Confirmed" }
      case "preparing":
        return { color: "#F59E0B", icon: faUtensils, bg: "#FFFBEB", label: "Preparing" }
      case "complete":
        return { color: "#10B981", icon: faHandHolding, bg: "#ECFDF5", label: "Ready to Collect" }
      case "collected":
        return { color: "#059669", icon: faCheckCircle, bg: "#D1FAE5", label: "Collected" }
      case "cancelled":
        return { color: "#EF4444", icon: faTimesCircle, bg: "#FEF2F2", label: "Cancelled" }
      default:
        return { color: "#6B7280", icon: faHourglass, bg: "#F3F4F6", label: "Unknown" }
    }
  }

  const totalAmount = foodData?.orders?.reduce(
    (total, order) => total + Number.parseInt(order?.foodDetails?.price) * Number.parseInt(order?.count),
    0,
  )

  const totalItems = foodData?.orders?.reduce((total, order) => total + Number.parseInt(order?.count), 0)

  const handleOrderPress = () => {
    navigation.navigate("OrderDetails", { orderData: foodData })
  }

  return (
    <Pressable style={styles.container} onPress={handleOrderPress}>
      {/* Order Header */}
      <View style={styles.orderHeader}>
        <View style={styles.orderHeaderLeft}>
          <Text style={styles.orderTitle}>Order #{foodData?.orderId}</Text>
          <View style={styles.orderMeta}>
            <FontAwesomeIcon icon={faCalendarDays} size={12} color="#666666" />
            <Text style={styles.orderDate}>{formatDate(foodData?.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.orderSummary}>
          <Text style={styles.totalAmount}>₹{totalAmount}</Text>
          <Text style={styles.itemCount}>{totalItems} items</Text>
        </View>
      </View>

      {/* Order Items */}
      <View style={styles.itemsContainer}>
        {foodData?.orders &&
          foodData?.orders?.length > 0 &&
          foodData?.orders?.map((order, index) => {
            const statusConfig = getStatusConfig(order?.orderStatus)
            return (
              <View
                style={[
                  styles.orderItem,
                  {
                    marginBottom: foodData?.orders?.length - 1 != index ? 12 : 0,
                  },
                ]}
                key={order?._id}
              >
                {/* Item Header */}
                <View style={styles.itemHeader}>
                  <Text style={styles.itemOrderId}>Item #{order?.orderId}</Text>
                  <View style={[styles.statusContainer, { backgroundColor: statusConfig.bg }]}>
                    <FontAwesomeIcon icon={statusConfig.icon} size={12} color={statusConfig.color} />
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                  </View>
                </View>

                {/* Item Content */}
                <View style={styles.itemContent}>
                  <Image source={{ uri: `${APIURL + order?.foodDetails?.image}` }} style={styles.foodImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.foodName} numberOfLines={2}>
                      {order?.foodDetails?.name}
                    </Text>
                    <Text style={styles.foodCategory}>{order?.foodDetails?.categoryDetails?.name}</Text>
                    <View style={styles.priceQuantity}>
                      <Text style={styles.quantity}>Qty: {order?.count}</Text>
                      <Text style={styles.price}>
                        ₹{Number.parseInt(order?.foodDetails?.price) * Number.parseInt(order?.count)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <Pressable
                    style={styles.ratingButton}
                    onPress={(e) => {
                      e.stopPropagation()
                      navigation.navigate("Review", { data: order?.foodDetails, orderId: order?._id })
                    }}
                  >
                    <FontAwesomeIcon icon={faStar} size={14} color="#10B981" />
                    <Text style={styles.ratingButtonText}>Rate</Text>
                  </Pressable>
                  <Pressable
                    style={styles.reorderButton}
                    onPress={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <FontAwesomeIcon icon={faRotateRight} size={14} color="#FFC300" />
                    <Text style={styles.reorderButtonText}>Reorder</Text>
                  </Pressable>
                </View>
              </View>
            )
          })}
      </View>
    </Pressable>
  )
}

export default OrderCard

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  orderHeaderLeft: {
    flex: 1,
  },

  orderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },

  orderMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  orderDate: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Medium",
  },

  orderSummary: {
    alignItems: "flex-end",
  },

  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFC300",
    fontFamily: "Poppins-Bold",
    marginBottom: 2,
  },

  itemCount: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Medium",
  },

  itemsContainer: {
    gap: 12,
  },

  orderItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  itemOrderId: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    fontFamily: "Poppins-Medium",
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },

  itemContent: {
    flexDirection: "row",
    marginBottom: 12,
  },

  foodImage: {
    height: 70,
    width: 70,
    borderRadius: 8,
    resizeMode: "cover",
  },

  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  foodName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
    lineHeight: 18,
  },

  foodCategory: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },

  priceQuantity: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  quantity: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Regular",
  },

  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },

  ratingButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
    borderWidth: 1,
    borderColor: "#D1FAE5",
    gap: 6,
    height: 36,
  },

  reorderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FEF3C7",
    gap: 6,
    height: 36,
  },

  ratingButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#10B981",
    fontFamily: "Poppins-Medium",
  },

  reorderButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#FFC300",
    fontFamily: "Poppins-Medium",
  },
})
