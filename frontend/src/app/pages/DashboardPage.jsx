import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageLoader from "../components/ui/PageLoader";
import { getBudgets } from "../services/budgets";
import { formatDate } from "../../utils/formatters";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function MetricCard({ label, value, helper, accent = "blue" }) {
  const accentMap = {
    blue: "bg-blue-50 border-blue-100",
    cyan: "bg-cyan-50 border-cyan-100",
    emerald: "bg-emerald-50 border-emerald-100",
    amber: "bg-amber-50 border-amber-100",
  };

  return (
    <div className={`rounded-[28px] border p-6 shadow-sm ${accentMap[accent]}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </h2>
      <p className="mt-2 text-xs text-slate-500">{helper}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-md">
      <p className="text-sm font-medium text-slate-900">{label}</p>
      <p className="mt-1 text-sm text-slate-600">
        Valor: <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await getBudgets();
        setBudgets(data || []);
      } catch (error) {
        setErrorMessage(error.message || "Erro ao carregar dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalBudgets = useMemo(() => budgets.length, [budgets]);

  const totalRevenue = useMemo(() => {
    return budgets.reduce((acc, budget) => acc + Number(budget.total || 0), 0);
  }, [budgets]);

  const finalizedBudgets = useMemo(() => {
    return budgets.filter((budget) => budget.status === "finalized").length;
  }, [budgets]);

  const finalizedRevenue = useMemo(() => {
    return budgets
      .filter((budget) => budget.status === "finalized")
      .reduce((acc, budget) => acc + Number(budget.total || 0), 0);
  }, [budgets]);

  const recentBudgets = useMemo(() => budgets.slice(0, 5), [budgets]);

  const chartData = useMemo(() => {
    return [...recentBudgets].reverse().map((budget) => ({
      name: budget.client_name?.slice(0, 12) || budget.budget_number,
      total: Number(budget.total || 0),
    }));
  }, [recentBudgets]);

  const statusData = useMemo(() => {
    const draftCount = budgets.filter((budget) => budget.status !== "finalized").length;
    const finalizedCount = budgets.filter((budget) => budget.status === "finalized").length;

    return [
      { name: "Finalizados", value: finalizedCount, color: "#10b981" },
      { name: "Rascunhos", value: draftCount, color: "#f59e0b" },
    ].filter((item) => item.value > 0);
  }, [budgets]);

  if (loading) {
    return <PageLoader message="Carregando dashboard..." />;
  }

  return (
    <section className="text-slate-900">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
              Painel principal
            </span>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              Bem-vindo ao seu dashboard
            </h1>

            <p className="mt-3 text-slate-600">
              Acompanhe seus orçamentos, visualize seu faturamento e acesse
              rapidamente as áreas principais do BudgetFast.
            </p>
          </div>

          <div className="flex w-full flex-row gap-3 lg:w-auto">
            <Link
                to="/perfil"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50 hover:shadow-sm"
            >
                Perfil profissional
            </Link>

            <Link
                to="/orcamentos/novo"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-500 hover:shadow-sm active:scale-[0.98]"
            >
                Novo orçamento
            </Link>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total de orçamentos"
          value={totalBudgets}
          helper="Quantidade total de orçamentos criados"
          accent="blue"
        />

        <MetricCard
          label="Faturamento total"
          value={formatCurrency(totalRevenue)}
          helper="Soma de todos os orçamentos do sistema"
          accent="cyan"
        />

        <MetricCard
          label="Faturamento finalizado"
          value={formatCurrency(finalizedRevenue)}
          helper="Soma apenas dos orçamentos finalizados"
          accent="emerald"
        />

        <MetricCard
          label="Orçamentos finalizados"
          value={finalizedBudgets}
          helper="Quantidade de orçamentos com status finalizado"
          accent="amber"
        />
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-12">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              Desempenho dos últimos orçamentos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Visualização dos valores dos orçamentos recentes.
            </p>
          </div>

          {!chartData.length ? (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <p className="text-slate-500">Sem dados para exibir no gráfico.</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barCategoryGap={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total" radius={[10, 10, 0, 0]} fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-slate-900">
              Status dos orçamentos
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Distribuição entre finalizados e rascunhos.
            </p>
          </div>

          {!statusData.length ? (
            <div className="flex h-80 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
              <p className="text-slate-500">Sem dados para exibir.</p>
            </div>
          ) : (
            <div className="flex h-80 flex-col items-center justify-center">
              <div className="h-55 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                    >
                      {statusData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                {statusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm text-slate-600">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>
                      {item.name}: <strong>{item.value}</strong>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Orçamentos recentes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Os últimos orçamentos criados por você
            </p>
          </div>

          <Link
            to="/orcamentos"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
          >
            Ver todos
          </Link>
        </div>

        {!recentBudgets.length ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
            <p className="text-slate-600">
              Você ainda não criou nenhum orçamento.
            </p>

            <Link
              to="/orcamentos/novo"
              className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-95"
            >
              Criar primeiro orçamento
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentBudgets.map((budget) => (
              <Link
                key={budget.id}
                to={`/orcamentos/${budget.id}`}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {budget.budget_number}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {budget.client_name}
                  </p>
                </div>

                <div className="flex flex-col md:items-end">
                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      budget.status === "finalized"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {budget.status === "finalized" ? "Finalizado" : "Rascunho"}
                  </span>

                  <p className="mt-2 text-sm text-slate-500">
                    {formatDate(budget.issue_date)}
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {formatCurrency(budget.total)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}