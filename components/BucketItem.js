import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useVisualsContext } from "../app/context/VisualsContext";

// Map bucket color names to their respective require calls
const bucketColorImages = {
  "bucket-white": require("../assets/images/bucket-white.png"),
  "bucket-teal": require("../assets/images/bucket-teal.png"),
  "bucket-blue": require("../assets/images/bucket-blue.png"),
  "bucket-red": require("../assets/images/bucket-red.png"),
  "bucket-pink": require("../assets/images/bucket-pink.png"),
  "bucket-purple": require("../assets/images/bucket-purple.png"),
  "bucket-black": require("../assets/images/bucket-black.png"),
};

export function BucketItem({ bucket, tasks = [], onPress, isPlaceholder }) {
  const { visuals } = useVisualsContext();

  const bucketColor = visuals.randomizeBucketColors
    ? `bucket-${
        ["white", "teal", "blue", "red", "pink", "purple", "black"][
          Math.floor(Math.random() * 6)
        ]
      }`
    : visuals.bucketColor;

  const bucketImage =
    bucketColorImages[bucketColor] || bucketColorImages["bucket-white"];
  const tasksInBucket = tasks.filter((task) => task.bucketId === bucket.id);

  return (
    <TouchableOpacity
      style={[styles.bucketContainer, isPlaceholder ? styles.placeholder : {}]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <ImageBackground
        source={bucketImage}
        resizeMode="contain"
        style={styles.bucket}
      >
        <View style={styles.imageWrapper}>
          {isPlaceholder ? (
            <MaterialIcons name="add-circle-outline" size={50} color="#666" />
          ) : (
            <>
              <Text
                style={[
                  styles.bucketName,
                  bucketColor == "black" ? styles.white : null,
                ]}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {bucket.name}
              </Text>
              <Text style={styles.tasksCount}>
                {tasksInBucket.length} tasks
              </Text>
            </>
          )}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bucketContainer: {
    flex: 1,
    margin: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    height: 100,
    marginTop: 10,
  },
  imageWrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  bucket: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  placeholder: {
    opacity: 0.5,
  },
  bucketName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 0,
    marginTop: 12,
    textAlign: "center",
    width: "90%",
  },
  tasksCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  white: {
    color: "#fff",
  },
});
