import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Field({ label, value, onChange, placeholder, keyboardType, multiline, maxLength, colors, autoCapitalize }: any) {
  return (
    <View style={[fieldStyles.wrap, { borderBottomColor: colors.border }]}>
      <Text style={[fieldStyles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize ?? "sentences"}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {maxLength && (
        <Text style={[fieldStyles.count, { color: colors.textSecondary }]}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1 },
  label: { fontSize: 12, fontWeight: "600", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { fontSize: 15, paddingVertical: 0 },
  count: { fontSize: 11, textAlign: "right", marginTop: 4 },
});

export default function PersonalInformationScreen() {
  const router = useRouter();
  const { user, updateProfile, uploadAvatar } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [location, setLocation] = useState(user?.location ?? "");

  // separate loading states so avatar upload and profile save are independent
  const [saving, setSaving] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  // local preview URI — shows immediately after picking before upload finishes
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const currentAvatar = avatarPreview ?? user?.avatar ?? null;

  const pickAndUploadAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photos");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const uri = result.assets[0].uri;
    setAvatarPreview(uri); // show preview immediately
    setAvatarLoading(true);

    try {
      await uploadAvatar(uri);
      // after upload, user.avatar is updated in context with the Cloudinary URL
      setAvatarPreview(null); // clear preview — context now has the real URL
    } catch (e: any) {
      setAvatarPreview(null); // revert preview on failure
      Alert.alert("Upload failed", e.message);
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        bio: bio.trim(),
        location: location.trim(),
      });
      Alert.alert("Saved", "Your profile has been updated", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerSide}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Personal information</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.headerSide}>
          {saving
            ? <ActivityIndicator size="small" color="#FF385C" />
            : <Text style={styles.saveBtn}>Save</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Avatar */}
        <TouchableOpacity
          style={styles.avatarSection}
          onPress={pickAndUploadAvatar}
          activeOpacity={0.8}
          disabled={avatarLoading}
        >
          <View style={styles.avatarWrap}>
            <Image
              source={{
                uri: currentAvatar ?? "https://i.pravatar.cc/150?img=12",
              }}
              style={styles.avatar}
            />
            {/* overlay while uploading */}
            {avatarLoading && (
              <View style={styles.avatarOverlay}>
                <ActivityIndicator color="white" />
              </View>
            )}
            {/* edit badge */}
            {!avatarLoading && (
              <View style={styles.avatarBadge}>
                <IconSymbol name="pencil" size={13} color="white" />
              </View>
            )}
          </View>
          <Text style={[styles.changePhoto, { opacity: avatarLoading ? 0.4 : 1 }]}>
            {avatarLoading ? "Uploading..." : "Change photo"}
          </Text>
        </TouchableOpacity>

        {/* Read-only info banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.border + "40" }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Email and username cannot be changed here. Contact support if needed.
          </Text>
        </View>

        {/* Read-only fields */}
        <Text style={[styles.groupLabel, { color: colors.textSecondary, borderBottomColor: colors.border }]}>
          ACCOUNT
        </Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <View style={[fieldStyles.wrap, { borderBottomColor: colors.border }]}>
            <Text style={[fieldStyles.label, { color: colors.textSecondary }]}>EMAIL</Text>
            <Text style={[fieldStyles.input, { color: colors.textSecondary }]}>{user?.email}</Text>
          </View>
          <View style={[fieldStyles.wrap, { borderBottomColor: colors.border }]}>
            <Text style={[fieldStyles.label, { color: colors.textSecondary }]}>USERNAME</Text>
            <Text style={[fieldStyles.input, { color: colors.textSecondary }]}>@{user?.username}</Text>
          </View>
        </View>

        {/* Editable fields */}
        <Text style={[styles.groupLabel, { color: colors.textSecondary, borderBottomColor: colors.border }]}>
          BASIC INFO
        </Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <Field label="Legal name" value={name} onChange={setName} placeholder="Your full name" colors={colors} autoCapitalize="words" />
          <Field label="Phone number" value={phone} onChange={setPhone} placeholder="Add a phone number" keyboardType="phone-pad" colors={colors} autoCapitalize="none" />
          <Field label="Location" value={location} onChange={setLocation} placeholder="City, Country" colors={colors} />
        </View>

        <Text style={[styles.groupLabel, { color: colors.textSecondary, borderBottomColor: colors.border }]}>
          ABOUT YOU
        </Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <Field label="Bio" value={bio} onChange={setBio} placeholder="Tell guests about yourself..." multiline maxLength={200} colors={colors} />
        </View>

        {/* Security */}
        <Text style={[styles.groupLabel, { color: colors.textSecondary, borderBottomColor: colors.border }]}>
          SECURITY
        </Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.passwordRow, { borderBottomColor: colors.border }]}
            onPress={() => router.push("/change-password")}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.passwordLabel, { color: colors.textSecondary }]}>PASSWORD</Text>
              <Text style={[styles.passwordValue, { color: colors.text }]}>••••••••</Text>
            </View>
            <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {user?.joinedDate && (
          <Text style={[styles.joined, { color: colors.textSecondary }]}>
            Member since {user.joinedDate}
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerSide: { width: 60, alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  saveBtn: { color: "#FF385C", fontSize: 16, fontWeight: "600" },
  avatarSection: { alignItems: "center", paddingVertical: 28 },
  avatarWrap: { position: "relative" },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 48,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF385C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  changePhoto: { color: "#FF385C", fontSize: 14, fontWeight: "600", marginTop: 10 },
  infoBanner: {
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 10,
    padding: 12,
  },
  infoText: { fontSize: 12, lineHeight: 17 },
  groupLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  group: { borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 24 },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  passwordLabel: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 4 },
  passwordValue: { fontSize: 15 },
  joined: { textAlign: "center", fontSize: 12, marginBottom: 32 },
});
