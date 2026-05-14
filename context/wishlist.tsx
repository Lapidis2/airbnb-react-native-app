import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";

interface WishlistContextType {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggle: (id: string) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // key is per-user so different accounts have separate wishlists
  const storageKey = user ? `wishlist_${user.id}` : null;

  // load from storage when user changes
  useEffect(() => {
    if (!storageKey) { setSavedIds([]); return; }
    AsyncStorage.getItem(storageKey).then((raw) => {
      setSavedIds(raw ? JSON.parse(raw) : []);
    });
  }, [storageKey]);

  const persist = async (ids: string[]) => {
    if (!storageKey) return;
    await AsyncStorage.setItem(storageKey, JSON.stringify(ids));
  };

  const toggle = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      persist(next);
      return next;
    });
  }, [storageKey]);

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return (
    <WishlistContext.Provider value={{ savedIds, isSaved, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
