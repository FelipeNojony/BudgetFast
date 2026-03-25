import Fastify from "fastify";
import cors from "@fastify/cors";

export function buildApp() {
  const app = Fastify();

  app.register(cors, {
    origin: true,
  });

  app.get("/", async () => {
    return { message: "API rodando com sucesso" };
  });

  return app;
}