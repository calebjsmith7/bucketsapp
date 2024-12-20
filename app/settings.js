import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Switch,
  Modal,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const router = useRouter();

  // Demo state for toggles
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const handleContactPress = () => {
    const email = "calebjoelsmith@gmail.com";
    const subject = "Help & Feedback";
    const body = "Hello, I need help with...";
    const mailto = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailto).catch((err) =>
      console.log("Failed to open email client:", err)
    );
  };

  const handleAboutPress = () => {
    setAboutModalVisible(true);
  };

  const closeAboutModal = () => {
    setAboutModalVisible(false);
  };
  useEffect(() => {
    AsyncStorage.getItem("notificationsEnabled").then((value) => {
      setNotificationsEnabled(value === "true");
    });
  }, []);
  const handleManageTags = () => {
    // Navigate to manage-tags screen
    router.push("/manage-tags");
  };
  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem("notificationsEnabled", newValue.toString());
  };
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Settings Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* General Section */}
        <Text style={styles.sectionTitle}>General</Text>

        {/* Manage Tags */}
        <Pressable style={styles.settingItem} onPress={handleManageTags}>
          <View style={styles.settingLabelContainer}>
            <MaterialIcons
              name="label-outline"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
            <Text style={styles.settingLabel}>Manage Tags</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </Pressable>

        <Pressable
          style={styles.settingItem}
          onPress={() => router.push("/VisualsSettings")}
        >
          <View style={styles.settingLabelContainer}>
            <MaterialIcons
              name="palette"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
            <Text style={styles.settingLabel}>Visuals</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </Pressable>

        {/* Notifications (Toggle) */}
        <View style={styles.settingItem}>
          <View style={styles.settingLabelContainer}>
            <MaterialIcons
              name="notifications-none"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
            <Text style={styles.settingLabel}>Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: "#E0E0E0", true: "#4CAF50" }}
            thumbColor={notificationsEnabled ? "#FFF" : "#FFF"}
          />
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>

        <Pressable style={styles.settingItem} onPress={handleContactPress}>
          <View style={styles.settingLabelContainer}>
            <MaterialIcons
              name="help-outline"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
            <Text style={styles.settingLabel}>Help & Feedback</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </Pressable>

        <Pressable style={styles.settingItem} onPress={handleAboutPress}>
          <View style={styles.settingLabelContainer}>
            <MaterialIcons
              name="info-outline"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
            <Text style={styles.settingLabel}>About</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </Pressable>

        {/* About Modal */}
        <Modal
          visible={aboutModalVisible}
          animationType="slide"
          transparent
          onRequestClose={closeAboutModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>About Buckets</Text>
              <Text style={styles.modalText}>
                Buckets is your ultimate task-organizing app. Create, manage,
                and prioritize your tasks effortlessly. Designed to help you
                stay on top of your goals and improve productivity, Buckets
                makes task management simple and intuitive.
              </Text>
              <Pressable style={styles.closeButton} onPress={closeAboutModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1.5,
    borderBottomColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginVertical: 20,
  },
  settingItem: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#007BFF", // Blue color
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF", // White text
    textAlign: "center",
  },
});
