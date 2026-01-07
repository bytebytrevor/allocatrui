// import { createContext, useEffect, useState } from "react";
// import api from "../api/axios";

// export type User = {
//   email: string;
// };

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
// };

// export const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   async function login(email: string, password: string) {
//     const res = await api.post("/auth/login", { email, password }, {withCredentials: true});
//     setUser(res.data);
//   }

//   async function register(email: string, password: string) {
//     await api.post("/auth/register", { email, password }, {withCredentials: true});
//     await login(email, password); // auto-login
//   }

//   async function logout() {
//     try {
//       await api.post("/auth/logout", {withCredentials: true}); // cookie sent to server
//     } catch (err) {
//       console.error("Logout failed:", err);
//     } finally {
//       setUser(null); // update front-end
//       window.location.href = "/login"; // redirect
//     }
//   }

//   return (
//     <AuthContext.Provider
//       value={{ user, loading, login, register, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Rehydrate auth on reload
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await api.get("/auth/me", { withCredentials: true });
        setUser(res.data);
      } catch {
        setUser(null); // silently ignore 401
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data);
  }

  async function register(email: string, password: string) {
    await api.post(
      "/auth/register",
      { email, password },
      { withCredentials: true }
    );
    await login(email, password);
  }

  async function logout() {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
