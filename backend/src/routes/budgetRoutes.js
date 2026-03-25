import {
  getBudgets,
  getBudgetById,
  createBudget,
} from "../controllers/budgetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export async function budgetRoutes(app) {
  app.get("/budgets", { preHandler: authMiddleware }, getBudgets);
  app.get("/budgets/:id", { preHandler: authMiddleware }, getBudgetById);
  app.post("/budgets", { preHandler: authMiddleware }, createBudget);
}