import { useAuth } from "@/context/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const { resetPassword } = useAuth();
  const insets = useSafeAreaInsets();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const strength =
    password.length === 0 ? null
    : password.length < 6 ? "weak"
    : password.length < 10 ? "fair"
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? "strong"
    : "good";

  const strengthColor = { weak: "#EF4444", fair: "#F59E0B", good: "#3B82F6", strong: "#10B981" }[strength ?? "weak"];
  const strengthWidth = { weak: "25%", fair: "50%", good: "75%", strong: "100%" }[strength ?? "weak"];

  const handleSubmit = async () => {
    setError("");
    if (!password || !confirm) { setError("Please fill in all fields"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (!token) { setError("Invalid or missing reset token"); return; }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (e: any) {
      // detect expired/invalid token errors
      const msg: string = e.message ?? "";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("expired") ||
        msg.toLowerCase().includes("not found")
      ) {
        setTokenInvalid(true);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (tokenInvalid) {
    return (
      <View style={[styles.flex, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.expiredIcon}>🔗</Text>
        <Text style={styles.expiredTitle}>Link expired</Text>
        <Text style={styles.expiredBody}>
          This reset link is invalid or has expired. Reset links are only valid for a limited time.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => router.replace("/forgot-password")}
        >
          <Text style={styles.primaryBtnText}>Request new link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.secondaryBtnText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (done) {
    return (
      <View style={[styles.flex, styles.center, { paddingTop: insets.top }]}>
        <Text style={styles.successIcon}>✅</Text>
        <Text style={styles.successTitle}>Password reset!</Text>
        <Text style={styles.successBody}>
          Your password has been updated. You can now log in with your new password.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace("/login")}>
          <Text style={styles.primaryBtnText}>Go to login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>airbnb</Text>
        <Text style={styles.heading}>Reset your password</Text>
        <Text style={styles.subheading}>Choose a strong new password for your account.</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* New password */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>New password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, { paddingRight: 70 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.showBtn} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showBtnText}>{showPassword ? "Hide" : "Show"}</Text>
            </TouchableOpacity>
          </View>
          {/* Strength meter */}
          {strength && (
            <View style={styles.strengthWrap}>
              <View style={[styles.strengthTrack, { backgroundColor: "#E8E8E8" }]}>
                <View style={[styles.strengthFill, { width: strengthWidth as any, backgroundColor: strengthColor }]} />
              </View>
              <Text style={[styles.strengthLabel, { color: strengthColor }]}>
                {strength.charAt(0).toUpperCase() + strength.slice(1)} password
              </Text>
            </View>
          )}
        </View>

        {/* Confirm password */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Confirm new password</Text>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter your password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          {confirm.length > 0 && (
            <View style={styles.matchRow}>
              <View style={[styles.matchDot, { backgroundColor: password === confirm ? "#10B981" : "#EF4444" }]} />
              <Text style={[styles.matchText, { color: password === confirm ? "#10B981" : "#EF4444" }]}>
                {password === confirm ? "Passwords match" : "Passwords do not match"}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.disabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={styles.primaryBtnText}>Reset password</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  center: { justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  container: { flex: 1, paddingHorizontal: 24 },
  logo: { fontSize: 32, fontWeight: "800", color: "#FF385C", letterSpacing: -1, marginBottom: 28 },
  heading: { fontSize: 26, fontWeight: "700", color: "#222", marginBottom: 8 },
  subheading: { fontSize: 15, color: "#666", lineHeight: 22, marginBottom: 28 },
  errorBox: {
    backgroundColor: "#FFF0F0", borderWidth: 1, borderColor: "#FFCCCC",
    borderRadius: 10, padding: 12, marginBottom: 16,
  },
  errorText: { color: "#CC0000", fontSize: 13 },
  fieldWrap: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: "600", color: "#222", marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: "#E8E8E8", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15,
    color: "#222", backgroundColor: "#FAFAFA",
  },
  passwordRow: { position: "relative" },
  showBtn: { position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" },
  showBtnText: { fontSize: 13, fontWeight: "600", color: "#FF385C" },
  strengthWrap: { marginTop: 8 },
  strengthTrack: { height: 4, borderRadius: 2, overflow: "hidden", marginBottom: 4 },
  strengthFill: { height: "100%", borderRadius: 2 },
  strengthLabel: { fontSize: 12, fontWeight: "600" },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  matchDot: { width: 8, height: 8, borderRadius: 4 },
  matchText: { fontSize: 12, fontWeight: "500" },
  primaryBtn: {
    backgroundColor: "#FF385C", borderRadius: 10,
    paddingVertical: 15, alignItems: "center",
  },
  disabled: { opacity: 0.7 },
  primaryBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  successIcon: { fontSize: 52, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: "700", color: "#222", marginBottom: 10 },
  successBody: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22, marginBottom: 28 },
  expiredIcon: { fontSize: 52, marginBottom: 16 },
  expiredTitle: { fontSize: 24, fontWeight: "700", color: "#222", marginBottom: 10 },
  expiredBody: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22, marginBottom: 28 },
  secondaryBtn: { marginTop: 12, paddingVertical: 12 },
  secondaryBtnText: { fontSize: 15, color: "#FF385C", fontWeight: "600", textDecorationLine: "underline" },
});
