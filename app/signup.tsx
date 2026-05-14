import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/context/auth";
import { useRouter } from "expo-router";
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

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        username: username.trim(),
        phone: phone.trim(),
        password,
        role: "GUEST",
      });
      router.replace("/login");
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
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.logo}>airbnb</Text>
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.subheading}>
          Join millions of hosts and guests worldwide
        </Text>

        <View style={styles.divider} />

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Full name */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            placeholderTextColor="#999"
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Username */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Phone */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
        </View>

        {/* Password */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.showBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showBtnText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm password */}
        <View style={styles.fieldWrap}>
          <Text style={styles.label}>Confirm password</Text>
          <TextInput
            style={styles.input}
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter your password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.terms}>
          By signing up, you agree to our{" "}
          <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
          <Text style={styles.termsLink}>Privacy Policy</Text>.
        </Text>

        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.primaryBtnText}>Create account</Text>
          )}
        </TouchableOpacity>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        <TouchableOpacity style={styles.socialBtn}>
          <FontAwesome name="apple" size={20} color="#000" style={styles.socialIcon} />
          <Text style={styles.socialBtnText}>Continue with Apple</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <AntDesign name="google" size={18} color="#DB4437" style={styles.socialIcon} />
          <Text style={styles.socialBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.loginLink}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#fff" },
  container: { paddingHorizontal: 24 },
  logo: { fontSize: 32, fontWeight: "800", color: "#FF385C", letterSpacing: -1, marginBottom: 32 },
  heading: { fontSize: 26, fontWeight: "700", color: "#222", marginBottom: 6 },
  subheading: { fontSize: 15, color: "#666", marginBottom: 24 },
  divider: { height: 1, backgroundColor: "#E8E8E8", marginBottom: 24 },
  errorBox: {
    backgroundColor: "#FFF0F0",
    borderWidth: 1,
    borderColor: "#FFCCCC",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#CC0000", fontSize: 13 },
  fieldWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#222", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
    color: "#222",
    backgroundColor: "#FAFAFA",
  },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 70 },
  showBtn: { position: "absolute", right: 14, top: 0, bottom: 0, justifyContent: "center" },
  showBtnText: { fontSize: 13, fontWeight: "600", color: "#FF385C" },
  terms: { fontSize: 12, color: "#888", lineHeight: 18, marginBottom: 20 },
  termsLink: { color: "#FF385C", fontWeight: "600", textDecorationLine: "underline" },
  primaryBtn: {
    backgroundColor: "#FF385C",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 20,
  },
  primaryBtnDisabled: { opacity: 0.7 },
  primaryBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
  orRow: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 10 },
  orLine: { flex: 1, height: 1, backgroundColor: "#E8E8E8" },
  orText: { fontSize: 13, color: "#999" },
  socialBtn: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
  },
  socialBtnText: { fontSize: 15, fontWeight: "500", color: "#222" },
  socialIcon: { position: "absolute", left: 20 },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 12 },
  loginPrompt: { fontSize: 14, color: "#666" },
  loginLink: { fontSize: 14, fontWeight: "700", color: "#FF385C", textDecorationLine: "underline" },
});
