import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "default",
    showBadge: true,
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#FF231F7C",
  });
}

function handleRegistrationError(errorMessage) {
  console.error("Push Notification Error:", errorMessage);
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
      return;
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;
      return pushTokenString;
    } catch (e) {
      handleRegistrationError(`Network request failed: ${e.message}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

async function PushNotification() {
  const expoPushToken = await registerForPushNotificationsAsync();
  return expoPushToken;
}

export default PushNotification;
