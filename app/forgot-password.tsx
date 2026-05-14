import { useAuth } from "@/context/auth";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    if (!email.trim()) { setError("Please enter your email"); return; }
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>

        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>airbnb</Text>
        <Text style={styles.heading}>Forgot password?</Text>
        <Text style={styles.subheading}>
          Enter the email address linked to your account and we will send you a reset link.
        </Text>

        {sent ? (
          /* ── Success state ── */
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>📬</Text>
            <Text style={styles.successTitle}>Check your inbox</Text>
            <Text style={styles.successBody}>
              If <Text style={{ fontWeight: "700" }}>{email}</Text> is linked to an account, you will receive a reset link shortly.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace("/login")}>
              <Text style={styles.primaryBtnText}>Back to login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resendBtn} onPress={handleSubmit} disabled={loading}>
              <Text style={styles.resendText}>
                {loading ? "Sending..." : "Resend email"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Form state ── */
          <>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.disabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color="white" />
                : <Text style={styles.primaryBtnText}>Send reset link</Text>}
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginPrompt}>Remember your password? </Text>
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={styles.loginLink}>Log in</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 24 },
  backBtn: { marginBottom: 24 },
  backText: { fontSize: 15, color: "#666" },
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
  primaryBtn: {
    backgroundColor: "#FF385C", borderRadius: 10,
    paddingVertical: 15, alignItems: "center", marginBottom: 16,
  },
  disabled: { opacity: 0.7 },
  primaryBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  loginPrompt: { fontSize: 14, color: "#666" },
  loginLink: { fontSize: 14, fontWeight: "700", color: "#FF385C", textDecorationLine: "underline" },
  successBox: { alignItems: "center", paddingTop: 16 },
  successIcon: { fontSize: 48, marginBottom: 16 },
  successTitle: { fontSize: 22, fontWeight: "700", color: "#222", marginBottom: 10 },
  successBody: { fontSize: 15, color: "#666", textAlign: "center", lineHeight: 22, marginBottom: 28 },
  resendBtn: { marginTop: 8 },
  resendText: { fontSize: 14, color: "#FF385C", fontWeight: "600", textDecorationLine: "underline" },
});
