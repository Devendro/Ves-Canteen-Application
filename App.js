import React, { useCallback, useState, useEffect } from "react";
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
import Orders from "./screens/Orders";
import SettingMenu from "./screens/SettingMenu";
import About from "./screens/About";
import Profile from "./screens/Profile";
import { Review } from "./screens/Review";
import { socket, backendSocket, SocketContext } from "./context/actions/socket";

const Stack = createNativeStackNavigator();

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(null);
  useEffect(() => {
    checkIfAlreadyOnboarded();
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
          <SocketContext.Provider value={{ socket, backendSocket }}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName={showOnboarding ? "Onboarding" : "Splash"}
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
                <Stack.Screen name="Orders" component={Orders} />
                <Stack.Screen name="SettingMenu" component={SettingMenu} options={{ animation: "slide_from_right" }} />
                <Stack.Screen name="Profile" component={Profile} options={{ animation: "slide_from_bottom" }} />
                <Stack.Screen name="Review" component={Review} />
                <Stack.Screen name="About" component={About} />
              </Stack.Navigator>
            </NavigationContainer>
          </SocketContext.Provider>
          <Toast />
          {/* <FooterMenu/> */}
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
