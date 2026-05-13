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

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [location, setLocation] = useState(user?.location ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? "");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
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

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }
    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        bio: bio.trim(),
        avatar: avatar || undefined,
      });
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Edit Profile
        </Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          style={styles.headerBtn}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FF385C" />
          ) : (
            <Text style={styles.saveText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
            <Image
              source={{
                uri: avatar || "https://i.pravatar.cc/150?img=12",
              }}
              style={styles.avatar}
            />
            <View style={styles.avatarOverlay}>
              <IconSymbol name="pencil" size={18} color="white" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text style={styles.changePhotoText}>Change photo</Text>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Full name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Email</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Phone number</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
          />
        </View>

        {/* Location */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Location</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={location}
            onChangeText={setLocation}
            placeholder="City, Country"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        {/* Bio */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
          <TextInput
            style={[
              styles.input,
              styles.bioInput,
              { color: colors.text, borderColor: colors.border },
            ]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={200}
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {bio.length}/200
          </Text>
        </View>
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
  headerBtn: { width: 60, alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  saveText: { color: "#FF385C", fontSize: 16, fontWeight: "600" },
  content: { paddingHorizontal: 16, paddingVertical: 24 },
  avatarSection: { alignItems: "center", marginBottom: 32 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF385C",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  changePhotoText: {
    color: "#FF385C",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
  },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },
  bioInput: { minHeight: 100, paddingTop: 12 },
  charCount: { fontSize: 11, textAlign: "right", marginTop: 4 },
});
