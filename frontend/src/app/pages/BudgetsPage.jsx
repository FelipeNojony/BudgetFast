import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import PageLoader from "../components/ui/PageLoader";
import { getBudgets } from "../services/budgets";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBudgets() {
      try {
        const data = await getBudgets();
        setBudgets(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBudgets();
  }, []);

  if (loading) {
    return <PageLoader message="Carregando orçamentos..." />;
  }

  return (
    <section className="text-slate-900">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
              Gestão de orçamentos
            </span>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              Orçamentos
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Visualize, acompanhe e gerencie todos os orçamentos criados no
              sistema.
            </p>
          </div>

          <Link
            to="/orcamentos/novo"
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-95"
          >
            Novo orçamento
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      {!budgets.length ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <EmptyState
            title="Nenhum orçamento encontrado"
            description="Crie seu primeiro orçamento para começar a usar o sistema."
            actionLabel="Criar orçamento"
            actionTo="/orcamentos/novo"
          />
        </div>
      ) : (
        <>
          <div className="hidden md:block rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-sm text-slate-500">
                  <th className="px-6 py-4 font-medium">Número</th>
                  <th className="px-6 py-4 font-medium">Cliente</th>
                  <th className="px-6 py-4 font-medium">Data</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Ações</th>
                </tr>
              </thead>

              <tbody>
                {budgets.map((budget) => (
                  <tr
                    key={budget.id}
                    className="border-t border-slate-200 transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 font-medium text-slate-900">
                      {budget.budget_number}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {budget.client_name}
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {budget.issue_date}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                          budget.status === "finalized"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {budget.status === "finalized" ? "Finalizado" : "Rascunho"}
                      </span>
                    </td>

                    <td className="px-6 py-5 font-medium text-slate-900">
                      {formatCurrency(budget.total)}
                    </td>

                    <td className="px-6 py-5">
                      <Link
                        to={`/orcamentos/${budget.id}`}
                        className="font-medium text-blue-600 transition-colors hover:text-blue-500 hover:underline"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-4 md:hidden">
            {budgets.map((budget) => (
              <Link
                key={budget.id}
                to={`/orcamentos/${budget.id}`}
                className="block rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      {budget.budget_number}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {budget.client_name}
                    </p>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      budget.status === "finalized"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {budget.status === "finalized" ? "Finalizado" : "Rascunho"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{budget.issue_date}</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(budget.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}