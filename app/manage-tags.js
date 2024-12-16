import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useTagsContext } from "./context/TagsContext";
import { useRouter } from "expo-router";

export default function ManageTags() {
  const { tags, addTag, updateTag } = useTagsContext(); // Use methods from TagsContext
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [newTagName, setNewTagName] = useState("");

  const handleAddTag = () => {
    setModalVisible(true);
  };

  const handleSaveTag = () => {
    if (newTagName.trim() === "") return;
    const newTag = {
      id: `tag-${Date.now()}`,
      name: newTagName.trim(),
      urgency: 5, // Default urgency
    };
    addTag(newTag); // Use addTag to add the new tag
    setNewTagName("");
    setModalVisible(false);
  };

  const handleUrgencyChange = (id, value) => {
    updateTag({ id, urgency: value }); // Use updateTag to update urgency
  };

  const getSliderColor = (urgency) => {
    if (urgency <= 3) return "#90EE90"; // Green
    if (urgency <= 6) return "#FFA500"; // Orange
    return "#FF6347"; // Red
  };

  const renderTag = ({ item }) => (
    <View style={styles.tagCard}>
      <Text style={styles.tagName}>{item.name}</Text>
      <View style={styles.sliderRow}>
        <Text style={styles.urgencyLabel}>Urgency: {item.urgency}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={item.urgency}
          onValueChange={(value) => handleUrgencyChange(item.id, value)}
          minimumTrackTintColor={getSliderColor(item.urgency)}
          maximumTrackTintColor="#DDD"
          thumbTintColor="#FFF"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text style={styles.headerTitle}>Manage Tags</Text>
      </View>

      {/* Tags List */}
      <FlatList
        data={tags}
        keyExtractor={(item) => item.id}
        renderItem={renderTag}
        contentContainerStyle={styles.listContent}
      />

      {/* FAB to Add Tag */}
      <TouchableOpacity style={styles.fab} onPress={handleAddTag}>
        <MaterialIcons name="add" size={32} color="#FFF" />
      </TouchableOpacity>

      {/* Modal for Adding a New Tag */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Tag</Text>
            <TextInput
              style={styles.tagInput}
              placeholder="Tag name"
              value={newTagName}
              onChangeText={setNewTagName}
            />
            <View style={styles.modalButtonsRow}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNewTagName("");
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveTag}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    backgroundColor: "#FFF",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  tagCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  tagName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  sliderRow: {
    flexDirection: "column",
  },
  urgencyLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
  },
  tagInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#DDD",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
});
