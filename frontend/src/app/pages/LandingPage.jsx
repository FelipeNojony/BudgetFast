import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <span className="inline-block mb-4 rounded-full border border-slate-700 px-4 py-1 text-sm text-slate-300">
          BudgetFast
        </span>

        <h1 className="text-5xl font-bold leading-tight mb-4">
          Gere orçamentos profissionais em minutos
        </h1>

        <p className="text-slate-400 text-lg mb-8">
          Crie, salve e exporte seus orçamentos com uma experiência simples,
          moderna e profissional.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            to="/cadastro"
            className="rounded-xl bg-white text-slate-950 px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            Criar conta
          </Link>

          <Link
            to="/login"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold hover:bg-slate-900 transition"
          >
            Entrar
          </Link>
        </div>
      </div>
    </main>
  );
}