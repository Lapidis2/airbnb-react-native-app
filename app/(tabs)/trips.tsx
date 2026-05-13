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
import { useSafeAreaInsets } from "react-native-safe-area-context";

const upcomingReservations = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    status: "Pending",
    title: "Yonkers",
    subtitle: "Private room in home hosted by Craig",
    checkIn: { month: "Feb", days: "13 - 14", year: "2023" },
    location: "Yonkers, New York\nUnited States",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
    status: "Confirmed",
    title: "Manhattan",
    subtitle: "Luxury Apartment hosted by Sarah",
    checkIn: { month: "Mar", days: "5 - 10", year: "2023" },
    location: "Manhattan, New York\nUnited States",
  },
];

const nearbyExperiences = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=300&h=300&fit=crop",
    title: "Yonkers",
    count: "18 experiences",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=300&h=300&fit=crop",
    title: "New York",
    count: "124 experiences",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=300&h=300&fit=crop",
    title: "Brooklyn",
    count: "56 experiences",
  },
];

const STATUS_COLORS: Record<string, string> = {
  Pending: "#F59E0B",
  Confirmed: "#10B981",
  Cancelled: "#EF4444",
};

export default function TripsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.text }]}>Trips</Text>

      {/* Upcoming Reservations */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Upcoming reservations
      </Text>

      {upcomingReservations.map((res) => (
        <TouchableOpacity
          key={res.id}
          activeOpacity={0.92}
          style={[styles.card, { backgroundColor: colors.background }]}
        >
          {/* Image */}
          <View style={styles.cardImageWrap}>
            <Image source={{ uri: res.image }} style={styles.cardImage} />
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLORS[res.status] ?? "#999" },
              ]}
            >
              <Text style={styles.statusText}>{res.status}</Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {res.title}
            </Text>
            <Text
              style={[styles.cardSubtitle, { color: colors.textSecondary }]}
            >
              {res.subtitle}
            </Text>
          </View>

          {/* Divider + Details */}
          <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
          <View style={styles.cardFooter}>
            <View style={styles.footerLeft}>
              <Text style={[styles.footerMonth, { color: colors.textSecondary }]}>
                {res.checkIn.month}
              </Text>
              <Text style={[styles.footerDays, { color: colors.text }]}>
                {res.checkIn.days}
              </Text>
              <Text style={[styles.footerYear, { color: colors.textSecondary }]}>
                {res.checkIn.year}
              </Text>
            </View>
            <View style={[styles.footerDividerV, { backgroundColor: colors.border }]} />
            <View style={styles.footerRight}>
              <Text style={[styles.footerLocation, { color: colors.text }]}>
                {res.location}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Explore Nearby */}
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 28 }]}>
        Explore things to do near Yonkers
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.experienceRow}
      >
        {nearbyExperiences.map((exp) => (
          <TouchableOpacity key={exp.id} style={styles.expCard} activeOpacity={0.85}>
            <Image source={{ uri: exp.image }} style={styles.expImage} />
            <Text style={[styles.expTitle, { color: colors.text }]}>{exp.title}</Text>
            <Text style={[styles.expCount, { color: colors.textSecondary }]}>
              {exp.count}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImageWrap: { width: "100%", height: 200, position: "relative" },
  cardImage: { width: "100%", height: "100%" },
  statusBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: { color: "white", fontSize: 12, fontWeight: "700" },
  cardBody: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  cardSubtitle: { fontSize: 13 },
  cardDivider: { height: 1, marginHorizontal: 16 },
  cardFooter: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  footerLeft: { alignItems: "flex-start", minWidth: 70 },
  footerMonth: { fontSize: 12, fontWeight: "500" },
  footerDays: { fontSize: 18, fontWeight: "700" },
  footerYear: { fontSize: 12 },
  footerDividerV: { width: 1, height: 40, marginHorizontal: 16 },
  footerRight: { flex: 1 },
  footerLocation: { fontSize: 13, fontWeight: "500", lineHeight: 20 },
  experienceRow: { paddingHorizontal: 16, gap: 12 },
  expCard: { width: 130 },
  expImage: { width: 130, height: 130, borderRadius: 14, marginBottom: 8 },
  expTitle: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  expCount: { fontSize: 12 },
});
