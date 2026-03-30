import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  FileText,
  UserCircle,
  Briefcase,
  LogOut,
} from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../../../contexts/AuthContext";

const SIDEBAR_WIDTH = 260;
const HEADER_HEIGHT = 92;

function LogoOrcaPro() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f66504] shadow-sm">
        <svg
          viewBox="0 0 64 64"
          className="h-7 w-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M46 14C42.5 10.5 37.6 8.5 32 8.5C18.5 8.5 8 19 8 32.5C8 46 18.5 56.5 32 56.5C37.6 56.5 42.5 54.5 46 51"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M36 20L51 32L36 44"
            stroke="white"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div>
        <p className="text-[30px] font-bold leading-none tracking-tight text-slate-900">
          Orça<span className="text-[#f66504]">Pro</span>
        </p>
      </div>
    </div>
  );
}

function SideLink({ to, icon: Icon, children, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-black/10 text-white shadow-sm"
          : "text-white/90 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={18} />
      <span>{children}</span>
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
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900">
      <aside
        className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-linear-to-b from-[#f66504] to-[#ff7a1a]"
        style={{ width: `${SIDEBAR_WIDTH}px` }}
      >
        <div className="flex h-23 items-center border-b border-white/20 bg-white px-6">
          <LogoOrcaPro />
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-6">
          <SideLink
            to="dashboard"
            icon={LayoutDashboard}
            active={location.pathname === "/dashboard"}
          >
            Dashboard
          </SideLink>

          <SideLink
            to="/orcamentos"
            icon={FileText}
            active={location.pathname.startsWith("/orcamentos")}
          >
            Orçamentos
          </SideLink>

          <SideLink
            to="/perfil"
            icon={Briefcase}
            active={location.pathname === "/perfil"}
          >
            Meu negócio 
          </SideLink>

          {/* <SideLink
            to="/app/account"
            icon={UserCircle}
            active={location.pathname === "/app/account"}
          >
            Conta
          </SideLink> */}
        </nav>

        <div className="border-t border-white/20 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div
        className="min-h-screen"
        style={{ marginLeft: `${SIDEBAR_WIDTH}px` }}
      >
        <header
          className="fixed top-0 right-0 z-30 flex items-center justify-between border-b border-slate-200 bg-[#f3f4f6]/95 px-8 backdrop-blur"
          style={{
            left: `${SIDEBAR_WIDTH}px`,
            height: `${HEADER_HEIGHT}px`,
          }}
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Painel do OrçaPro
            </h1>
            <p className="text-sm text-slate-500">
              Gerencie orçamentos com agilidade e profissionalismo.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="rounded-full border border-slate-200 bg-white p-3 text-slate-500 transition hover:bg-slate-100">
              <Bell size={18} />
            </button>

            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user?.email || "Usuario"
                )}&background=f66504&color=fff`}
                alt="Usuário"
                className="h-10 w-10 rounded-full object-cover"
              />

              <div className="hidden sm:block">
                <p className="text-xs text-slate-500">Usuário logado</p>
                <p className="max-w-55 truncate text-sm font-semibold text-slate-900">
                  {user?.email || "Usuário"}
                </p>
              </div>

              <ChevronDown size={16} className="text-slate-500" />
            </div>
          </div>
        </header>

        <main
          className="min-h-screen px-8 pb-8"
          style={{ paddingTop: `${HEADER_HEIGHT + 32}px` }}
        >
          <div className="min-h-[calc(100vh-124px)] rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}