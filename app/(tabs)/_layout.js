import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, Image } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import logo from "../../assets/images/logo.png";

// TabBarIcon component for consistent icon styling
function TabBarIcon({ name, color }) {
  return (
    <FontAwesome
      size={28}
      style={{ marginBottom: -3 }}
      name={name}
      color={color}
    />
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#1d8a99",
        headerShown: true, // Ensure the header is visible
        headerTitle: () => (
          <Image
            source={logo}
            style={{ width: 160, height: 50, resizeMode: "contain" }}
          />
        ),
      }}
    >
      {/* Cue Tab */}
      <Tabs.Screen
        name="cue"
        options={{
          title: "Cue",
          tabBarIcon: ({ color }) => <TabBarIcon name="tasks" color={color} />,
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="cog"
                    size={25}
                    color={"#1d8a99"}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      {/* Buckets Tab */}
      <Tabs.Screen
        name="buckets"
        options={{
          title: "Buckets",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="archive" color={color} />
          ),
          headerRight: () => (
            <Link href="/settings" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="cog"
                    size={25}
                    color={"#1d8a99"}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
