import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  ScrollView,
  Modal,
  Animated,
  Button,
} from "react-native";
import { useVisualsContext } from "./context/VisualsContext"; // Visual preferences context
import { useRouter } from "expo-router";
import ColorPicker, {
  Panel1,
  Swatches,
  Preview,
  HueSlider,
} from "reanimated-color-picker";
import { LinearGradient } from "expo-linear-gradient";

// Map background names to their respective require calls
const backgroundImages = {
  wood_texture: require("../assets/images/wood_texture.png"),
  wood_texture2: require("../assets/images/wood_texture2.png"),
  wood_texture3: require("../assets/images/wood_texture3.png"),
};

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

export default function VisualsSettings() {
  const { setVisuals } = useVisualsContext();
  const router = useRouter();

  const [selectedBackground, setSelectedBackground] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [selectedBucketColor, setSelectedBucketColor] = useState(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const checkmarkScale = useRef(new Animated.Value(0)).current;
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSave = () => {
    const randomizeBucketColors = selectedBucketColor === "random";
    const bucketColor = randomizeBucketColors
      ? Object.keys(bucketColorImages)[
          Math.floor(Math.random() * Object.keys(bucketColorImages).length)
        ]
      : selectedBucketColor || "bucket-white";

    setVisuals({
      backgroundType: selectedBackground === "color" ? "color" : "image",
      background:
        selectedBackground === "color"
          ? selectedColor
          : selectedBackground || "wood_texture",
      bucketColor,
      randomizeBucketColors,
    });

    // Show success modal
    setSuccessVisible(true);

    // Start checkmark animation
    Animated.spring(checkmarkScale, {
      toValue: 1,
      friction: 3,
      tension: 50,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        // Hide modal and redirect after 1.5 seconds
        setSuccessVisible(false);
        router.push("/buckets");
      }, 500);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Visual Settings</Text>

      {/* Background Selection */}
      <Text style={styles.sectionTitle}>Choose Background</Text>
      <FlatList
        data={[...Object.keys(backgroundImages), "color"]}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) =>
          item === "color" ? (
            <Pressable
              style={[
                styles.option,
                selectedBackground === "color" && styles.selectedOption,
                styles.colorOption,
              ]}
              onPress={() => {
                setSelectedBackground("color");
                setShowColorPicker(true);
              }}
            >
              <LinearGradient
                colors={["green", "yellow", "red"]} // Gradient from green to yellow to red
                style={styles.colorOption}
                start={{ x: 0, y: 0 }} // Top-left corner
                end={{ x: 1, y: 1 }} // Bottom-right corner
              >
                <Text style={styles.text}>COLOR</Text>
              </LinearGradient>
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.option,
                selectedBackground === item && styles.selectedOption,
              ]}
              onPress={() => setSelectedBackground(item)}
            >
              <Image
                source={backgroundImages[item]}
                style={styles.previewImage}
              />
            </Pressable>
          )
        }
      />

      {/* Color Picker Modal */}
      <Modal visible={showColorPicker} animationType="slide">
        <ColorPicker
          style={styles.colorPicker}
          value={selectedColor}
          onComplete={(color) => setSelectedColor(color.hex)}
        >
          <Preview style={{ marginBottom: 10 }} />
          <Panel1 style={{ marginBottom: 10 }} />
          <HueSlider style={{ marginBottom: 10 }} />
          <Swatches style={{ marginBottom: 10 }} />
        </ColorPicker>
        <Button
          style={styles.completeColor}
          title="Done"
          onPress={() => setShowColorPicker(false)}
        />
      </Modal>

      {/* Bucket Colors */}
      <Text style={styles.sectionTitle}>Choose Bucket Color</Text>
      <FlatList
        data={[...Object.keys(bucketColorImages), "random"]}
        horizontal
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.option,
              selectedBucketColor === item && styles.selectedOption,
            ]}
            onPress={() => setSelectedBucketColor(item)}
          >
            {item === "random" ? (
              <Text style={styles.randomText}>Random</Text>
            ) : (
              <Image
                source={bucketColorImages[item]}
                style={styles.previewImage}
              />
            )}
          </Pressable>
        )}
      />

      {/* Save Button */}
      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>

      {/* Success Modal */}
      {successVisible && (
        <Modal transparent={true} visible={successVisible} animationType="fade">
          <View style={styles.successModal}>
            <Text style={styles.successText}>Saved Successfully!</Text>
            <Animated.View
              style={[
                styles.checkmarkContainer,
                { transform: [{ scale: checkmarkScale }] },
              ]}
            >
              <Text style={styles.checkmark}>✔</Text>
            </Animated.View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  option: {
    margin: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: "#4CAF50",
  },
  previewImage: {
    width: 100,
    height: 100,
  },
  colorOption: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "pink",
  },
  gradientBox: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "linear-gradient(90deg, red, green)",
    justifyContent: "center",
    alignItems: "center",
  },
  colorOptionText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  colorPicker: {
    padding: 25,
    paddingTop: 50,
  },

  saveButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  saveButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  successModal: {
    flex: 1,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  successText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 20,
  },
  checkmarkContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 50,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  text: {
    fontWeight: 600,
    fontSize: 16,
  },
});
