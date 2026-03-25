import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  async function handleLogout() {
    const { error } = await signOut();

    if (!error) {
      navigate("/login");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-400 mt-2">
              Você está logado como{" "}
              <span className="text-white font-medium">{user?.email}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold hover:opacity-90 transition"
          >
            Sair
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            to="/perfil"
            className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-slate-700 transition"
          >
            <h2 className="text-xl font-semibold mb-2">Perfil profissional</h2>
            <p className="text-slate-400">
              Configure os dados que aparecerão nos seus orçamentos.
            </p>
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold mb-2">Próxima etapa</h2>
            <p className="text-slate-400">
              Depois do perfil, vamos começar a criação dos orçamentos.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}