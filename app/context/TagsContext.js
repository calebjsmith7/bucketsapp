import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TagsContext = createContext();

const initialTags = [
  { id: "tag-1", name: "Low Priority", urgency: 1 },
  { id: "tag-2", name: "Mid Priority", urgency: 5 },
  { id: "tag-3", name: "High Priority", urgency: 9 },
  { id: "tag-4", name: "Follow Up", urgency: 10 },
  { id: "tag-5", name: "Project", urgency: 3 },
  { id: "tag-6", name: "Big Project", urgency: 2 },
  { id: "tag-7", name: "Low Difficulty", urgency: 9 },
  { id: "tag-8", name: "Mid Difficulty", urgency: 5 },
  { id: "tag-9", name: "High Difficulty", urgency: 1 },
  { id: "tag-10", name: "R&D", urgency: 1 },
];

export default function TagsProvider({ children }) {
  const [tags, setTags] = useState(initialTags);

  // Key for AsyncStorage
  const STORAGE_KEY = "tags";

  // Load tags from AsyncStorage when the app initializes
  useEffect(() => {
    const loadTags = async () => {
      try {
        const storedTags = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTags) {
          setTags(JSON.parse(storedTags));
        }
      } catch (e) {
        console.error("Failed to load tags from storage", e);
      }
    };

    loadTags();
  }, []);

  // Save tags to AsyncStorage whenever they change
  useEffect(() => {
    const saveTags = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
      } catch (e) {
        console.error("Failed to save tags to storage", e);
      }
    };

    saveTags();
  }, [tags]);

  // Function to add a new tag
  const addTag = (newTag) => {
    setTags((prevTags) => [...prevTags, newTag]);
  };

  // Function to update an existing tag by ID
  const updateTag = (updatedTag) => {
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === updatedTag.id ? { ...tag, ...updatedTag } : tag
      )
    );
  };

  // Function to remove a tag by ID
  const removeTag = (tagId) => {
    setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId));
  };

  return (
    <TagsContext.Provider value={{ tags, addTag, updateTag, removeTag }}>
      {children}
    </TagsContext.Provider>
  );
}

export function useTagsContext() {
  return useContext(TagsContext);
}
