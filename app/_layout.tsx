import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { BucketsProvider } from "./context/BucketsContext";
import TagsProvider from "./context/TagsContext";
import { TaskProvider } from "./context/TaskContext";
import { useColorScheme } from "@/components/useColorScheme";
import VisualsProvider from "./context/VisualsContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationService from "../components/NotificationService";
/*
const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared!");
  } catch (e) {
    console.error("Failed to clear AsyncStorage", e);
  }
};

clearAsyncStorage();
*/
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <BucketsProvider>
      <TagsProvider>
        <TaskProvider>
          <VisualsProvider>
            <ThemeProvider value={DefaultTheme}>
              <NotificationService />
              <Stack
                screenOptions={{
                  headerTitle: "", // Disable the title globally
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal" }}
                />
              </Stack>
            </ThemeProvider>
          </VisualsProvider>
        </TaskProvider>
      </TagsProvider>
    </BucketsProvider>
  );
}
