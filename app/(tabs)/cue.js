import React, { useState } from "react";
import { ScrollView, StyleSheet, Dimensions, View, Text } from "react-native";
import { useTaskContext } from "../context/TaskContext";
import { useTagsContext } from "../context/TagsContext";
import { TopTask } from "../../components/TopTask";
import { TaskActionsMenu } from "../../components/TaskActionsMenu";
import { TaskItem } from "../../components/TaskItem";

const { height } = Dimensions.get("window"); // For full screen height

export default function Cue() {
  const { getSortedTasks, removeTask, completeTask } = useTaskContext();
  const { tags } = useTagsContext();
  const [completedTasks, setCompletedTasks] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const sortedTasks = getSortedTasks(tags, completedTasks);

  // Handle task completion
  const handleComplete = (taskId) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks((prev) => [...prev, taskId]);
      completeTask(taskId);
    }
  };

  const handleOpenMenu = (taskId) => {
    setSelectedTaskId(taskId);
    setMenuVisible(true);
  };

  const handleMenuOption = (option) => {
    console.log(`${option} selected for task ${selectedTaskId}`);
    setMenuVisible(false);
    setCompletedTasks((prev) => [...prev, selectedTaskId]);
    removeTask(selectedTaskId);
  };

  const tagColors = {
    "Follow Up": "#FFD700",
    "High Priority": "#FF6347",
    "Low Priority": "#90EE90",
    "Big Project": "#87CEEB",
    Project: "#DDA0DD",
    "R&D": "#FFA500",
    default: "#FCBC1E",
  };

  // Determine the greeting based on the time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {sortedTasks.length > 0 ? (
          <>
            {/* Top Task */}
            <TopTask
              task={sortedTasks[0]}
              completed={completedTasks.includes(sortedTasks[0].id)}
              onComplete={() => handleComplete(sortedTasks[0].id)}
              onOpenMenu={() => handleOpenMenu(sortedTasks[0].id)}
              greeting={getGreeting()}
              tagColors={tagColors}
            />

            {/* Remaining Tasks */}
            {sortedTasks.slice(1).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                completed={completedTasks.includes(task.id)}
                onComplete={() => handleComplete(task.id)}
                onOpenMenu={() => handleOpenMenu(task.id)}
                tagColors={tagColors}
              />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Create your first bucket and task to display your cue!
            </Text>
          </View>
        )}
      </ScrollView>

      <TaskActionsMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelectOption={handleMenuOption}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: height - 250,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#999",
    textAlign: "center",
  },
});
