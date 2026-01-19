import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export function RequireAuth() {
  const { user, loading } = useAuth();

  if (loading) return null;
  // if (loading) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <span className="text-muted-foreground">Loading…</span>
  //     </div>
  //   );
  // }
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

// src/auth/RequireAuth.tsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "@/auth/useAuth";
// import type { JSX } from "react";

// export default function RequireAuth({ children }: { children: JSX.Element }) {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <span className="text-muted-foreground">Loading…</span>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }
