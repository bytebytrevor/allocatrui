import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllocatsSearch from "./pages/AllocatsSearch";
import AllocatProfile from "./pages/AllocatProfile";
import Dashboard from "./pages/Dashboard";
import Calendar from "./components/Calendar";
import ProjectManager from "./components/ProjectManager";
import Messaging from "./components/Messaging";
import NotFoundErrorPage from "./components/NotFoundErrorPage";
import LandingPage from "./pages/LandingPage";
import Projects from "./pages/Projects";
import Analytics from "./components/Analytics";
import Transactions from "./components/Transactions";
import Favorites from "./components/Favorites";
import CreateProject from "./pages/CreateProject";
import FindAllocats from "./pages/FindAllocats";
import { useEffect } from "react";
import "./App.css";
import Register from "./pages/Register";
import { AuthProvider } from "./auth/AuthContext";
import { RequireAuth } from "./auth/RequireAuth";

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

  const router = createBrowserRouter([
    {      
      path: "/",
      Component: LandingPage,
      errorElement: <NotFoundErrorPage />
    },
    {      
      path: "/register", Component: Register,
    },
        
    {
      path: "/allocats", Component: AllocatsSearch,
    },        
    {
      path: "/allocats/:profileId", Component: AllocatProfile,
    },    
    // {
    //   path: "/projects",
    //   Component: Projects,
    // },
    // {
    //   path: "/projects/new", Component: CreateProject,
    // },
    // {
    //   path: "/projects/:projectId/allocats/find", Component: FindAllocats,
    // },
    // {
    //   path: "/projects/:projectId",
    //   Component: Dashboard,
    //   children: [
    //     { index: true, Component: ProjectManager },
    //     { path: "/projects/:projectId/calendar", Component: Calendar },
    //     { path: "/projects/:projectId/messaging", Component: Messaging },
    //     { path: "/projects/:projectId/analytics", Component: Analytics },
    //     { path: "/projects/:projectId/favorites", Component: Favorites },
    //     { path: "/projects/:projectId/transactions", Component: Transactions },
    //   ]
    // }
    // 🔐 PROTECTED ROUTES
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/projects",
        Component: Projects,
      },
      {
        path: "/projects/new",
        Component: CreateProject,
      },
      {
        path: "/projects/:projectId/allocats/find",
        Component: FindAllocats,
      },
      {
        path: "/projects/:projectId",
        Component: Dashboard,
        children: [
          { index: true, Component: ProjectManager },
          { path: "calendar", Component: Calendar },
          { path: "messaging", Component: Messaging },
          { path: "analytics", Component: Analytics },
          { path: "favorites", Component: Favorites },
          { path: "transactions", Component: Transactions },
        ],
      },
    ],
  },
  ]);

  return (
    <>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </>
  );
}

export default App;
