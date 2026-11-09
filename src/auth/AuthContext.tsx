import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { isAxiosError } from "axios";
import api from "@/api/axios";
import type { User } from "@/Types/user";

type RegistrationDelivery = "sent" | "failed" | null;
type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (
    fullName: string,
    email: string,
    password: string,
    isAllocat: boolean,
  ) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  setAvatar: (avatarUrl: string) => void;
  registrationDelivery: RegistrationDelivery;
};
export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationDelivery, setRegistrationDelivery] =
    useState<RegistrationDelivery>(null);
  const revision = useRef(0);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const requestRevision = ++revision.current;
    try {
      const response = await api.get<User>("/auth/me", {
        withCredentials: true,
      });
      const current = response.data;
      if (
        typeof current.emailConfirmed !== "boolean" ||
        typeof current.hasAllocatProfile !== "boolean"
      )
        throw new Error(
          "Update the backend /auth/me endpoint before enabling onboarding.",
        );
      if (requestRevision === revision.current) setUser(current);
      return current;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 401) {
        if (requestRevision === revision.current) setUser(null);
        return null;
      }
      // A temporary server failure must not silently sign an existing user out.
      throw error;
    }
  }, []);

  useEffect(() => {
    let active = true;
    void refreshUser()
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      ++revision.current;
      await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true },
      );
      const current = await refreshUser();
      if (!current)
        throw new Error(
          "Your session could not be loaded. Please sign in again.",
        );
      return current;
    },
    [refreshUser],
  );

  const register = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      isAllocat: boolean,
    ): Promise<User> => {
      const response = await api.post<{ verificationEmailSent: boolean }>(
        "/auth/register",
        { fullName, email, password, isAllocat },
        { withCredentials: true },
      );
      setRegistrationDelivery(
        response.data.verificationEmailSent ? "sent" : "failed",
      );
      try {
        return await login(email, password);
      } catch {
        // The account exists now; present a sign-in recovery instead of asking for a duplicate registration.
        throw new Error(
          "Your account was created. Please sign in to continue email verification.",
        );
      }
    },
    [login],
  );

  const logout = useCallback(async () => {
    ++revision.current;
    await api.post("/auth/logout", {}, { withCredentials: true });
    ++revision.current;
    setUser(null);
    setRegistrationDelivery(null);
  }, []);
  const setAvatar = useCallback((avatarUrl: string) => {
    setUser((current) => (current ? { ...current, avatarUrl } : current));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        setAvatar,
        registrationDelivery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
