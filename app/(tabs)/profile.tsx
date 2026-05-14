import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AVATAR_PLACEHOLDER = "https://i.pravatar.cc/150?img=12";

function SettingsRow({
  icon,
  label,
  onPress,
  showChevron = true,
}: {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <IconSymbol name={icon} size={22} color={colors.text} />
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      {showChevron && (
        <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const avatarUri = user?.avatar ?? AVATAR_PLACEHOLDER;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* User Header */}
      <TouchableOpacity
        style={styles.userHeader}
        onPress={() => router.push("/personal-information")}
        activeOpacity={0.8}
      >
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name ?? "Guest"}
          </Text>
          <Text style={[styles.viewProfile, { color: colors.textSecondary }]}>
            View profile
          </Text>
        </View>
        <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Earn Money Banner */}
      <TouchableOpacity
        style={[styles.banner, { borderColor: colors.border }]}
        activeOpacity={0.85}
      >
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Earn money from your extra space</Text>
          <Text style={[styles.bannerLink, { color: "#FF385C" }]}>Learn more</Text>
        </View>
      </TouchableOpacity>

      {/* Account Settings */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Account Settings
      </Text>

      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="person"
          label="Personal information"
          onPress={() => router.push("/personal-information")}
        />
        <SettingsRow
          icon="heart"
          label="Payments and payouts"
          onPress={() => router.push("/payments")}
        />
        <SettingsRow
          icon="pencil"
          label="Translation"
          onPress={() => {}}
        />
        <SettingsRow
          icon="gearshape.fill"
          label="Notifications"
          onPress={() => router.push("/notifications-settings")}
        />
        <SettingsRow
          icon="gearshape.fill"
          label="Privacy and sharing"
          onPress={() => router.push("/privacy-sharing")}
        />
        <SettingsRow
          icon="map"
          label="Travel for work"
          onPress={() => router.push("/travel-for-work")}
        />
      </View>

      {/* Hosting */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Hosting</Text>
      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="house.fill"
          label="List your space"
          onPress={() => {}}
        />
        <SettingsRow
          icon="star.fill"
          label="Host an experience"
          onPress={() => {}}
        />
      </View>

      {/* Support */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Support</Text>
      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="questionmark.circle.fill"
          label="Visit the Help Center"
          onPress={() => {}}
        />
        <SettingsRow
          icon="info.circle.fill"
          label="Get help with a safety issue"
          onPress={() => {}}
        />
      </View>

      {/* Legal */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="info.circle.fill"
          label="Terms of Service"
          onPress={() => {}}
        />
        <SettingsRow
          icon="info.circle.fill"
          label="Privacy Policy"
          onPress={() => {}}
        />
        <SettingsRow
          icon="info.circle.fill"
          label="Open source licenses"
          onPress={() => {}}
        />
      </View>

      {/* Sign out */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sign out</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.textSecondary }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  userHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 14,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: "700", marginBottom: 2 },
  viewProfile: { fontSize: 14 },
  banner: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  bannerContent: { gap: 6 },
  bannerTitle: { fontSize: 15, fontWeight: "600", color: "#222" },
  bannerLink: { fontSize: 14, fontWeight: "600", textDecorationLine: "underline" },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  group: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 14,
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FF385C",
    textDecorationLine: "underline",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 16,
  },
});
