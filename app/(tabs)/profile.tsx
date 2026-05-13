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

function SectionHeader({ title }: { title: string }) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  return (
    <Text style={[sectionStyles.header, { color: colors.textSecondary }]}>
      {title}
    </Text>
  );
}

const sectionStyles = StyleSheet.create({
  header: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
    marginTop: 24,
    paddingHorizontal: 16,
  },
});

function SettingsRow({
  icon,
  iconColor = "#FF385C",
  label,
  value,
  onPress,
  destructive,
  hideChevron,
}: {
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  iconColor?: string;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  hideChevron?: boolean;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  return (
    <TouchableOpacity
      style={[rowStyles.row, { borderBottomColor: colors.border, backgroundColor: colors.background }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={[rowStyles.iconWrap, { backgroundColor: destructive ? "#FFF0F0" : "#FFF5F5" }]}>
        <IconSymbol name={icon} size={18} color={destructive ? "#FF385C" : iconColor} />
      </View>
      <Text style={[rowStyles.label, { color: destructive ? "#FF385C" : colors.text }]}>
        {label}
      </Text>
      <View style={rowStyles.right}>
        {value ? (
          <Text style={[rowStyles.value, { color: colors.textSecondary }]} numberOfLines={1}>
            {value}
          </Text>
        ) : null}
        {!hideChevron && (
          <IconSymbol name="chevron.right" size={16} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  label: { flex: 1, fontSize: 15, fontWeight: "500" },
  right: { flexDirection: "row", alignItems: "center", gap: 6, maxWidth: 140 },
  value: { fontSize: 13 },
});

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
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Page title */}
      <Text style={[styles.pageTitle, { color: colors.text }]}>Profile</Text>

      {/* ── Hero Card ── */}
      <TouchableOpacity
        style={[styles.heroCard, { borderColor: colors.border }]}
        onPress={() => router.push("/edit-profile")}
        activeOpacity={0.85}
      >
        {/* Avatar */}
        <View style={styles.avatarWrap}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <View style={styles.avatarBadge}>
            <IconSymbol name="pencil" size={11} color="white" />
          </View>
        </View>

        {/* Info */}
        <View style={styles.heroInfo}>
          <Text style={[styles.heroName, { color: colors.text }]}>
            {user?.name ?? "Guest"}
          </Text>
          <Text style={[styles.heroEmail, { color: colors.textSecondary }]}>
            {user?.email ?? ""}
          </Text>
          {user?.bio ? (
            <Text
              style={[styles.heroBio, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {user.bio}
            </Text>
          ) : (
            <Text style={[styles.heroAddBio, { color: "#FF385C" }]}>
              + Add a bio
            </Text>
          )}
        </View>

        <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* ── Stats Row ── */}
      <View style={[styles.statsRow, { borderColor: colors.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Trips</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wishlists</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reviews</Text>
        </View>
      </View>

      {/* ── Joined date ── */}
      {user?.joinedDate && (
        <Text style={[styles.joinedText, { color: colors.textSecondary }]}>
          Member since {user.joinedDate}
        </Text>
      )}

      {/* ── Account ── */}
      <SectionHeader title="Account" />
      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="person"
          label="Edit profile"
          value={user?.name}
          onPress={() => router.push("/edit-profile")}
        />
        <SettingsRow
          icon="pencil"
          iconColor="#666"
          label="Change password"
          onPress={() => router.push("/change-password")}
        />
        <SettingsRow
          icon="bubble.left"
          iconColor="#666"
          label="Phone number"
          value={user?.phone ?? "Not set"}
          onPress={() => router.push("/edit-profile")}
        />
        <SettingsRow
          icon="map"
          iconColor="#666"
          label="Location"
          value={user?.location ?? "Not set"}
          onPress={() => router.push("/edit-profile")}
        />
      </View>

      {/* ── Hosting ── */}
      <SectionHeader title="Hosting" />
      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="house.fill"
          iconColor="#FF385C"
          label="Become a host"
          onPress={() => {}}
        />
        <SettingsRow
          icon="star.fill"
          iconColor="#FFB800"
          label="Reviews"
          value="0 reviews"
          onPress={() => {}}
        />
      </View>

      {/* ── Preferences ── */}
      <SectionHeader title="Preferences" />
      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="gearshape.fill"
          iconColor="#666"
          label="Notifications"
          onPress={() => {}}
        />
        <SettingsRow
          icon="gearshape.fill"
          iconColor="#666"
          label="Privacy & sharing"
          onPress={() => {}}
        />
        <SettingsRow
          icon="info.circle.fill"
          iconColor="#666"
          label="Accessibility"
          onPress={() => {}}
        />
      </View>

      {/* ── Support ── */}
      <SectionHeader title="Support" />
      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="questionmark.circle.fill"
          iconColor="#666"
          label="Help Center"
          onPress={() => {}}
        />
        <SettingsRow
          icon="info.circle.fill"
          iconColor="#666"
          label="Terms of Service"
          onPress={() => {}}
        />
        <SettingsRow
          icon="info.circle.fill"
          iconColor="#666"
          label="Privacy Policy"
          onPress={() => {}}
        />
      </View>

      {/* ── Sign out ── */}
      <SectionHeader title="Account actions" />
      <View style={[styles.group, { borderColor: colors.border }]}>
        <SettingsRow
          icon="person"
          label="Sign out"
          destructive
          hideChevron
          onPress={handleLogout}
        />
      </View>

      <Text style={[styles.version, { color: colors.textSecondary }]}>
        Airbnb Clone · v1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pageTitle: {
    fontSize: 32,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    gap: 14,
  },
  avatarWrap: { position: "relative" },
  avatar: { width: 68, height: 68, borderRadius: 34 },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FF385C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  heroInfo: { flex: 1 },
  heroName: { fontSize: 17, fontWeight: "700", marginBottom: 2 },
  heroEmail: { fontSize: 13, marginBottom: 4 },
  heroBio: { fontSize: 12, lineHeight: 17 },
  heroAddBio: { fontSize: 13, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statNumber: { fontSize: 20, fontWeight: "700" },
  statLabel: { fontSize: 11, marginTop: 2 },
  statDivider: { width: 1 },
  joinedText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  group: {
    marginHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 24,
  },
});
