import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Key for AsyncStorage
  const STORAGE_KEY = "tasks";

  // Load tasks from AsyncStorage when the app initializes
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
        }
      } catch (e) {
        console.error("Failed to load tasks from AsyncStorage", e);
      }
    };

    loadTasks();
  }, []);

  // Save tasks to AsyncStorage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      const startTime = Date.now();
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error("Failed to save tasks to AsyncStorage", e);
      }
      const endTime = Date.now();
    };

    saveTasks();
  }, [tasks]);

  // Add a task
  const addTask = (task) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Remove a task by ID
  const removeTask = (taskId) => {
    setTasks((prevTasks) => {
      console.log(`Removing task: ${taskId}`);
      return prevTasks.filter((task) => task.id !== taskId);
    });
  };

  // complete tasks determining if they should be removed or postponed bc of recurring
  const completeTask = (taskId) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (!taskToUpdate) {
      console.error(`Task with ID ${taskId} not found`);
      return;
    }

    if (!taskToUpdate.isRecurring) {
      // Use removeTask for non-recurring tasks
      removeTask(taskId);
      return;
    }

    // Handle recurring tasks
    const nextDate = new Date(taskToUpdate.startDate);
    if (taskToUpdate.recurringDetails === "Daily") {
      nextDate.setDate(nextDate.getDate() + 1);
    } else if (taskToUpdate.recurringDetails === "Weekly") {
      nextDate.setDate(nextDate.getDate() + 7);
    } else if (taskToUpdate.recurringDetails === "Monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }

    // Update the task
    const updatedTask = { ...taskToUpdate, startDate: nextDate.toISOString() };

    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
    );
  };

  // Reorder tasks based on a provided new order
  const reorderTasks = (newOrder) => {
    if (!Array.isArray(newOrder)) {
      console.error("New order must be an array:", newOrder);
      return;
    }
    setTasks(newOrder);
  };

  // Calculate urgency score
  const calculateUrgencyScore = (task, tagUrgencyScores) => {
    if (!task.tags || task.tags.length === 0) return 0; // No tags, no urgency
    const totalScore = task.tags.reduce(
      (sum, tag) => sum + (tagUrgencyScores[tag] || 1),
      0
    );
    return totalScore / task.tags.length; // Weighted average
  };

  // Filter and sort tasks
  const getSortedTasks = useCallback(
    (tags, completedTasks) => {
      const tagUrgencyScores = tags.reduce((scores, tag) => {
        scores[tag.name] = tag.urgency || 1;
        return scores;
      }, {});

      const today = new Date();
      const tenDaysFromToday = new Date();
      tenDaysFromToday.setDate(today.getDate() + 10);

      const filteredTasks = tasks.filter((task) => {
        if (completedTasks.includes(task.id)) return false;

        const taskDate = new Date(task.startDate);

        if (!task.isRecurring) {
          // Include non-recurring tasks with start dates in the past or today
          return taskDate <= today;
        }

        // Handle recurring tasks
        if (task.recurringDetails === "Daily") {
          return true; // Always include daily tasks
        }

        if (task.recurringDetails === "Weekly") {
          // Include weekly tasks due within the next 10 days
          const daysDifference = (taskDate - today) / (1000 * 60 * 60 * 24);
          return daysDifference >= 0 && daysDifference <= 10;
        }

        if (task.recurringDetails === "Monthly") {
          // Include tasks recurring on the same day of the month within the range
          const taskDay = taskDate.getDate();
          const todayDay = today.getDate();
          const tenDaysFromTodayDay = tenDaysFromToday.getDate();

          // Show if the task is due earlier this month or is coming up in the next 10 days
          const isThisMonth =
            taskDay >= todayDay && taskDate.getMonth() === today.getMonth();
          const isNextMonth =
            taskDay <= tenDaysFromTodayDay &&
            taskDate.getMonth() === tenDaysFromToday.getMonth();

          return isThisMonth || isNextMonth;
        }

        return false;
      });

      return filteredTasks.sort((a, b) => {
        const urgencyA = calculateUrgencyScore(a, tagUrgencyScores);
        const urgencyB = calculateUrgencyScore(b, tagUrgencyScores);
        return urgencyB - urgencyA;
      });
    },
    [tasks]
  );

  useEffect(() => {
    const saveTasks = async () => {
      if (!Array.isArray(tasks)) {
        console.error("Tasks should be an array:", tasks);
        return;
      }
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error("Failed to save tasks to AsyncStorage", e);
      }
    };

    saveTasks();
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        removeTask,
        reorderTasks,
        getSortedTasks,
        completeTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  return useContext(TaskContext);
}
