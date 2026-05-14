import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ToggleRow({ label, description, value, onChange, colors }: any) {
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {description && (
          <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: "#FF385C" }}
        thumbColor="white"
      />
    </View>
  );
}

export default function NotificationsSettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [bookings, setBookings] = useState(true);
  const [messages, setMessages] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [tips, setTips] = useState(true);
  const [news, setNews] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ACCOUNT ACTIVITY</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <ToggleRow label="Booking updates" description="Confirmations, changes and cancellations" value={bookings} onChange={setBookings} colors={colors} />
          <ToggleRow label="Messages" description="New messages from hosts and guests" value={messages} onChange={setMessages} colors={colors} />
          <ToggleRow label="Reminders" description="Check-in reminders and trip details" value={reminders} onChange={setReminders} colors={colors} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>OFFERS & UPDATES</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <ToggleRow label="Promotions and deals" description="Discounts, special offers and coupons" value={promotions} onChange={setPromotions} colors={colors} />
          <ToggleRow label="Tips and inspiration" description="Travel tips and destination ideas" value={tips} onChange={setTips} colors={colors} />
          <ToggleRow label="Airbnb news" description="Product updates and announcements" value={news} onChange={setNews} colors={colors} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  group: { borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 4 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: 15, fontWeight: "500", marginBottom: 2 },
  rowDesc: { fontSize: 13, lineHeight: 18 },
});
