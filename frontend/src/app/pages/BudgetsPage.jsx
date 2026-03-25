import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBudgets } from "../services/budgets";

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
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Carregando orçamentos...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Orçamentos</h1>
            <p className="text-slate-400 mt-2">
              Visualize os orçamentos já criados.
            </p>
          </div>

          <Link
            to="/orcamentos/novo"
            className="rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold hover:opacity-90 transition"
          >
            Novo orçamento
          </Link>
        </div>

        {errorMessage && (
          <p className="text-red-400 mb-4">{errorMessage}</p>
        )}

        {!budgets.length ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              Nenhum orçamento encontrado
            </h2>
            <p className="text-slate-400 mb-6">
              Crie seu primeiro orçamento para começar.
            </p>

            <Link
              to="/orcamentos/novo"
              className="rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold hover:opacity-90 transition"
            >
              Criar orçamento
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
            <table className="w-full">
              <thead className="bg-slate-950">
                <tr className="text-left text-sm text-slate-400">
                  <th className="px-4 py-4">Número</th>
                  <th className="px-4 py-4">Cliente</th>
                  <th className="px-4 py-4">Data</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Total</th>
                  <th className="px-4 py-4">Ações</th>
                </tr>
              </thead>

              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget.id} className="border-t border-slate-800">
                    <td className="px-4 py-4">{budget.budget_number}</td>
                    <td className="px-4 py-4">{budget.client_name}</td>
                    <td className="px-4 py-4">{budget.issue_date}</td>
                    <td className="px-4 py-4">
                      {budget.status === "finalized" ? "Finalizado" : "Rascunho"}
                    </td>
                    <td className="px-4 py-4">
                      R$ {Number(budget.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        to={`/orcamentos/${budget.id}`}
                        className="text-white hover:underline"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}