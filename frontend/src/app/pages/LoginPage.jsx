import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(form.email, form.password);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Login realizado!");
      navigate("/dashboard");
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Entrar no BudgetFast
        </h1>

        <p className="mt-2 text-slate-600">
          Acesse sua conta para continuar
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-500 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Não tem conta?{" "}
          <Link to="/register" className="text-blue-600 font-medium">
            Criar conta
          </Link>
        </p>
      </div>
    </main>
  );
}