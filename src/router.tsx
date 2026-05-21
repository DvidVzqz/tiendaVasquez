// router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Search from "./pages/Search";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, path: "home", element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "search", element: <Search /> },
      { path: "history", element: <History /> },
      { path: "settings", element: <h2>Configuración</h2> },
    ],
  },
]);

export default router;