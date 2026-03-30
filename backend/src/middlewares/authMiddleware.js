import { supabaseAuth } from "../lib/supabase.js";

export async function authMiddleware(request, reply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({
        message: "Token não informado.",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({
        message: "Formato de token inválido.",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      return reply.status(401).send({
        message: "Token não informado.",
      });
    }

    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return reply.status(401).send({
        message: "Token inválido ou expirado.",
      });
    }

    request.user = user;
  } catch {
    return reply.status(401).send({
      message: "Não autorizado.",
    });
  }
}