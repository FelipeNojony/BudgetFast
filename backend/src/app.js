import Fastify from "fastify";
import cors from "@fastify/cors";
import { profileRoutes } from "./routes/profileRoutes.js";
import { budgetRoutes } from "./routes/budgetRoutes.js";
import { env } from "./config/env.js";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(cors, {
    origin: [env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (reply.sent) return;

    return reply.status(error.statusCode || 500).send({
      message: error.message || "Erro interno do servidor.",
    });
  });

  app.get("/", async () => {
    return { message: "API do OrçaPro rodando com sucesso." };
  });

  app.register(profileRoutes);
  app.register(budgetRoutes);

  return app;
}