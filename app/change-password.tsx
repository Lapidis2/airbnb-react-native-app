import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/context/auth";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  colors: any;
}) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!show}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeBtn}
          onPress={() => setShow(!show)}
        >
          <Text style={styles.eyeText}>{show ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { changePassword } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = next.length === 0 ? null
    : next.length < 6 ? "weak"
    : next.length < 10 ? "fair"
    : /[A-Z]/.test(next) && /[0-9]/.test(next) ? "strong"
    : "good";

  const strengthColor = { weak: "#EF4444", fair: "#F59E0B", good: "#3B82F6", strong: "#10B981" }[strength ?? "weak"];
  const strengthWidth = { weak: "25%", fair: "50%", good: "75%", strong: "100%" }[strength ?? "weak"];

  const handleSave = async () => {
    if (!current || !next || !confirm) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (next !== confirm) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }
    if (next.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await changePassword(current, next);
      Alert.alert("Success", "Password changed successfully", [
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
          Change Password
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
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <IconSymbol name="info.circle.fill" size={18} color="#3B82F6" />
          <Text style={styles.infoText}>
            Use at least 8 characters with a mix of letters, numbers and symbols for a strong password.
          </Text>
        </View>

        <PasswordField
          label="Current password"
          value={current}
          onChange={setCurrent}
          placeholder="Enter current password"
          colors={colors}
        />

        <PasswordField
          label="New password"
          value={next}
          onChange={setNext}
          placeholder="Enter new password"
          colors={colors}
        />

        {/* Strength meter */}
        {strength && (
          <View style={styles.strengthWrap}>
            <View style={[styles.strengthTrack, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.strengthFill,
                  { width: strengthWidth as any, backgroundColor: strengthColor },
                ]}
              />
            </View>
            <Text style={[styles.strengthLabel, { color: strengthColor }]}>
              {strength.charAt(0).toUpperCase() + strength.slice(1)} password
            </Text>
          </View>
        )}

        <PasswordField
          label="Confirm new password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Re-enter new password"
          colors={colors}
        />

        {/* Match indicator */}
        {confirm.length > 0 && (
          <View style={styles.matchRow}>
            <View
              style={[
                styles.matchDot,
                { backgroundColor: next === confirm ? "#10B981" : "#EF4444" },
              ]}
            />
            <Text
              style={[
                styles.matchText,
                { color: next === confirm ? "#10B981" : "#EF4444" },
              ]}
            >
              {next === confirm ? "Passwords match" : "Passwords do not match"}
            </Text>
          </View>
        )}

        {/* Requirements */}
        <View style={[styles.requirementsBox, { borderColor: colors.border }]}>
          <Text style={[styles.requirementsTitle, { color: colors.text }]}>
            Password requirements
          </Text>
          {[
            { label: "At least 6 characters", met: next.length >= 6 },
            { label: "At least one uppercase letter", met: /[A-Z]/.test(next) },
            { label: "At least one number", met: /[0-9]/.test(next) },
          ].map((req, i) => (
            <View key={i} style={styles.reqRow}>
              <View
                style={[
                  styles.reqDot,
                  { backgroundColor: req.met ? "#10B981" : colors.border },
                ]}
              />
              <Text
                style={[
                  styles.reqText,
                  { color: req.met ? "#10B981" : colors.textSecondary },
                ]}
              >
                {req.label}
              </Text>
            </View>
          ))}
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
  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 24,
  },
  infoText: { flex: 1, fontSize: 13, color: "#1D4ED8", lineHeight: 18 },
  field: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", marginBottom: 8 },
  inputRow: { position: "relative" },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    paddingRight: 70,
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeText: { color: "#FF385C", fontSize: 13, fontWeight: "600" },
  strengthWrap: { marginTop: -12, marginBottom: 20 },
  strengthTrack: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 6,
  },
  strengthFill: { height: "100%", borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: "600" },
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: -12,
    marginBottom: 20,
  },
  matchDot: { width: 8, height: 8, borderRadius: 4 },
  matchText: { fontSize: 12, fontWeight: "500" },
  requirementsBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  requirementsTitle: { fontSize: 13, fontWeight: "700", marginBottom: 10 },
  reqRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  reqDot: { width: 8, height: 8, borderRadius: 4 },
  reqText: { fontSize: 13 },
});
