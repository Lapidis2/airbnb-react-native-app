import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const menuItems = [
  { id: "1", icon: "person", label: "Edit Profile", color: "#FF385C" },
  { id: "2", icon: "heart.fill", label: "Saved Listings", color: "#FF385C" },
  { id: "3", icon: "gearshape.fill", label: "Settings", color: "#666666" },
  {
    id: "4",
    icon: "questionmark.circle.fill",
    label: "Help",
    color: "#666666",
  },
  { id: "5", icon: "info.circle.fill", label: "About", color: "#666666" },
];

const MenuItem = ({
  icon,
  label,
  color,
  colors,
}: {
  icon: string;
  label: string;
  color: string;
  colors: any;
}) => (
  <TouchableOpacity
    style={[styles.menuItem, { borderBottomColor: colors.border }]}
  >
    <View style={styles.menuItemLeft}>
      <IconSymbol name={icon as any} size={24} color={color} />
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
    </View>
    <IconSymbol name="chevron.right" size={20} color={colors.textSecondary} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={[styles.header, { color: colors.text }]}>Profile</Text>

      {/* User Card */}
      <View
        style={[
          styles.userCard,
          { backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=5",
          }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            Jane Doe
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            jane.doe@email.com
          </Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <IconSymbol name="pencil" size={18} color="#FF385C" />
        </TouchableOpacity>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            color={item.color}
            colors={colors}
          />
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: "#FF385C" }]}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
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
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
  },
  editButton: {
    padding: 8,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#FF385C",
    fontSize: 16,
    fontWeight: "600",
  },
});
