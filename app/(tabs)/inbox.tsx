import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

const mockMessages = [
  {
    id: "1",
    sender: "John Doe",
    message: "Thanks for booking!",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    sender: "Sarah Williams",
    message: "When will you arrive?",
    time: "5 hours ago",
    unread: false,
  },
];

const MessageItem = ({ message, colors }: any) => (
  <View style={[styles.messageItem, { borderBottomColor: colors.border }]}>
    <View style={styles.messageContent}>
      <Text
        style={[
          styles.senderName,
          { color: colors.text, fontWeight: message.unread ? "600" : "400" },
        ]}
      >
        {message.sender}
      </Text>
      <Text
        style={[styles.messageText, { color: colors.textSecondary }]}
        numberOfLines={1}
      >
        {message.message}
      </Text>
    </View>
    <Text style={[styles.time, { color: colors.textSecondary }]}>
      {message.time}
    </Text>
  </View>
);

export default function InboxScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.header, { color: colors.text }]}>Inbox</Text>
      <FlatList
        data={mockMessages}
        renderItem={({ item }) => (
          <MessageItem message={item} colors={colors} />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
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
    marginBottom: 16,
  },
  messageItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messageContent: {
    flex: 1,
    marginRight: 12,
  },
  senderName: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 13,
  },
  time: {
    fontSize: 12,
  },
});
