import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import FloatingButton from "../../components/FloatingButton";
import Header from "../../components/Header";
import OrderCard from "./OrderCard";
import { useDispatch } from "react-redux";
import { getALlUserOrders } from "../../context/actions/order";
import UnloadedOrderedCard from "../../components/UnloadedOrderedCard";

const Orders = () => {
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
            onRefresh={refreshOrder} colors={["#FFC300"]} tintColor={"#FFC300"}/>}
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
