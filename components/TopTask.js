import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
const { height } = Dimensions.get("window"); // For full screen height
import { MaterialIcons } from "@expo/vector-icons"; // Icon library

export function TopTask({
  task,
  completed,
  onComplete,
  onOpenMenu,
  greeting,
  tagColors,
}) {
  return (
    <View style={[styles.taskCard, styles.topTask]}>
      {/* Greeting */}
      <Text style={styles.greeting}>{greeting},</Text>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Next Task Details */}
      <Text style={styles.nextTask}>The Next Task in the Cue is:</Text>
      <Text style={styles.nextTaskTitle}>{task.title}</Text>

      {/* Tags */}
      <View style={styles.topTagsContainer}>
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

      {/* Notes */}
      <Text style={styles.taskNotes}>
        {task.notes ? task.notes : "No notes provided."}
      </Text>

      {/* Button Row */}
      <View style={styles.buttonRow}>
        {/* Complete Button */}
        <Pressable onPress={onComplete}>
          <MaterialIcons
            name={completed ? "check-circle" : "check-circle-outline"}
            size={32}
            color={completed ? "#4CAF50" : "#666"}
          />
        </Pressable>

        {/* Exclamation Button */}
        <Pressable onPress={onOpenMenu}>
          <MaterialIcons
            name="error-outline"
            size={32}
            color="orange"
            style={{ marginLeft: 20 }}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topTask: {
    height: height * 0.65,
    marginBottom: 20,
  },
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
  greeting: {
    fontSize: 30,
    fontWeight: "800",
    color: "#333",
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
  },
  nextTask: {
    fontSize: 20,
    color: "#555",
    marginBottom: 15,
    marginTop: 10,
    fontStyle: "italic",
  },
  nextTaskTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  topTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    padding: 5,
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
    height: 100,
    maxHeight: 100,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
});
