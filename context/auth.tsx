import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = "https://airbnb-api-c4yx.onrender.com/api/v1";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  username: string;
  phone: string;
  role: "GUEST" | "HOST";
  avatar?: string | null;
  bio?: string | null;
  location?: string;
  joinedDate?: string;
}

export interface SignupData {
  name: string;
  email: string;
  username: string;
  phone: string;
  password: string;
  role?: "GUEST" | "HOST";
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  uploadAvatar: (imageUri: string) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

async function apiFetch(
  path: string,
  options: RequestInit = {},
  token?: string | null,
) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    const msg =
      json.errors?.[0]?.message ?? json.message ?? "Something went wrong";
    throw new Error(msg);
  }
  return json;
}

function mapUser(apiUser: any): AuthUser {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    username: apiUser.username,
    phone: apiUser.phone,
    role: apiUser.role,
    avatar: apiUser.avatar ?? null,
    bio: apiUser.bio ?? null,
    joinedDate: new Date(apiUser.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem("auth_user"),
      AsyncStorage.getItem("auth_token"),
    ])
      .then(([storedUser, storedToken]) => {
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const persistUser = async (u: AuthUser) => {
    await AsyncStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
  };

  const persistSession = async (u: AuthUser, t: string) => {
    await AsyncStorage.setItem("auth_user", JSON.stringify(u));
    await AsyncStorage.setItem("auth_token", t);
    setUser(u);
    setToken(t);
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Please fill in all fields");
    const json = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    await persistSession(mapUser(json.user), json.token);
  };

  const signup = async (data: SignupData) => {
    if (
      !data.name ||
      !data.email ||
      !data.username ||
      !data.phone ||
      !data.password
    )
      throw new Error("Please fill in all fields");
    if (data.password.length < 6)
      throw new Error("Password must be at least 6 characters");

    await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ ...data, role: data.role ?? "GUEST" }),
    });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["auth_user", "auth_token"]);
    setUser(null);
    setToken(null);
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user || !token) throw new Error("Not logged in");
    const body: Record<string, any> = {};
    if (updates.name !== undefined) body.name = updates.name;
    if (updates.phone !== undefined) body.phone = updates.phone;
    if (updates.bio !== undefined) body.bio = updates.bio;
    const json = await apiFetch(
      `/users/${user.id}`,
      { method: "PUT", body: JSON.stringify(body) },
      token,
    );
    const updated: AuthUser = {
      ...user,
      ...mapUser(json.data),
      location: updates.location ?? user.location,
    };
    await persistUser(updated);
  };

  const uploadAvatar = async (imageUri: string) => {
    if (!user || !token) throw new Error("Not logged in");

    const formData = new FormData();
    const filename = imageUri.split("/").pop() ?? "avatar.jpg";
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    const mimeType =
      ext === "png"
        ? "image/png"
        : ext === "webp"
          ? "image/webp"
          : "image/jpeg";
    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: mimeType,
    } as any);

    try {
      const res = await fetch(`${BASE_URL}/users/${user.id}/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success !== false) {
        // Backend returned Cloudinary URL — use it
        const updated: AuthUser = { ...user, ...mapUser(json.data) };
        await persistUser(updated);
        return;
      }
    } catch {}

    const updated: AuthUser = { ...user, avatar: imageUri };
    await persistUser(updated);
  };

  const changePassword = async (current: string, next: string) => {
    if (!token) throw new Error("Not logged in");
    if (next.length < 6)
      throw new Error("New password must be at least 6 characters");
    await apiFetch(
      "/auth/change-password",
      {
        method: "POST",
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      },
      token,
    );
  };

  const forgotPassword = async (email: string) => {
    if (!email) throw new Error("Please enter your email");
    await apiFetch("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  const resetPassword = async (token: string, password: string) => {
    if (!password || password.length < 6)
      throw new Error("Password must be at least 6 characters");
    await apiFetch(`/auth/reset-password/${token}`, {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        uploadAvatar,
        forgotPassword,
        resetPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
