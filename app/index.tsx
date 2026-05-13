import { useAuth } from "@/context/auth";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.7);
  const taglineOpacity = useSharedValue(0);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
  }));

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 700 });
    logoScale.value = withTiming(1, { duration: 700 });
    taglineOpacity.value = withDelay(500, withTiming(1, { duration: 600 }));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => {
      if (user) {
        router.replace("/(tabs)/explore");
      } else {
        router.replace("/login");
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [isLoading, user]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoWrap, logoStyle]}>
        {/* Airbnb-style logo mark */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>airbnb</Text>
        </View>
      </Animated.View>
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Belong anywhere
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF385C",
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrap: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoCircle: {
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 28,
    paddingVertical: 16,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "800",
    color: "#FF385C",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "400",
    letterSpacing: 0.5,
  },
});
