import dotenv from "dotenv";

dotenv.config();

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não configurada: ${name}`);
  }

  return value;
}

export const env = {
  PORT: Number(process.env.PORT || 3333),
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  SUPABASE_URL: required("SUPABASE_URL"),
  SUPABASE_ANON_KEY: required("SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),
};