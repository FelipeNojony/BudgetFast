import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../controllers/budgetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export async function budgetRoutes(app) {
  app.get("/budgets", { preHandler: authMiddleware }, getBudgets);
  app.get("/budgets/:id", { preHandler: authMiddleware }, getBudgetById);
  app.post("/budgets", { preHandler: authMiddleware }, createBudget);
  app.put("/budgets/:id", { preHandler: authMiddleware }, updateBudget);
  app.delete("/budgets/:id", { preHandler: authMiddleware }, deleteBudget);
}