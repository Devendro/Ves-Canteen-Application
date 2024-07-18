import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import FloatingButton from "../../components/FloatingButton";
import Header from "../../components/Header";
import OrderCard from "./OrderCard";
import { useDispatch, useSelector } from "react-redux";
import { getALlUserOrders } from "../../context/actions/order";
import UnloadedOrderedCard from "../../components/UnloadedOrderedCard";
import { SocketContext } from "../../context/actions/socket";

const Orders = () => {
  const { backendSocket } = useContext(SocketContext);
  const userDetails = useSelector((state) => state?.user)
  const dispatch = useDispatch();
  const [orders, setOrders] = useState({});
  const [orderLoading, setOrderLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    setOrderLoading(true);
    dispatch(
      getALlUserOrders({}, (res) => {
        setOrders(res);
        setOrderLoading(false);
      })
    );
  }, []);

  useEffect(()=>{
    backendSocket.off("orderStatusUpdate").on("orderStatusUpdate", (res, err) => {
      if (res?.user == userDetails._id) {
        let mainOrderIndex = orders?.docs?.findIndex(item => item._id == res?.mainOrderId);
        let orderIndex = orders?.docs[mainOrderIndex]?.orders?.findIndex(item => item._id == res?.orderId);
        setOrders((prevState) => {
          let arr = [...prevState?.docs]
          arr[mainOrderIndex].orders[orderIndex].orderStatus = res?.orderStatus
          return {
            ...prevState,
            docs: arr
          }
        })
      }

    })
  }, [orders])
 
  const refreshOrder = () => {
    setRefreshing(true)
    dispatch(
      getALlUserOrders({}, (res) => {
        setOrders(res);
        setRefreshing(false);
      })
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title={"Order History"} />
      {orderLoading && (
        <View style={styles.orderContainer}>
          <UnloadedOrderedCard />
          <UnloadedOrderedCard />
          <UnloadedOrderedCard />
          <UnloadedOrderedCard />
        </View>
      )}

      {orders && (
        <FlatList
          style={styles.orderContainer}
          data={orders?.docs}
          renderItem={({ item, index }) => <OrderCard foodData={item} />}
          keyExtractor={(item) => item?._id}
          refreshControl={<RefreshControl refreshing={refreshing}
            onRefresh={refreshOrder} colors={["#FFC300"]} tintColor={"#FFC300"} />}
        />
      )}
      <FloatingButton />
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  orderContainer: {
    padding: 10,
  },
});
