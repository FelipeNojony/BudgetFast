import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import NewBudgetPage from "../pages/NewBudgetPage";
import BudgetsPage from "../pages/BudgetsPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/cadastro",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/perfil",
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orcamentos",
    element: (
      <ProtectedRoute>
        <BudgetsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orcamentos/novo",
    element: (
      <ProtectedRoute>
        <NewBudgetPage />
      </ProtectedRoute>
    ),
  },
]);