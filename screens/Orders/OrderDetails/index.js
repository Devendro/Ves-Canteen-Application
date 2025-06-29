"use client"
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  TouchableOpacity,
} from "react-native"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome"
import {
  faArrowLeft,
  faHourglass,
  faCheckDouble,
  faUtensils,
  faHandHolding,
  faCheckCircle,
  faTimesCircle,
  faStar,
  faRotateRight,
  faMapMarkerAlt,
  faClock,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons"
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated"
import { useNavigation, useRoute } from "@react-navigation/native"
import { APIURL } from "../../../context/constants/api"

const OrderDetails = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { orderData } = route.params

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { color: "#6B7280", icon: faHourglass, bg: "#F3F4F6", label: "Pending" }
      case "confirmed":
        return { color: "#3B82F6", icon: faCheckDouble, bg: "#EFF6FF", label: "Confirmed" }
      case "preparing":
        return { color: "#F59E0B", icon: faUtensils, bg: "#FFFBEB", label: "Preparing" }
      case "ready":
      case "ready to collect":
        return { color: "#10B981", icon: faHandHolding, bg: "#ECFDF5", label: "Ready to Collect" }
      case "completed":
      case "collected":
        return { color: "#059669", icon: faCheckCircle, bg: "#D1FAE5", label: "Completed" }
      case "cancelled":
        return { color: "#EF4444", icon: faTimesCircle, bg: "#FEF2F2", label: "Cancelled" }
      default:
        return { color: "#6B7280", icon: faHourglass, bg: "#F3F4F6", label: "Unknown" }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const totalAmount = orderData?.orders?.reduce(
    (total, order) => total + Number.parseInt(order?.foodDetails?.price) * Number.parseInt(order?.count),
    0,
  )

  const totalItems = orderData?.orders?.reduce((total, order) => total + Number.parseInt(order?.count), 0)

  // College canteen order timeline
  const getOrderTimeline = (status) => {
    const baseTimeline = [
      {
        status: "Order Placed",
        description: "Your order has been placed successfully",
        time: formatTime(orderData?.createdAt),
        completed: true,
        icon: faCheckCircle,
        color: "#10B981",
      },
      {
        status: "Order Confirmed",
        description: "Canteen has confirmed your order",
        time: "2 min later",
        completed: status !== "pending",
        icon: faCheckDouble,
        color: status !== "pending" ? "#3B82F6" : "#E5E7EB",
      },
      {
        status: "Preparing Food",
        description: "Your food is being prepared",
        time: "5 min later",
        completed:
          status === "preparing" ||
          status === "ready" ||
          status === "ready to collect" ||
          status === "completed" ||
          status === "collected",
        icon: faUtensils,
        color:
          status === "preparing" ||
          status === "ready" ||
          status === "ready to collect" ||
          status === "completed" ||
          status === "collected"
            ? "#F59E0B"
            : "#E5E7EB",
      },
      {
        status: "Ready to Collect",
        description: "Your order is ready for pickup at the canteen",
        time:
          status === "ready" || status === "ready to collect" || status === "completed" || status === "collected"
            ? "15 min later"
            : "Est. 15 min",
        completed:
          status === "ready" || status === "ready to collect" || status === "completed" || status === "collected",
        icon: faHandHolding,
        color:
          status === "ready" || status === "ready to collect" || status === "completed" || status === "collected"
            ? "#10B981"
            : "#E5E7EB",
      },
      {
        status: "Order Collected",
        description: "You have collected your order",
        time: status === "completed" || status === "collected" ? "20 min later" : "Pending collection",
        completed: status === "completed" || status === "collected",
        icon: faCheckCircle,
        color: status === "completed" || status === "collected" ? "#059669" : "#E5E7EB",
      },
    ]

    if (status === "cancelled") {
      return [
        ...baseTimeline.slice(0, 2),
        {
          status: "Order Cancelled",
          description: "Your order has been cancelled",
          time: "10 min later",
          completed: true,
          icon: faTimesCircle,
          color: "#EF4444",
        },
      ]
    }

    return baseTimeline
  }

  const timeline = getOrderTimeline(orderData?.orders?.[0]?.orderStatus)

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <Animated.View entering={FadeInUp.duration(300)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity style={styles.receiptButton}>
          <FontAwesomeIcon icon={faReceipt} size={18} color="#FFC300" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Info */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.orderInfoCard}>
          <View style={styles.orderInfoHeader}>
            <View>
              <Text style={styles.orderNumber}>Order #{orderData?.orderId}</Text>
              <Text style={styles.orderDate}>{formatDate(orderData?.createdAt)}</Text>
            </View>
            <View style={styles.orderTotal}>
              <Text style={styles.totalAmount}>₹{totalAmount}</Text>
              <Text style={styles.itemCount}>{totalItems} items</Text>
            </View>
          </View>
        </Animated.View>

        {/* Collection Info */}
        <Animated.View entering={FadeInDown.delay(150).duration(300)} style={styles.collectionCard}>
          <View style={styles.collectionHeader}>
            <FontAwesomeIcon icon={faMapMarkerAlt} size={16} color="#FFC300" />
            <Text style={styles.collectionTitle}>Collection Point</Text>
          </View>
          <Text style={styles.collectionLocation}>College Canteen - Main Building</Text>
          <Text style={styles.collectionNote}>Ground Floor, Near Library</Text>
          <View style={styles.collectionTime}>
            <FontAwesomeIcon icon={faClock} size={14} color="#666666" />
            <Text style={styles.collectionTimeText}>Operating Hours: 8:00 AM - 8:00 PM</Text>
          </View>
        </Animated.View>

        {/* Order Timeline */}
        <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.timelineCard}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          <View style={styles.timeline}>
            {timeline.map((item, index) => (
              <View key={index} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineIcon, { backgroundColor: item.color }]}>
                    <FontAwesomeIcon icon={item.icon} size={12} color="#FFFFFF" />
                  </View>
                  {index < timeline.length - 1 && (
                    <View style={[styles.timelineLine, { backgroundColor: item.completed ? "#E5E7EB" : "#F3F4F6" }]} />
                  )}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineStatus, { color: item.completed ? "#1A1A1A" : "#9CA3AF" }]}>
                    {item.status}
                  </Text>
                  <Text style={styles.timelineDescription}>{item.description}</Text>
                  <Text style={styles.timelineTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Order Items */}
        <Animated.View entering={FadeInDown.delay(300).duration(300)} style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {orderData?.orders?.map((order, index) => {
            const statusConfig = getStatusConfig(order?.orderStatus)
            return (
              <View key={order?._id} style={styles.orderItem}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemOrderId}>Item #{order?.orderId}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <FontAwesomeIcon icon={statusConfig.icon} size={10} color={statusConfig.color} />
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                  </View>
                </View>

                <View style={styles.itemContent}>
                  <Image source={{ uri: `${APIURL + order?.foodDetails?.image}` }} style={styles.itemImage} />
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{order?.foodDetails?.name}</Text>
                    <Text style={styles.itemCategory}>{order?.foodDetails?.categoryDetails?.name}</Text>
                    <View style={styles.itemPricing}>
                      <Text style={styles.itemQuantity}>Qty: {order?.count}</Text>
                      <Text style={styles.itemPrice}>
                        ₹{Number.parseInt(order?.foodDetails?.price) * Number.parseInt(order?.count)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <Pressable
                    style={styles.rateButton}
                    onPress={() => navigation.navigate("Review", { data: order?.foodDetails, orderId: order?._id })}
                  >
                    <FontAwesomeIcon icon={faStar} size={14} color="#10B981" />
                    <Text style={styles.rateButtonText}>Rate Item</Text>
                  </Pressable>
                  <Pressable style={styles.reorderButton}>
                    <FontAwesomeIcon icon={faRotateRight} size={14} color="#FFC300" />
                    <Text style={styles.reorderButtonText}>Reorder</Text>
                  </Pressable>
                </View>
              </View>
            )
          })}
        </Animated.View>

        {/* Help Section */}
        <Animated.View entering={FadeInDown.delay(400).duration(300)} style={styles.helpCard}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.helpText}>
            If you have any issues with your order or need assistance, please contact the canteen staff directly or
            visit the canteen counter.
          </Text>
          <View style={styles.helpContact}>
            <Text style={styles.helpContactLabel}>Canteen Contact:</Text>
            <Text style={styles.helpContactValue}>Extension: 1234</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default OrderDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  receiptButton: {
    padding: 8,
  },

  content: {
    flex: 1,
    padding: 16,
  },

  orderInfoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  orderInfoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  orderNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },

  orderDate: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Poppins-Regular",
  },

  orderTotal: {
    alignItems: "flex-end",
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFC300",
    fontFamily: "Poppins-Bold",
    marginBottom: 2,
  },

  itemCount: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Regular",
  },

  collectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  collectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  collectionLocation: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },

  collectionNote: {
    fontSize: 13,
    color: "#666666",
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
  },

  collectionTime: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8F9FA",
    padding: 8,
    borderRadius: 8,
  },

  collectionTimeText: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Medium",
  },

  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 16,
  },

  timeline: {
    paddingLeft: 8,
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },

  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
  },

  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  timelineLine: {
    width: 2,
    height: 28,
    marginTop: 4,
  },

  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },

  timelineStatus: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-SemiBold",
    marginBottom: 4,
  },

  timelineDescription: {
    fontSize: 13,
    color: "#666666",
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
    lineHeight: 18,
  },

  timelineTime: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
  },

  itemsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  orderItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
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

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
  },

  itemContent: {
    flexDirection: "row",
    marginBottom: 12,
  },

  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: "cover",
  },

  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },

  itemCategory: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },

  itemPricing: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  itemQuantity: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "Poppins-Regular",
  },

  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },

  itemActions: {
    flexDirection: "row",
    gap: 8,
  },

  rateButton: {
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

  rateButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#10B981",
    fontFamily: "Poppins-Medium",
  },

  reorderButtonText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFC300",
    fontFamily: "Poppins-Medium",
  },

  helpCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  helpText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
    marginBottom: 12,
  },

  helpContact: {
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  helpContactLabel: {
    fontSize: 13,
    color: "#666666",
    fontFamily: "Poppins-Medium",
  },

  helpContactValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "Poppins-SemiBold",
  },
})
