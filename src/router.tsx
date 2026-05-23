// router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Search from "./pages/Search";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, path: "home", element: <Home /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "search", element: <Search /> },
      { path: "history", element: <History /> },
      { path: "suppliers", element: <Suppliers /> },
      { path: "settings", element: <h2>Configuración</h2> },
    ],
  },
]);

export default router;