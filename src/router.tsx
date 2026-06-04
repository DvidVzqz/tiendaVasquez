// router.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Search from "./pages/Search";
import History from "./pages/History";
import Dashboard from "./pages/Dashboard";
import Suppliers from "./pages/Suppliers";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,

    children: [
      { path: "home/:saleId", element: <Home /> },
      { index: true, path: "/", element: <Dashboard /> },
      { path: "search", element: <Search /> },
      { path: "history", element: <History /> },
      { path: "suppliers", element: <Suppliers /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

export default router;