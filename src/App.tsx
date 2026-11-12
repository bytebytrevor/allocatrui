import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import Discover from "./pages/DiscoverAllocats";
import AllocatProfilePage from "./pages/AllocatProfile";
import AllocatPublicProfilePage from "./pages/AllocatPublicProfile";
import Dashboard from "./pages/Dashboard";
import Calendar from "./components/Calendar";
import ProjectManager from "./components/ProjectManager";
import Messaging from "./components/Messaging";
import NotFoundErrorPage from "./components/NotFoundErrorPage";
import LandingPage from "./pages/LandingPage";
import Projects from "./pages/Projects";
import Analytics from "./components/Analytics";
import Transactions from "./components/Transactions";
import CreateProject from "./pages/CreateProject";
import FindAllocats from "./pages/FindAllocats";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import CheckEmail from "@/pages/Auth/CheckEmail";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ProjectFilesWorkspace from "./pages/ProjectFilesWorkspace";
import CreateAllocatProfile from "./pages/CreateAllocatProfile";
import AppToaster from "@/components/AppToaster";
import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";
import "./App.css";

// Create the router once, so an App render does not reset active navigation.
const router = createBrowserRouter([
  { path: "/", Component: LandingPage, errorElement: <NotFoundErrorPage /> },
  { path: "/register", Component: Register },
  { path: "/login", Component: Login },
  { path: "/forgot-password", Component: ForgotPassword },
  { path: "/reset-password", Component: ResetPassword },
  { path: "/discover", Component: Discover },
  { path: "/allocats/:profileId", Component: AllocatPublicProfilePage },
  // The inbox has its own signed-in check; confirmation links remain public.
  { path: "/verify-email", Component: VerifyEmail },
  { path: "/check-email", Component: CheckEmail },
  { path: "/about", Component: AboutPage, errorElement: <NotFoundErrorPage /> },
  {
    path: "/how-it-works",
    Component: HowItWorksPage,
    errorElement: <NotFoundErrorPage />,
  },
  {
    path: "/plans",
    Component: PricingPage,
    errorElement: <NotFoundErrorPage />,
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/projects",
        children: [
          { index: true, Component: Projects },
          { path: "new", Component: CreateProject },
          { path: ":projectId/allocats/find", Component: FindAllocats },
          {
            path: ":projectId",
            Component: Dashboard,
            children: [
              { index: true, Component: ProjectManager },
              { path: "calendar", Component: Calendar },
              { path: "files", Component: ProjectFilesWorkspace },
              { path: "messaging", Component: Messaging },
              { path: "analytics", Component: Analytics },
              { path: "transactions", Component: Transactions },
            ],
          },
        ],
      },
      { path: "/profile", Component: Profile },
      { path: "/allocats/profile", Component: AllocatProfilePage },
      // RequireAuth enforces email confirmation. The setup page handles account
      // type, existing profiles, creation and retrying final continuation.
      { path: "/allocats/profile/create", Component: CreateAllocatProfile },
    ],
  },
]);

function App() {
  const theme = localStorage.getItem("theme") || "light";
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <AppToaster />
    </>
  );
}
export default App;
