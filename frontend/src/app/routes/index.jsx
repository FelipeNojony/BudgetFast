import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import ProfilePage from "../pages/ProfilePage";
import NewBudgetPage from "../pages/NewBudgetPage";
import BudgetsPage from "../pages/BudgetsPage";
import BudgetDetailsPage from "../pages/BudgetDetailsPage";
import EditBudgetPage from "../pages/EditBudgetPage";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

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
  element: (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  ),
  children: [
    { path: "/dashboard", element: <DashboardPage /> },
    { path: "/perfil", element: <ProfilePage /> },
    { path: "/orcamentos", element: <BudgetsPage /> },
    { path: "/orcamentos/novo", element: <NewBudgetPage /> },
    { path: "/orcamentos/:id", element: <BudgetDetailsPage /> },
    { path: "/orcamentos/:id/editar", element: <EditBudgetPage /> },
  ],
},
]);