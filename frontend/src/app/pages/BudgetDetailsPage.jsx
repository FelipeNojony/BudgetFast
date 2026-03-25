import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteBudget, getBudgetById } from "../services/budgets";

export default function BudgetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBudget() {
      try {
        const data = await getBudgetById(id);
        setBudget(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBudget();
  }, [id]);

  async function handleDelete() {
    const confirmed = window.confirm("Tem certeza que deseja excluir este orçamento?");

    if (!confirmed) return;

    try {
      setDeleting(true);
      await deleteBudget(id);
      navigate("/orcamentos");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Carregando orçamento...</p>
      </main>
    );
  }

  if (!budget) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Orçamento não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Detalhes do orçamento</h1>
            <p className="text-slate-400 mt-2">{budget.budget_number}</p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/orcamentos"
              className="rounded-xl border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-900 transition"
            >
              Voltar
            </Link>

            <Link
              to={`/orcamentos/${budget.id}/editar`}
              className="rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold hover:opacity-90 transition"
            >
              Editar
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl bg-red-500 px-5 py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="text-red-400 mb-4">{errorMessage}</p>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold mb-4">Cliente</h2>
              <div className="grid gap-4 md:grid-cols-2 text-slate-300">
                <p><span className="text-slate-500">Nome:</span> {budget.client_name}</p>
                <p><span className="text-slate-500">E-mail:</span> {budget.client_email || "-"}</p>
                <p><span className="text-slate-500">Telefone:</span> {budget.client_phone || "-"}</p>
                <p><span className="text-slate-500">Empresa:</span> {budget.client_company || "-"}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold mb-4">Dados do orçamento</h2>
              <div className="grid gap-4 md:grid-cols-2 text-slate-300">
                <p><span className="text-slate-500">Emissão:</span> {budget.issue_date}</p>
                <p><span className="text-slate-500">Validade:</span> {budget.valid_until || "-"}</p>
                <p><span className="text-slate-500">Prazo:</span> {budget.delivery_time || "-"}</p>
                <p><span className="text-slate-500">Pagamento:</span> {budget.payment_terms || "-"}</p>
                <p><span className="text-slate-500">Status:</span> {budget.status === "finalized" ? "Finalizado" : "Rascunho"}</p>
              </div>

              <div className="mt-4">
                <p className="text-slate-500 mb-2">Observações:</p>
                <p className="text-slate-300">{budget.notes || "-"}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold mb-4">Itens</h2>

              <div className="space-y-4">
                {budget.items?.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-slate-400 mt-1">{item.description || "-"}</p>
                      </div>

                      <div className="text-right text-sm text-slate-300">
                        <p>Qtd: {Number(item.quantity)}</p>
                        <p>Unitário: R$ {Number(item.unit_price).toFixed(2)}</p>
                        <p className="font-semibold mt-2">
                          Total: R$ {Number(item.total_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside>
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Resumo</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white">R$ {Number(budget.subtotal).toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Desconto</span>
                  <span className="text-white">R$ {Number(budget.discount).toFixed(2)}</span>
                </div>

                <div className="h-px bg-slate-800" />

                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>R$ {Number(budget.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}