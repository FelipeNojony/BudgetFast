import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Pencil, Eye } from "lucide-react";
import PageLoader from "../components/ui/PageLoader";
import { getBudgets } from "../services/budgets";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("pt-BR");
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function loadBudgets() {
      try {
        const data = await getBudgets();
        setBudgets(data || []);
      } catch (error) {
        setErrorMessage(error.message || "Erro ao carregar orçamentos.");
      } finally {
        setLoading(false);
      }
    }

    loadBudgets();
  }, []);

  const filteredBudgets = useMemo(() => {
    return budgets.filter((budget) => {
      const matchesSearch =
        budget.client_name?.toLowerCase().includes(search.toLowerCase()) ||
        budget.budget_number?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "finalized"
          ? budget.status === "finalized"
          : budget.status !== "finalized";

      return matchesSearch && matchesStatus;
    });
  }, [budgets, search, statusFilter]);

  if (loading) {
    return <PageLoader message="Carregando orçamentos..." />;
  }

  return (
    <section className="text-slate-900">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Orçamentos
        </h1>
        <p className="mt-2 text-slate-600">
          Veja os orçamentos criados e gerencie seus documentos.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row">
            <div className="relative w-full md:max-w-117.5">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Buscar por cliente ou número..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-900 outline-none transition-all duration-200 focus:border-[#f66504] focus:ring-4 focus:ring-orange-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none transition-all duration-200 focus:border-[#f66504] focus:ring-4 focus:ring-orange-100"
            >
              <option value="all">Todos</option>
              <option value="finalized">Finalizados</option>
              <option value="draft">Rascunhos</option>
            </select>
          </div>

          <div className="flex flex-row gap-3">
            <Link
              to="/perfil"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-slate-50"
            >
              Perfil profissional
            </Link>

            <Link
              to="/orcamentos/novo"
              className="inline-flex items-center justify-center rounded-xl bg-[#f66504] px-5 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-[#e15a00] active:scale-[0.98]"
            >
              Novo orçamento
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm text-slate-500">
                <th className="px-5 py-4 font-medium">#</th>
                <th className="px-5 py-4 font-medium">Cliente</th>
                <th className="px-5 py-4 font-medium">Valor total</th>
                <th className="px-5 py-4 font-medium">Emissão</th>
                <th className="px-5 py-4 font-medium">Validade</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>

            <tbody>
              {!filteredBudgets.length ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
                    Nenhum orçamento encontrado.
                  </td>
                </tr>
              ) : (
                filteredBudgets.map((budget, index) => (
                  <tr
                    key={budget.id}
                    className="border-t border-slate-200 bg-white transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-slate-100 px-2 text-sm font-medium text-slate-600">
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-slate-900">
                          {budget.client_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {budget.budget_number}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-900">
                      {formatCurrency(budget.total)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(budget.issue_date)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(budget.valid_until)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          budget.status === "finalized"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {budget.status === "finalized" ? "Finalizado" : "Rascunho"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/orcamentos/${budget.id}`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                          title="Visualizar"
                        >
                          <Eye size={18} />
                        </Link>

                        <Link
                          to={`/orcamentos/${budget.id}/editar`}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
                          title="Editar"
                        >
                          <Pencil size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">
            Exibindo {filteredBudgets.length} de {budgets.length} resultado(s)
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-400"
              disabled
            >
              Anterior
            </button>

            <button
              type="button"
              className="rounded-xl bg-[#f66504] px-4 py-2 text-sm font-semibold text-white"
            >
              1
            </button>

            <button
              type="button"
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-400"
              disabled
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}