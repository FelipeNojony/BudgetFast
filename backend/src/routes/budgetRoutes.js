import {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
  downloadBudgetPdf,
  duplicateBudget
} from "../controllers/budgetController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export async function budgetRoutes(app) {
  app.get("/budgets", { preHandler: authMiddleware }, getBudgets);
  app.get("/budgets/:id", { preHandler: authMiddleware }, getBudgetById);
  app.post("/budgets", { preHandler: authMiddleware }, createBudget);
  app.put("/budgets/:id", { preHandler: authMiddleware }, updateBudget);
  app.delete("/budgets/:id", { preHandler: authMiddleware }, deleteBudget);
  app.get("/budgets/:id/pdf", { preHandler: authMiddleware }, downloadBudgetPdf);
  app.post("/budgets/:id/duplicate", { preHandler: authMiddleware }, duplicateBudget);
}