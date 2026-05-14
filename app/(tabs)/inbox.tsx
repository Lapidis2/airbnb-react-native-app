import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const mockMessages = [
  {
    id: "1",
    avatar: "https://i.pravatar.cc/150?img=10",
    name: "Craig",
    subtitle: null,
    preview: "Alright got it we'll make do thanks a lot",
    time: "2h",
    unread: false,
  },
  {
    id: "2",
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Craig · Yonkers",
    subtitle: "Airbnb update: Reservation canceled",
    preview: "Canceled · Feb 13 - 14, 2023",
    time: "1d",
    unread: true,
  },
  {
    id: "3",
    avatar: "https://i.pravatar.cc/150?img=20",
    name: "Erin · New York",
    subtitle: "New date and time request",
    preview: "Request pending",
    time: "3d",
    unread: false,
  },
  {
    id: "4",
    avatar: "https://i.pravatar.cc/150?img=5",
    name: "Sarah · Manhattan",
    subtitle: null,
    preview: "Looking forward to your stay!",
    time: "5d",
    unread: false,
  },
];

const mockNotifications = [
  {
    id: "1",
    icon: "https://i.pravatar.cc/150?img=15",
    title: "Booking confirmed",
    body: "Your reservation for Yonkers is confirmed.",
    time: "1h",
  },
  {
    id: "2",
    icon: "https://i.pravatar.cc/150?img=22",
    title: "Price drop alert",
    body: "A saved listing dropped in price.",
    time: "2d",
  },
];

export default function InboxScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"messages" | "notifications">("messages");

  const unreadCount = mockMessages.filter((m) => m.unread).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Inbox</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("messages")}
          >
            <View style={styles.tabLabelRow}>
              <Text
                style={[
                  styles.tabText,
                  activeTab === "messages"
                    ? { color: colors.text, fontWeight: "600" }
                    : { color: colors.textSecondary },
                ]}
              >
                Messages
              </Text>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </View>
            {activeTab === "messages" && (
              <View style={styles.tabUnderline} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab("notifications")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "notifications"
                  ? { color: colors.text, fontWeight: "600" }
                  : { color: colors.textSecondary },
              ]}
            >
              Notifications
            </Text>
            {activeTab === "notifications" && (
              <View style={styles.tabUnderline} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === "messages"
          ? mockMessages.map((msg) => (
              <TouchableOpacity
                key={msg.id}
                activeOpacity={0.7}
                style={[styles.row, { borderBottomColor: colors.border }]}
              >
                {/* Avatar */}
                <View style={styles.avatarWrap}>
                  <Image source={{ uri: msg.avatar }} style={styles.avatar} />
                  {msg.unread && <View style={styles.unreadDot} />}
                </View>

                {/* Text */}
                <View style={styles.rowContent}>
                  <View style={styles.rowTop}>
                    <Text
                      style={[
                        styles.rowName,
                        { color: colors.text, fontWeight: msg.unread ? "700" : "500" },
                      ]}
                      numberOfLines={1}
                    >
                      {msg.name}
                    </Text>
                    <Text style={[styles.rowTime, { color: colors.textSecondary }]}>
                      {msg.time}
                    </Text>
                  </View>
                  {msg.subtitle && (
                    <Text
                      style={[styles.rowSubtitle, { color: colors.text }]}
                      numberOfLines={1}
                    >
                      {msg.subtitle}
                    </Text>
                  )}
                  <Text
                    style={[styles.rowPreview, { color: colors.textSecondary }]}
                    numberOfLines={1}
                  >
                    {msg.preview}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          : mockNotifications.map((notif) => (
              <TouchableOpacity
                key={notif.id}
                activeOpacity={0.7}
                style={[styles.row, { borderBottomColor: colors.border }]}
              >
                <Image source={{ uri: notif.icon }} style={styles.avatar} />
                <View style={styles.rowContent}>
                  <View style={styles.rowTop}>
                    <Text style={[styles.rowSubtitle, { color: colors.text }]}>
                      {notif.title}
                    </Text>
                    <Text style={[styles.rowTime, { color: colors.textSecondary }]}>
                      {notif.time}
                    </Text>
                  </View>
                  <Text
                    style={[styles.rowPreview, { color: colors.textSecondary }]}
                    numberOfLines={2}
                  >
                    {notif.body}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomWidth: 1,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  tabs: {
    flexDirection: "row",
    gap: 24,
  },
  tab: {
    paddingBottom: 10,
  },
  tabLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tabText: {
    fontSize: 15,
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#FF385C",
    borderRadius: 2,
  },
  badge: {
    backgroundColor: "#FF385C",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  avatarWrap: { position: "relative", marginRight: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF385C",
    borderWidth: 2,
    borderColor: "white",
  },
  rowContent: { flex: 1 },
  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  rowName: { fontSize: 15, flex: 1, marginRight: 8 },
  rowSubtitle: { fontSize: 14, fontWeight: "600", marginBottom: 2 },
  rowPreview: { fontSize: 13 },
  rowTime: { fontSize: 12 },
});
