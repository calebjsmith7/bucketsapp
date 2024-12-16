import React from "react";
import { View, StyleSheet } from "react-native";

export function Shelf() {
  return <View style={styles.shelf} />;
}

const styles = StyleSheet.create({
  shelf: {
    width: "100%",
    height: 10,
    backgroundColor: "#8B5E3C", // Darker brown to resemble the shelf
    position: "absolute",
    bottom: -5, // To make the shelf visually sit under the buckets
    zIndex: -1,
  },
});
