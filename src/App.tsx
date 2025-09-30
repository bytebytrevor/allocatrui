import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllocatsSearch from "./pages/AllocatsSearch";
import AllocatProfile from "./pages/AllocatProfile";
import Dashboard from "./pages/Dashboard";
import DashboardCalender from "./components/DashboardCalender";
import ProjectManager from "./components/ProjectManager";
import "./App.css";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/allocats/:profileId",
      element: <AllocatProfile />
    },
    {
      path: "/allocats",
      element: <AllocatsSearch />
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        { index: true, Component: ProjectManager },
        { path: "/dashboard/calender", Component: DashboardCalender }
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
