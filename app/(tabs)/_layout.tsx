import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF385C",
        tabBarInactiveTintColor: "#999",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          borderTopColor: Colors[colorScheme ?? "light"].border,
          backgroundColor: Colors[colorScheme ?? "light"].background,
        },
      }}
    >
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="heart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="bubble.left" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
