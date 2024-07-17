import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import Animated from "react-native-reanimated";

export const CachedImage = (props) => {
  const [cachedSource, setCachedSource] = useState(null);
  const { uri } = props;

  useEffect(() => {
    const getCachedImage = async () => {
      if (!uri) {
        return;
      }

      try {
        const cachedImageData = await AsyncStorage.getItem(uri);

        if (cachedImageData) {
          setCachedSource({ uri: cachedImageData });
        } else {
          const response = await fetch(uri);
          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }

          const imageBlob = await response.blob();
          const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageBlob);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read image as data URL'));
          });

          await AsyncStorage.setItem(uri, base64Data);
          setCachedSource({ uri: base64Data });
        }
      } catch (error) {
        console.error("Error caching image:", error);
        setCachedSource({ uri });
      }
    };

    getCachedImage();
  }, [uri]);

  return cachedSource ? <Animated.Image source={cachedSource} {...props} /> : null;
};
