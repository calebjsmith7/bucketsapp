import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const BucketsContext = createContext();

export function BucketsProvider({ children }) {
  const [buckets, setBuckets] = useState([]);

  // Key for AsyncStorage
  const STORAGE_KEY = "buckets";

  // Load buckets from AsyncStorage when the app initializes
  useEffect(() => {
    const loadBuckets = async () => {
      try {
        const storedBuckets = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedBuckets) {
          setBuckets(JSON.parse(storedBuckets));
        }
      } catch (e) {
        console.error("Failed to load buckets from storage", e);
      }
    };

    loadBuckets();
  }, []);

  // Save buckets to AsyncStorage whenever they change
  useEffect(() => {
    const saveBuckets = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(buckets));
      } catch (e) {
        console.error("Failed to save buckets to storage", e);
      }
    };

    saveBuckets();
  }, [buckets]);

  // Function to add a new bucket
  const addBucket = (bucket) => {
    setBuckets((prevBuckets) => [...prevBuckets, bucket]);
  };

  // Function to remove a bucket by ID
  const removeBucket = (bucketId) => {
    setBuckets((prevBuckets) =>
      prevBuckets.filter((bucket) => bucket.id !== bucketId)
    );
  };

  return (
    <BucketsContext.Provider value={{ buckets, addBucket, removeBucket }}>
      {children}
    </BucketsContext.Provider>
  );
}
