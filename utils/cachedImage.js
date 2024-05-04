import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";

export const CachedImage = (props) => {
  const [cachedSouce, setCachedSouce] = useState(null);
  const { uri } = props;
  useEffect(() => {
    const getCachedImage = async () => {
      try {
        const cachedImageData = await AsyncStorage.getItem(uri);
        if (cachedImageData) {
          setCachedSouce({ uri: cachedImageData });
        } else {
          const response = await fetch(uri);
          const imageBlob = await response.blob();
          const base64Data = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => {
              resolve(reader.result);
            };
          });
          await AsyncStorage.setItem(uri, base64Data);
          setCachedSouce({ uri: base64Data });
        }
      } catch (error) {
        console.error("Error caching image:", error);
        setCachedSouce({ uri });
      }
    };

    getCachedImage();
  }, []);

  return cachedSouce  ? <Animated.Image source={cachedSouce} {...props} /> : null;
};
