import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageLoader from "../components/ui/PageLoader";
import {
  deleteBudget,
  getBudgetById,
  downloadBudgetPdf,
} from "../services/budgets";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function BudgetDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBudget() {
      try {
        const data = await getBudgetById(id);
        setBudget(data);
      } catch (error) {
  setErrorMessage(error.message);
  toast.error("Não foi possível carregar o orçamento.");
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
    toast.success("Orçamento excluído com sucesso.");
    navigate("/orcamentos");
  } catch (error) {
    setErrorMessage(error.message);
    toast.error("Não foi possível excluir o orçamento.");
  } finally {
    setDeleting(false);
  }
}

  async function handleDownload() {
    try {
      setDownloading(true);
      await downloadBudgetPdf(id);
      toast.success("PDF gerado com sucesso.");
    } catch {
      toast.error("Erro ao gerar PDF.");
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return <PageLoader message="Carregando orçamento..." />;
  }

  if (!budget) return null;

  return (
    <section className="text-slate-900">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span className="inline-flex rounded-full border border-[#ffd6bf] bg-[#fff3eb] px-3 py-1 text-xs text-[#f66504]">
              Detalhes do orçamento
            </span>

            <h1 className="mt-4 text-3xl font-bold">
              {budget.budget_number}
            </h1>

            <p className="mt-2 text-slate-600">
              Cliente:{" "}
              <span className="font-medium text-slate-900">
                {budget.client_name}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="rounded-xl bg-[#f66504] px-5 py-3 text-white font-semibold hover:bg-[#e15a00] active:scale-95 transition"
            >
              {downloading ? "Gerando..." : "Baixar PDF"}
            </button>

            <Link
              to={`/orcamentos/${id}/editar`}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Editar
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 hover:bg-red-100 transition"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Dados do cliente
            </h2>

            <div className="grid gap-3 text-sm">
              <p><strong>Nome:</strong> {budget.client_name}</p>
              <p><strong>Email:</strong> {budget.client_email || "-"}</p>
              <p><strong>Telefone:</strong> {budget.client_phone || "-"}</p>
              <p><strong>Empresa:</strong> {budget.client_company || "-"}</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Itens do orçamento
            </h2>

            <div className="space-y-4">
              {budget.items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="font-semibold">{item.title}</p>

                  {item.description && (
                    <p className="text-sm text-slate-500 mt-1">
                      {item.description}
                    </p>
                  )}

                  <div className="flex justify-between mt-3 text-sm">
                    <span>Qtd: {item.quantity}</span>
                    <span>{formatCurrency(item.unit_price)}</span>
                    <span className="font-medium">
                      {formatCurrency(item.total_price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Observações
            </h2>

            <p className="text-sm text-slate-600 whitespace-pre-wrap">
              {budget.notes || "Nenhuma observação."}
            </p>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-semibold mb-5">
              Resumo
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(budget.subtotal)}</span>
              </div>

              <div className="flex justify-between">
                <span>Desconto</span>
                <span>{formatCurrency(budget.discount)}</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatCurrency(budget.total)}</span>
              </div>
            </div>

            <div className="mt-6">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  budget.status === "finalized"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {budget.status === "finalized" ? "Finalizado" : "Rascunho"}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}