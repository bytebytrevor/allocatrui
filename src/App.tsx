import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllocatsSearch from "./pages/AllocatsSearch";
import AllocatProfile from "./pages/AllocatProfile";
import Dashboard from "./pages/Dashboard";
import DashboardCalender from "./components/DashboardCalender";
import ProjectManager from "./components/ProjectManager";
import "./App.css";
import DashboardMessaging from "./components/DashboardMessaging";
import NotFoundErrorPage from "./components/NotFoundErrorPage";

function App() {

  const router = createBrowserRouter([
    {      
      path: "/",
      Component: HomePage,
      errorElement: <NotFoundErrorPage />
    },
    {
      path: "/allocats/:profileId",
      Component: AllocatProfile
    },
    {
      path: "/allocats",
      Component: AllocatsSearch
    },
    {
      path: "/dashboard",
      Component: Dashboard,
      children: [
        { index: true, Component: ProjectManager },
        { path: "/dashboard/calendar", Component: DashboardCalender },
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
