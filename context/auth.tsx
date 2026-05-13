import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  location?: string;
  joinedDate?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Store hashed password separately (plain string for demo — swap with bcrypt on real backend)
  const [storedPassword, setStoredPassword] = useState<string>("");

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem("auth_user"),
      AsyncStorage.getItem("auth_password"),
    ]).then(([storedUser, pw]) => {
      if (storedUser) setUser(JSON.parse(storedUser));
      if (pw) setStoredPassword(pw);
    }).finally(() => setIsLoading(false));
  }, []);

  const persist = async (u: AuthUser) => {
    await AsyncStorage.setItem("auth_user", JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Please fill in all fields");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const authUser: AuthUser = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    await AsyncStorage.setItem("auth_password", password);
    setStoredPassword(password);
    await persist(authUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    if (!name || !email || !password) throw new Error("Please fill in all fields");
    if (password.length < 6) throw new Error("Password must be at least 6 characters");
    const authUser: AuthUser = {
      id: Date.now().toString(),
      name,
      email,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    };
    await AsyncStorage.setItem("auth_password", password);
    setStoredPassword(password);
    await persist(authUser);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["auth_user", "auth_password"]);
    setUser(null);
    setStoredPassword("");
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) throw new Error("Not logged in");
    const updated = { ...user, ...updates };
    await persist(updated);
  };

  const changePassword = async (current: string, next: string) => {
    if (current !== storedPassword) throw new Error("Current password is incorrect");
    if (next.length < 6) throw new Error("New password must be at least 6 characters");
    await AsyncStorage.setItem("auth_password", next);
    setStoredPassword(next);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
