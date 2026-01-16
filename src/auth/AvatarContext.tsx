import { createContext, useContext, useState } from "react";

type AvatarContextType = {
  avatarUrl: string | null;
  setAvatarUrl: (url: string) => void;
};

const AvatarContext = createContext<AvatarContextType | null>(null);

export function AvatarProvider({ children }: { children: React.ReactNode }) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) throw new Error("useAvatar must be used inside AvatarProvider");
  return ctx;
}
