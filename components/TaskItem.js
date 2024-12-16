// TaskItem.js
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export function TaskItem({
  task,
  completed,
  onComplete,
  onOpenMenu,
  tagColors,
}) {
  return (
    <View style={styles.taskCard}>
      <Text style={styles.taskTitle}>{task.title}</Text>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        {task.tags.map((tag, index) => (
          <View
            key={index}
            style={[
              styles.tag,
              { backgroundColor: tagColors[tag] || tagColors.default },
            ]}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonRow}>
        {/* Complete Button */}
        <Pressable onPress={onComplete}>
          <MaterialIcons
            name={completed ? "check-circle" : "check-circle-outline"}
            size={24}
            color={completed ? "#4CAF50" : "#666"}
          />
        </Pressable>

        {/* Exclamation Button */}
        <Pressable onPress={onOpenMenu}>
          <MaterialIcons
            name="error-outline"
            size={24}
            color="orange"
            style={{ marginLeft: 20 }}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Android shadow
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 0,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  taskNotes: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    padding: 5,
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});
