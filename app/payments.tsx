import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function Row({ label, value, onPress, colors }: any) {
  return (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
        {value && <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{value}</Text>}
      </View>
      <IconSymbol name="chevron.right" size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

export default function PaymentsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 8, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Payments & payouts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PAYMENTS</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <Row label="Payment methods" value="Add a payment method" onPress={() => {}} colors={colors} />
          <Row label="Coupons & credits" value="No active coupons" onPress={() => {}} colors={colors} />
          <Row label="Payment history" onPress={() => {}} colors={colors} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>PAYOUTS</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <Row label="Payout methods" value="Add a payout method" onPress={() => {}} colors={colors} />
          <Row label="Payout preferences" onPress={() => {}} colors={colors} />
          <Row label="Tax information" onPress={() => {}} colors={colors} />
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CURRENCY</Text>
        <View style={[styles.group, { borderColor: colors.border }]}>
          <Row label="Currency" value="USD – US Dollar" onPress={() => {}} colors={colors} />
        </View>
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
  },
  group: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  rowLabel: { fontSize: 15, fontWeight: "500", marginBottom: 2 },
  rowValue: { fontSize: 13 },
});
