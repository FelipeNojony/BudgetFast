import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../contexts/AuthContext";

function NavLink({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "border border-blue-200 bg-blue-50 text-blue-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </Link>
  );
}

export default function AppLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    const { error } = await signOut();

    if (!error) {
      toast.success("Você saiu da conta.");
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] text-slate-900">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-40 right-0 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-slate-200/40 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-2 items-center px-4 py-4 md:grid-cols-3">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-cyan-500 font-bold text-white shadow-lg shadow-blue-200">
                B
              </div>

              <div>
                <p className="text-base font-semibold text-slate-900">
                  BudgetFast
                </p>
                <p className="text-xs text-slate-500">
                  Orçamentos profissionais
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center justify-center gap-2 md:flex">
            <NavLink to="/dashboard" isActive={location.pathname === "/dashboard"}>
              Dashboard
            </NavLink>

            <NavLink
              to="/orcamentos"
              isActive={location.pathname.startsWith("/orcamentos")}
            >
              Orçamentos
            </NavLink>

            <NavLink to="/perfil" isActive={location.pathname === "/perfil"}>
              Perfil
            </NavLink>
          </nav>

          <div className="flex items-center justify-end gap-3">
            <div className="hidden rounded-2xl border border-slate-200 bg-white px-4 py-2 shadow-sm md:block">
              <p className="text-xs text-slate-500">Conta ativa</p>
              <p className="max-w-55 truncate text-sm font-medium text-slate-900">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 active:scale-95"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}