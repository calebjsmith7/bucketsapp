import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VisualsContext = createContext();

export default function VisualsProvider({ children }) {
  const STORAGE_KEY = "visuals";

  const [visuals, setVisuals] = useState({
    background: "wood_texture",
    bucketColor: "bucket-white",
    randomizeBucketColors: false,
  });

  // Load visuals from AsyncStorage when the app initializes
  useEffect(() => {
    const loadVisuals = async () => {
      try {
        const storedVisuals = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedVisuals) {
          setVisuals(JSON.parse(storedVisuals));
        }
      } catch (e) {
        console.error("Failed to load visuals from storage", e);
      }
    };

    loadVisuals();
  }, []);

  // Save visuals to AsyncStorage whenever they change
  useEffect(() => {
    const saveVisuals = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(visuals));
      } catch (e) {
        console.error("Failed to save visuals to storage", e);
      }
    };

    saveVisuals();
  }, [visuals]);

  return (
    <VisualsContext.Provider value={{ visuals, setVisuals }}>
      {children}
    </VisualsContext.Provider>
  );
}

export function useVisualsContext() {
  return useContext(VisualsContext);
}
