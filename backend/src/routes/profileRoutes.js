import {
  getProfile,
  createProfileHandler,
  updateProfileHandler,
} from "../controllers/profileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export async function profileRoutes(app) {
  app.get("/profile", { preHandler: authMiddleware }, getProfile);
  app.post("/profile", { preHandler: authMiddleware }, createProfileHandler);
  app.put("/profile", { preHandler: authMiddleware }, updateProfileHandler);
}