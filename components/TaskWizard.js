import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { TagsContext } from "../app/context/TagsContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { styles } from "./TaskWizardStyles";

export default function TaskWizard({ onClose, onSave, initialData }) {
  const { tags: availableTags } = useContext(TagsContext);

  // Initialize state with initialData if provided, or set defaults
  const [taskTitle, setTaskTitle] = useState(initialData?.title || "");
  const [isRecurring, setIsRecurring] = useState(
    initialData?.isRecurring || false
  );
  const [recurringType, setRecurringType] = useState(
    initialData?.recurringDetails || ""
  );
  const [startDate, setStartDate] = useState(initialData?.startDate || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [selectedTags, setSelectedTags] = useState(initialData?.tags || []);
  const [step, setStep] = useState(1);
  const [frequencyModalVisible, setFrequencyModalVisible] = useState(false);

  useEffect(() => {
    if (!initialData) {
      setTaskTitle("");
      setIsRecurring(false);
      setRecurringType("");
      setStartDate(null);
      setNotes("");
      setSelectedTags([]);
    }
  }, [initialData]);

  const tagColors = {
    "Follow Up": "#FFD700",
    "High Priority": "#FF6347",
    "Low Priority": "#90EE90",
    "Big Project": "#87CEEB",
    Project: "#DDA0DD",
    "R&D": "#FFA500",
    default: "#FCBC1E",
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSave = () => {
    const task = {
      title: taskTitle,
      isRecurring,
      recurringDetails: recurringType,
      notes,
      tags: selectedTags,
      startDate: startDate,
    };
    onSave(task, initialData ? initialData.id : null);
    onClose();
  };

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag.name)
        ? prevTags.filter((t) => t !== tag.name)
        : [...prevTags, tag.name]
    );
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 1 && (
        <View style={styles.stepContainer}>
          <Text style={styles.prompt}>
            What would you like to call this task?
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Task title"
            value={taskTitle}
            onChangeText={setTaskTitle}
          />
          <Pressable style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContainer}>
          <Text style={styles.prompt}>
            Is this a one-time task or recurring?
          </Text>
          <View style={styles.optionsContainer}>
            <Pressable
              style={
                !isRecurring
                  ? [styles.optionBox, styles.selectedOptionBox]
                  : styles.optionBox
              }
              onPress={() => setIsRecurring(false)}
            >
              <Text style={styles.optionText}>One-Time</Text>
            </Pressable>
            <Pressable
              style={
                isRecurring
                  ? [styles.optionBox, styles.selectedOptionBox]
                  : styles.optionBox
              }
              onPress={() => setIsRecurring(true)}
            >
              <Text style={styles.optionText}>Recurring</Text>
            </Pressable>
          </View>
          {isRecurring && (
            <View style={styles.recurringDetailsContainer}>
              <Pressable
                style={styles.frequencyBox}
                onPress={() => setFrequencyModalVisible(true)}
              >
                <Text style={styles.optionText}>
                  {recurringType || "Frequency"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.frequencyBox}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.optionText}>
                  {startDate
                    ? new Date(startDate).toLocaleDateString()
                    : "Start Date"}
                </Text>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
          )}

          <Pressable style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContainer}>
          <Text style={styles.prompt}>Add notes and tags</Text>
          <TextInput
            style={styles.input}
            placeholder="Notes"
            value={notes}
            onChangeText={setNotes}
          />
          <View style={styles.tagsContainer}>
            {availableTags.map((tag) => (
              <Pressable
                key={tag.name}
                style={
                  selectedTags.includes(tag.name)
                    ? [
                        styles.tag,
                        {
                          backgroundColor:
                            tagColors[tag.name] || tagColors.default,
                        },
                      ]
                    : [styles.tag, { backgroundColor: "#E0E0E0" }]
                }
                onPress={() => toggleTag(tag)}
              >
                <Text style={styles.tagText}>{tag.name}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Task</Text>
          </Pressable>
        </View>
      )}

      {/* Back Button */}
      {step > 1 && (
        <Pressable style={styles.backButton} onPress={prevStep}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </Pressable>
      )}

      {/* Close Button */}
      <Pressable style={styles.closeButton} onPress={onClose}>
        <MaterialIcons name="close" size={24} color="#333" />
      </Pressable>

      {/* Frequency Selection Modal */}
      <Modal
        visible={frequencyModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFrequencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Frequency</Text>
            {["Daily", "Weekly", "Monthly"].map((type) => (
              <Pressable
                key={type}
                style={styles.modalOption}
                onPress={() => {
                  setRecurringType(type);
                  setFrequencyModalVisible(false);
                }}
              >
                <Text style={styles.modalOptionText}>{type}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
