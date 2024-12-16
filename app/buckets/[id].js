// BucketDetail.js
import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTaskContext } from "../context/TaskContext";
import { BucketsContext } from "../context/BucketsContext";
import TaskWizard from "../../components/TaskWizard";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

export default function BucketDetail() {
  const { id } = useLocalSearchParams();
  const { tasks, addTask, removeTask } = useTaskContext(); // Added removeTask
  const { buckets, removeBucket } = useContext(BucketsContext);
  const [taskWizardVisible, setTaskWizardVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [taskWizardData, setTaskWizardData] = useState(null);

  const router = useRouter();

  // Find the bucket that matches the current ID
  const bucket = buckets.find((bucket) => bucket.id === id);

  // Filter tasks by bucket ID
  let bucketTasks = tasks.filter((task) => task.bucketId === id);

  const handleAddOrUpdateTask = (task, prevId) => {
    // Always generate a new task with a new ID
    prevId ? removeTask(prevId) : console.log("no previd");
    const newTask = {
      ...task,
      id: uuidv4(), // Always generate a new unique ID
      bucketId: id,
    };

    addTask(newTask);
  };

  const handleDeleteBucket = () => {
    if (id || bucket?.id) {
      const bucketId = id || bucket.id;
      // Remove all tasks associated with the bucket
      if (bucketTasks && bucketTasks.length > 0) {
        bucketTasks.forEach((task) => {
          removeTask(task.id);
        });
      }
      // Remove the bucket
      removeBucket(bucketId);
      // Navigate back to the previous screen
      router.back();
    } else {
      console.error("Bucket ID not found. Unable to delete bucket.");
    }
  };

  const handleTaskPress = (task) => {
    setSelectedTask(task);
    setTaskWizardData(task);
  };

  const closeTaskModal = () => {
    setTaskWizardVisible(false);
    setIsEditing(false);
    setSelectedTask(null);
    setTaskWizardData(null);
  };

  const handleEditTask = () => {
    setIsEditing(true);
    setTaskWizardVisible(true);
  };

  const handleRemoveTask = () => {
    if (selectedTask) {
      removeTask(selectedTask.id);
      setSelectedTask(null);
    }
  };

  const closeTaskWizard = () => {
    setTaskWizardVisible(false);
    setTimeout(() => {
      setTaskWizardData(null); // Reset data after modal fully closes
      setIsEditing(false);
      setSelectedTask(null);
    }, 300); // Delay to allow modal animation to complete
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.title}>
          {bucket ? `Bucket: ${bucket.name}` : "Bucket not found"}
        </Text>
        <Pressable onPress={() => handleDeleteBucket()}>
          <MaterialIcons name="delete-outline" size={24} color="666666" />
        </Pressable>
      </View>

      <FlatList
        data={bucketTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleTaskPress(item)}>
            <View style={styles.taskCard}>
              <Text style={styles.taskText}>{item.title}</Text>
            </View>
          </Pressable>
        )}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => {
          setIsEditing(false);
          setTaskWizardData(null); // Clear the initial data for a new task
          setTaskWizardVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>Add Task</Text>
      </Pressable>

      <Modal
        visible={taskWizardVisible}
        animationType="slide"
        onRequestClose={closeTaskWizard}
      >
        <TaskWizard
          onClose={closeTaskWizard}
          onSave={handleAddOrUpdateTask}
          initialData={taskWizardData}
        />
      </Modal>
      {selectedTask && (
        <Modal visible={true} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContentBoxed}>
              <Text style={styles.modalTitle}>{selectedTask.title}</Text>
              {selectedTask.notes && (
                <View style={styles.modalSectionBox}>
                  <Text style={styles.modalDetailText}>
                    {selectedTask.notes}
                  </Text>
                </View>
              )}
              <View style={[styles.modalSectionBox, styles.halfWidthRow]}>
                <View
                  style={[styles.halfWidthItem, styles.halfWidthItemMargin]}
                >
                  <Text style={styles.modalDetailText}>
                    {selectedTask.isRecurring ? "Recurring" : "One-Time"}
                  </Text>
                </View>
                {selectedTask.isRecurring && (
                  <View
                    style={[styles.halfWidthItem, styles.halfWidthItemMargin]}
                  >
                    <Text style={styles.modalDetailText}>
                      {selectedTask.recurringDetails}
                    </Text>
                  </View>
                )}
              </View>
              {selectedTask.startDate && (
                <View style={[styles.modalSectionBox, styles.halfWidthRow]}>
                  <View
                    style={[styles.halfWidthItem, styles.halfWidthItemMargin]}
                  >
                    <Text style={styles.modalDetailText}>
                      {new Date(selectedTask.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              )}
              {selectedTask.tags.length > 0 && (
                <View style={styles.modalSectionBox}>
                  <Text style={styles.modalDetailText}>
                    {selectedTask.tags.join(", ")}
                  </Text>
                </View>
              )}
              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={styles.editModalButton}
                  onPress={handleEditTask}
                >
                  <MaterialIcons name="edit" size={24} color="#FFF" />
                </Pressable>
                <Pressable
                  style={styles.deleteModalButton}
                  onPress={handleRemoveTask}
                >
                  <MaterialIcons name="delete" size={24} color="#FFF" />
                </Pressable>
                <Pressable
                  style={styles.closeModalButton}
                  onPress={closeTaskModal}
                >
                  <MaterialIcons name="close" size={24} color="#FFF" />
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: { flexDirection: "row", justifyContent: "space-between" },
  container: { flex: 1, backgroundColor: "#F8F9FA", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#000", marginBottom: 20 },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  taskText: { fontSize: 16, color: "#333" },
  addButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  addButtonText: { fontSize: 16, color: "#FFF", fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentBoxed: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalSectionBox: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  modalDetailText: {
    fontSize: 16,
    color: "#333",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editModalButton: {
    backgroundColor: "#FFA500",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  deleteModalButton: {
    backgroundColor: "#FF0000",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeModalButton: {
    backgroundColor: "#FF6347",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  halfWidthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidthItem: {
    width: "48%",
  },
  halfWidthItemMargin: {
    marginRight: 8,
  },
});
