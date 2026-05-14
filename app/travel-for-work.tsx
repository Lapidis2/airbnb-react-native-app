import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TravelForWorkScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [enabled, setEnabled] = useState(false);
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [workEmail, setWorkEmail] = useState("");

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Travel for work</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Toggle */}
        <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
          <View style={{ flex: 1, marginRight: 16 }}>
            <Text style={[styles.toggleLabel, { color: colors.text }]}>
              I travel for work
            </Text>
            <Text style={[styles.toggleDesc, { color: colors.textSecondary }]}>
              Unlock business travel features and expense reporting
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: colors.border, true: "#FF385C" }}
            thumbColor="white"
          />
        </View>

        {enabled && (
          <>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              COMPANY DETAILS
            </Text>
            <View style={[styles.group, { borderColor: colors.border }]}>
              {[
                { label: "Company name", value: company, onChange: setCompany, placeholder: "Enter company name" },
                { label: "Job title", value: jobTitle, onChange: setJobTitle, placeholder: "Enter your job title" },
                { label: "Work email", value: workEmail, onChange: setWorkEmail, placeholder: "Enter work email", keyboard: "email-address" },
              ].map((f, i) => (
                <View key={i} style={[styles.field, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
                    {f.label.toUpperCase()}
                  </Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text }]}
                    value={f.value}
                    onChangeText={f.onChange}
                    placeholder={f.placeholder}
                    placeholderTextColor={colors.textSecondary}
                    keyboardType={(f as any).keyboard ?? "default"}
                    autoCapitalize={(f as any).keyboard ? "none" : "words"}
                  />
                </View>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              BENEFITS
            </Text>
            <View style={[styles.group, { borderColor: colors.border }]}>
              {[
                { title: "Expense reporting", desc: "Easily export receipts for reimbursement" },
                { title: "Business-friendly filters", desc: "Find properties with desks, WiFi and more" },
                { title: "Centralized billing", desc: "Pay with a company card or invoice" },
              ].map((b, i) => (
                <View key={i} style={[styles.benefitRow, { borderBottomColor: colors.border }]}>
                  <View style={[styles.benefitDot, { backgroundColor: "#FF385C" }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.benefitTitle, { color: colors.text }]}>{b.title}</Text>
                    <Text style={[styles.benefitDesc, { color: colors.textSecondary }]}>{b.desc}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {!enabled && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Unlock business travel
            </Text>
            <Text style={[styles.emptyDesc, { color: colors.textSecondary }]}>
              Turn on travel for work to access expense reporting, business-friendly filters, and centralized billing.
            </Text>
          </View>
        )}
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
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  toggleLabel: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  toggleDesc: { fontSize: 13, lineHeight: 18 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  group: { borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 4 },
  field: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  fieldLabel: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, marginBottom: 4 },
  fieldInput: { fontSize: 15, paddingVertical: 0 },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    gap: 12,
  },
  benefitDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  benefitTitle: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  benefitDesc: { fontSize: 13, lineHeight: 18 },
  emptyState: {
    padding: 32,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, textAlign: "center" },
  emptyDesc: { fontSize: 14, lineHeight: 20, textAlign: "center" },
});
