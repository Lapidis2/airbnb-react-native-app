import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function TripsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Trips</Text>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          No trips booked yet
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Time to explore and book your first trip!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 24,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});
