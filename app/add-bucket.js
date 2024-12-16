import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { BucketsContext } from "./context/BucketsContext";

export default function AddBucket() {
  const router = useRouter();
  const [bucketName, setBucketName] = useState("");
  const { addBucket } = useContext(BucketsContext);

  const handleCreateBucket = () => {
    if (bucketName.trim() === "") return;

    const newBucket = {
      id: `bucket-${Date.now()}`,
      name: bucketName.trim(),
      tasksCount: 0,
    };

    // Use the addBucket function from the context
    addBucket(newBucket);

    // Navigate back to buckets page
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a New Bucket</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter bucket name"
        value={bucketName}
        onChangeText={setBucketName}
      />
      <Pressable style={styles.createButton} onPress={handleCreateBucket}>
        <Text style={styles.createButtonText}>Create Bucket</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  createButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});
