import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

function BadgeIcon({
  name,
  color,
  size = 24,
  badge,
}: {
  name: React.ComponentProps<typeof IconSymbol>["name"];
  color: string;
  size?: number;
  badge?: boolean;
}) {
  return (
    <View>
      <IconSymbol size={size} name={name} color={color} />
      {badge && <View style={styles.badge} />}
    </View>
  );
}

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
            <BadgeIcon name="magnifyingglass" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <BadgeIcon name="heart" color={color} badge />
          ),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ color }) => (
            <BadgeIcon name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color }) => (
            <BadgeIcon name="bubble.left" color={color} badge />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <BadgeIcon name="person" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -1,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#FF385C",
    borderWidth: 1.5,
    borderColor: "white",
  },
});
