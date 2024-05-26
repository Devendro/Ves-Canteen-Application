import React, { useCallback, useState, useEffect } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import { getItem } from "./utils/asyncStorage";
import Cart from "./screens/Cart";
import { persistor, store } from "./store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Splash from "./screens/Splash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PushNotification from "./PushNotification";
import Search from "./screens/Search";
import Foods from "./screens/Foods";
import Toast from "react-native-toast-message";
import { FooterMenu } from "./screens/FooterMenu";

const Stack = createNativeStackNavigator();

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(null);
  useEffect(() => {
    checkIfAlreadyOnboarded();
    PushNotification();
  }, []);

  const checkIfAlreadyOnboarded = async () => {
    let onboarded = await getItem("onboarded");
    if (onboarded == 1) {
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
  };
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (showOnboarding == null) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={showOnboarding ? "Onboarding" : "Cart"}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Splash" component={Splash} />
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen
                name="Login"
                component={Login}
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen
                name="Register"
                component={Register}
                options={{ animation: "slide_from_right" }}
              />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Cart" component={Cart} />
              <Stack.Screen
                name="Search"
                component={Search}
                options={{ animation: "slide_from_bottom" }}
              />
              <Stack.Screen name="Foods" component={Foods} />
            </Stack.Navigator>
          </NavigationContainer>
          <Toast />
          {/* <FooterMenu/> */}
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}

const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Ensure SafeAreaView has a background color
    justifyContent: "center",
    alignItems: "center",
  },
});
