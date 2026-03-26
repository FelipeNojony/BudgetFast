import { useMemo, useState } from "react";
import { toast } from "sonner";
import { createBudget } from "../services/budgets";

const initialItem = {
  title: "",
  description: "",
  quantity: 1,
  unit_price: 0,
};

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export default function NewBudgetPage() {
  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    client_company: "",
    issue_date: new Date().toISOString().split("T")[0],
    valid_until: "",
    delivery_time: "",
    payment_terms: "",
    notes: "",
    discount: 0,
    status: "draft",
  });

  const [items, setItems] = useState([{ ...initialItem }]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleItemChange(index, field, value) {
    setItems((prevItems) =>
      prevItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "unit_price"
                  ? Number(value)
                  : value,
            }
          : item
      )
    );
  }

  function addItem() {
    setItems((prevItems) => [...prevItems, { ...initialItem }]);
  }

  function removeItem(index) {
    setItems((prevItems) => {
      if (prevItems.length === 1) return prevItems;
      return prevItems.filter((_, itemIndex) => itemIndex !== index);
    });
  }

  const calculatedItems = useMemo(() => {
    return items.map((item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unit_price) || 0;

      return {
        ...item,
        total_price: quantity * unitPrice,
      };
    });
  }, [items]);

  const subtotal = useMemo(() => {
    return calculatedItems.reduce((acc, item) => acc + item.total_price, 0);
  }, [calculatedItems]);

  const total = useMemo(() => {
    const discount = Number(formData.discount) || 0;
    return Math.max(subtotal - discount, 0);
  }, [subtotal, formData.discount]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      await createBudget({
        ...formData,
        discount: Number(formData.discount) || 0,
        items,
      });

      setMessage("Orçamento criado com sucesso.");
      toast.success("Orçamento criado com sucesso!");

      setFormData({
        client_name: "",
        client_email: "",
        client_phone: "",
        client_company: "",
        issue_date: new Date().toISOString().split("T")[0],
        valid_until: "",
        delivery_time: "",
        payment_terms: "",
        notes: "",
        discount: 0,
        status: "draft",
      });

      setItems([{ ...initialItem }]);
    } catch (error) {
      setErrorMessage(error.message);
      toast.error("Erro ao criar orçamento.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="text-slate-900">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700">
          Criação de orçamento
        </span>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Novo orçamento
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Preencha os dados do cliente, adicione os itens e acompanhe o resumo
          antes de salvar.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Dados do cliente
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nome do cliente
                </label>
                <input
                  type="text"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleFormChange}
                  placeholder="Nome do cliente"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  E-mail
                </label>
                <input
                  type="email"
                  name="client_email"
                  value={formData.client_email}
                  onChange={handleFormChange}
                  placeholder="cliente@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Telefone
                </label>
                <input
                  type="text"
                  name="client_phone"
                  value={formData.client_phone}
                  onChange={handleFormChange}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Empresa
                </label>
                <input
                  type="text"
                  name="client_company"
                  value={formData.client_company}
                  onChange={handleFormChange}
                  placeholder="Empresa do cliente"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Dados do orçamento
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Data de emissão
                </label>
                <input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Validade
                </label>
                <input
                  type="date"
                  name="valid_until"
                  value={formData.valid_until}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Prazo de entrega
                </label>
                <input
                  type="text"
                  name="delivery_time"
                  value={formData.delivery_time}
                  onChange={handleFormChange}
                  placeholder="Ex: 7 dias úteis"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Forma de pagamento
                </label>
                <input
                  type="text"
                  name="payment_terms"
                  value={formData.payment_terms}
                  onChange={handleFormChange}
                  placeholder="Ex: 50% entrada e 50% entrega"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Desconto
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="discount"
                  value={formData.discount}
                  onChange={handleFormChange}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="draft">Rascunho</option>
                  <option value="finalized">Finalizado</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Observações
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFormChange}
                  rows="4"
                  placeholder="Informações adicionais"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Itens do orçamento
              </h2>

              <button
                type="button"
                onClick={addItem}
                className="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-95"
              >
                Adicionar item
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Nome do serviço
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(event) =>
                          handleItemChange(index, "title", event.target.value)
                        }
                        placeholder="Ex: Criação de landing page"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Descrição
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(event) =>
                          handleItemChange(index, "description", event.target.value)
                        }
                        rows="3"
                        placeholder="Detalhes do serviço"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Quantidade
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.quantity}
                        onChange={(event) =>
                          handleItemChange(index, "quantity", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Valor unitário
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unit_price}
                        onChange={(event) =>
                          handleItemChange(index, "unit_price", event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-500">
                      Total do item:{" "}
                      <span className="font-semibold text-slate-900">
                        {formatCurrency(calculatedItems[index].total_price)}
                      </span>
                    </p>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all duration-200 hover:bg-red-100 disabled:opacity-50"
                      disabled={items.length === 1}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Resumo do orçamento
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Desconto</span>
                <span className="font-medium text-slate-900">
                  {formatCurrency(formData.discount)}
                </span>
              </div>

              <div className="h-px bg-slate-200" />

              <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>


            {errorMessage && (
              <p className="mt-4 text-sm text-red-600">{errorMessage}</p>
            )}

            {message && (
              <p className="mt-4 text-sm text-green-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-all duration-200 hover:bg-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar orçamento"}
            </button>
          </div>
        </aside>
      </form>
    </section>
  );
}