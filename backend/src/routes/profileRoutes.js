import {
  getProfile,
  createProfile,
  updateProfile,
} from "../controllers/profileController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export async function profileRoutes(fastify) {
  fastify.get("/profile", { preHandler: authMiddleware }, getProfile);
  fastify.post("/profile", { preHandler: authMiddleware }, createProfile);
  fastify.put("/profile", { preHandler: authMiddleware }, updateProfile);
}