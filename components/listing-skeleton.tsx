import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

function SkeletonBox({ width, height, borderRadius = 8, style }: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      true
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: isDark ? "#2A2A2A" : "#E8E8E8",
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function ListingCardSkeleton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={[styles.card, { backgroundColor: colors.background }]}>
      {/* Image */}
      <SkeletonBox width="100%" height={220} borderRadius={12} />

      {/* Content */}
      <View style={styles.content}>
        <SkeletonBox width="60%" height={14} style={{ marginBottom: 8 }} />
        <SkeletonBox width="85%" height={14} style={{ marginBottom: 12 }} />
        <View style={styles.row}>
          <SkeletonBox width={80} height={12} />
          <SkeletonBox width={60} height={12} />
        </View>
      </View>
    </View>
  );
}

export function ListingSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  content: { padding: 12 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
