import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterPage() {
  const { signUp } = useAuth();
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

    const { error } = await signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Conta criada com sucesso!");
      navigate("/dashboard");
    }

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-4">
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Criar conta
        </h1>

        <p className="mt-2 text-slate-600">
          Comece a usar o <span className="font-bold text-slate-900">Orça<span className="text-[#f66504]">Pro</span></span> agora
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-[#f66504] focus:ring-4 focus:ring-[#ffd6bf] outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-[#f66504] focus:ring-4 focus:ring-[#ffd6bf] outline-none"
          />

          <button
            disabled={loading}
            className="w-full rounded-xl bg-[#f66504] py-3 font-semibold text-white hover:bg-[#e15a00] transition"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-600">
          Já tem conta?{" "}
          <Link to="/login" className="text-[#f66504] font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}