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

function LinkRow({ label, description, onPress, colors }: any) {
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={{ flex: 1, marginRight: 12 }}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {description && (
          <Text style={[styles.rowDesc, { color: colors.textSecondary }]}>{description}</Text>
        )}
      </View>
      <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function PrivacySharingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [profileVisible, setProfileVisible] = useState(true);
  const [activityVisible, setActivityVisible] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [dataPersonalization, setDataPersonalization] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy and sharing</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PROFILE VISIBILITY</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <ToggleRow label="Public profile" description="Let others see your profile and reviews" value={profileVisible} onChange={setProfileVisible} colors={colors} />
          <ToggleRow label="Activity status" description="Show when you were last active" value={activityVisible} onChange={setActivityVisible} colors={colors} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>DATA & PERSONALIZATION</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <ToggleRow label="Personalized recommendations" description="Use my activity to improve suggestions" value={dataPersonalization} onChange={setDataPersonalization} colors={colors} />
          <ToggleRow label="Location sharing" description="Share location for better search results" value={locationSharing} onChange={setLocationSharing} colors={colors} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>DATA RIGHTS</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <LinkRow label="Download your data" description="Get a copy of your personal data" onPress={() => {}} colors={colors} />
          <LinkRow label="Delete your account" description="Permanently remove your account and data" onPress={() => {}} colors={colors} />
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
