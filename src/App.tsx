import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AllocatsSearch from "./pages/AllocatsSearch";
import AllocatProfile from "./pages/AllocatProfile";
import Dashboard from "./pages/Dashboard";
import DashboardCalendar from "./components/DashboardCalendar";
import ProjectManager from "./components/ProjectManager";
import DashboardMessaging from "./components/DashboardMessaging";
import NotFoundErrorPage from "./components/NotFoundErrorPage";
import LandingPage from "./pages/LandingPage";
import Projects from "./pages/Projects";
import "./App.css";

function App() {

  const router = createBrowserRouter([
    {      
      path: "/",
      Component: LandingPage,
      errorElement: <NotFoundErrorPage />
    },    
    {
      path: "/allocats/:profileId", Component: AllocatProfile,
    },
    {
      path: "/allocats", Component: AllocatsSearch,
    },
    {
      path: "/dashboard/projects",
      Component: Projects,
    },
    {
      path: "/dashboard",
      Component: Dashboard,
      children: [
        { index: true, Component: ProjectManager },
        { path: "/dashboard/projects/:projectId", Component: ProjectManager },
        { path: "/dashboard/calendar", Component: DashboardCalendar },
        { path: "/dashboard/messaging", Component: DashboardMessaging },
      ]
    }
  ])

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
