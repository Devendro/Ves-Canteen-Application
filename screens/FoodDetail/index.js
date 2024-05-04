import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Animated from "react-native-reanimated";

const FoodDetail = () => {
    const snapPoints = useMemo(() => ["75%"], []);
  // renders
  return (
    <View style={styles.container}>
      {/* <BottomSheet snapPoints={snapPoints} enablePanDownToClose={true}> */}
        <View>
        <Animated.Image
          // resizeMode={"contain"}
          sharedTransitionTag={"fsdkfdkfsdjfjsdkfj"}
          source={require("../../assets/images/Noodlessss.jpg")}
          style={{
            alignItems: "center",
            borderRadius: 20,
            height: 210,
            width: "100%",
          }}
        />
        </View>
      {/* </BottomSheet> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});

export default FoodDetail;
