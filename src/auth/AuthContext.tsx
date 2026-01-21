import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

import api from "@/api/axios";

export type User = {
  email: string;
  fullName?: string;
  avatarUrl?: string; // user profile picture
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, isAllocat: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setAvatar: (avatarUrl: string) => void; // update avatar after upload
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if user is logged in
  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  // ----------------- LOGIN -----------------
  async function login(email: string, password: string) {
    await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );

    await refreshUser();
  }

  // ----------------- REGISTER -----------------
  async function register(fullName: string, email: string, password: string, isAllocat: boolean) {
    await api.post(
      "/auth/register",
      { fullName, email, password, isAllocat },
      { withCredentials: true }
    );

    // Auto-login after register
    await login(email, password);
  }

  // ----------------- LOGOUT -----------------
  async function logout() {
    await api.post("/auth/logout", {}, { withCredentials: true });
    setUser(null);
  }

  // ----------------- REFRESH USER -----------------
  async function refreshUser() {
    try {
      const res = await api.get("/auth/me", { withCredentials: true });
      setUser({
        email: res.data.email,
        fullName: res.data.fullName,
        avatarUrl: res.data.avatarUrl
      });
    } catch {
      setUser(null);
    }
  }

  // ----------------- SET AVATAR -----------------
  function setAvatar(avatarUrl: string) {
    if (user) setUser({ ...user, avatarUrl });
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser, setAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ----------------- HELPER HOOK -----------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
} 


