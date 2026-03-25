import Fastify from "fastify";
import cors from "@fastify/cors";
import { profileRoutes } from "./routes/profileRoutes.js";

export function buildApp() {
  const app = Fastify();

  app.register(cors, {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.get("/", async () => {
    return { message: "API rodando com sucesso" };
  });

  app.register(profileRoutes);

  return app;
}