import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/auth/useAuth";

type Props = {
  children: ReactNode;
};

export default function RequireAllocatSetup({ children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isAllocat) {
    return <Navigate to="/projects" replace />;
  }

  return children;
}
