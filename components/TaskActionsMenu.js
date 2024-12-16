// TaskActionsMenu.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function TaskActionsMenu({ visible, onClose, onSelectOption }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuOption}
            onPress={() => onSelectOption("Delete task")}
          >
            <Text style={styles.menuText}>Delete task</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeArea} onPress={onClose}>
            <Text style={styles.closeText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    width: 250,
  },
  menuOption: {
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  closeArea: {
    paddingVertical: 12,
  },
  closeText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
