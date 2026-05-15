import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Linking } from "react-native";
import "react-native-reanimated";

import { AuthProvider } from "@/context/auth";
import { WishlistProvider } from "@/context/wishlist";
import { useColorScheme } from "@/hooks/use-color-scheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
});


fetch("https://airbnb-api-c4yx.onrender.com/api/v1/listings").catch(() => {});

function DeepLinkHandler() {
  const router = useRouter();
  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => handleUrl(url, router));
    Linking.getInitialURL().then((url) => { if (url) handleUrl(url, router); });
    return () => sub.remove();
  }, []);
  return null;
}

function handleUrl(url: string, router: ReturnType<typeof useRouter>) {
  const match = url.match(/reset-password\?token=([^&]+)/);
  if (match?.[1]) {
    router.push({ pathname: "/reset-password", params: { token: match[1] } });
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <DeepLinkHandler />
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="wishlist-listings" options={{ headerShown: false }} />
              <Stack.Screen name="wishlist-map" options={{ headerShown: false }} />
              <Stack.Screen name="listing-detail" options={{ headerShown: false }} />
              <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
              <Stack.Screen name="change-password" options={{ headerShown: false }} />
              <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
              <Stack.Screen name="reset-password" options={{ headerShown: false }} />
              <Stack.Screen name="personal-information" options={{ headerShown: false }} />
              <Stack.Screen name="payments" options={{ headerShown: false }} />
              <Stack.Screen name="notifications-settings" options={{ headerShown: false }} />
              <Stack.Screen name="privacy-sharing" options={{ headerShown: false }} />
              <Stack.Screen name="travel-for-work" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
