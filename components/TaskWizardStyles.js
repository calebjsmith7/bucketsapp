import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#FFF", padding: 20 },
  stepContainer: { flex: 1, justifyContent: "center" },
  prompt: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#333" },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  nextButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    padding: 10,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  optionBox: {
    padding: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginHorizontal: 5,
  },
  selectedOptionBox: {
    backgroundColor: "#4CAF50",
  },
  optionText: {
    color: "#FFF",
    fontSize: 16,
  },
  recurringDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  frequencyBox: {
    padding: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  startDateBox: {
    padding: 20,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  tag: {
    padding: 10,
    borderRadius: 8,
    margin: 5,
  },
  selectedTag: {
    borderColor: "#4CAF50",
    borderWidth: 1.5,
  },
  tagText: {
    color: "#FFF",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#2196F3",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    paddingVertical: 10,
  },
  modalOptionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});
