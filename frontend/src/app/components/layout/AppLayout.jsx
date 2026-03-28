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
    <div className="h-screen overflow-hidden bg-[#f3f4f6] text-slate-900">
      <aside
        className="fixed left-0 top-0 z-40 flex h-screen flex-col bg-linear-to-b from-[#f66504] to-[#ff7a1a]"
        style={{ width: `${SIDEBAR_WIDTH}px` }}
      >
        <div className="flex h-23 items-center border-b border-white/20 bg-white px-6">
          <LogoOrcaPro />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-2">
            <SideLink
              to="/dashboard"
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
              icon={UserCircle}
              active={location.pathname === "/perfil"}
            >
              Perfil
            </SideLink>
          </nav>
        </div>

        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/90 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <header
        className="fixed top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-8"
        style={{
          left: `${SIDEBAR_WIDTH}px`,
          right: 0,
          height: `${HEADER_HEIGHT}px`,
        }}
      >
        <div />

        <div className="flex items-center gap-4">
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200">
            <Bell size={18} />
          </button>

          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <img
              src="https://ui-avatars.com/api/?name=Felipe&background=f66504&color=fff"
              alt="Usuário"
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="hidden sm:block">
              <p className="text-xs text-slate-500">Usuário logado</p>
              <p className="max-w-55 truncate text-sm font-semibold text-slate-900">
                {user?.email || "Felipe"}
              </p>
            </div>

            <ChevronDown size={16} className="text-slate-500" />
          </div>
        </div>
      </header>

      <div
        className="h-screen overflow-hidden"
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`,
          paddingTop: `${HEADER_HEIGHT}px`,
        }}
      >
        <main className="h-full overflow-y-auto overflow-x-hidden p-8">
          <div className="min-h-full rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}