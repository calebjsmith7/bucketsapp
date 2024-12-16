import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTaskContext } from "@/app/context/TaskContext";
import { useTagsContext } from "@/app/context/TagsContext";

export default function NotificationService() {
  const { getSortedTasks, tasks } = useTaskContext();
  const { tags } = useTagsContext();

  // Configure the notification handler once
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  const scheduleDailyNotification = async () => {
    try {
      // Wait for tasks to load from AsyncStorage
      if (tasks.length === 0) {
        console.log(
          "Tasks not yet loaded, delaying notification scheduling..."
        );
        return;
      }

      // Check if notifications are enabled
      const isEnabled = await AsyncStorage.getItem("notificationsEnabled");
      if (isEnabled !== "true") return;

      // Fetch sorted tasks
      const sortedTasks = getSortedTasks(tags, []); // Pass tags and empty completedTasks array
      const firstTaskTitle = sortedTasks?.[0]?.title || "No tasks available";

      // Cancel existing scheduled notifications to prevent duplication
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule a daily notification at 8 AM
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Good Morning!",
          body: `You have ${sortedTasks.length} items in your cue. The first task is "${firstTaskTitle}".`,
        },
        trigger: {
          hour: 8, // 8 AM
          minute: 30, // Adjust time if testing
          repeats: true, // Ensure it repeats daily
          type: "daily",
        },
      });

      console.log("Daily notification scheduled successfully.");
    } catch (error) {
      console.error("Failed to schedule daily notification:", error);
    }
  };

  useEffect(() => {
    const initializeNotification = async () => {
      Notifications.requestPermissionsAsync().then(({ status }) => {
        if (status === "granted") {
          console.log("Notification permissions granted");
          scheduleDailyNotification();
        } else {
          console.log("Notification permissions not granted");
        }
      });
    };

    // Delay scheduling to ensure tasks are loaded from AsyncStorage
    const delayNotification = setTimeout(() => {
      initializeNotification();
    }, 2000); // Adjust delay if needed

    return () => clearTimeout(delayNotification);
  }, [tasks, tags]); // Re-run when tasks or tags change

  return null;
}
