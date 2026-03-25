import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBudgetById, updateBudget } from "../services/budgets";

const initialItem = {
  title: "",
  description: "",
  quantity: 1,
  unit_price: 0,
};

export default function EditBudgetPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    client_company: "",
    issue_date: "",
    valid_until: "",
    delivery_time: "",
    payment_terms: "",
    notes: "",
    discount: 0,
    status: "draft",
  });

  const [items, setItems] = useState([{ ...initialItem }]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBudget() {
      try {
        const data = await getBudgetById(id);

        setFormData({
          client_name: data.client_name || "",
          client_email: data.client_email || "",
          client_phone: data.client_phone || "",
          client_company: data.client_company || "",
          issue_date: data.issue_date || "",
          valid_until: data.valid_until || "",
          delivery_time: data.delivery_time || "",
          payment_terms: data.payment_terms || "",
          notes: data.notes || "",
          discount: Number(data.discount) || 0,
          status: data.status || "draft",
        });

        setItems(
          data.items?.length
            ? data.items.map((item) => ({
                title: item.title || "",
                description: item.description || "",
                quantity: Number(item.quantity) || 1,
                unit_price: Number(item.unit_price) || 0,
              }))
            : [{ ...initialItem }]
        );
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadBudget();
  }, [id]);

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
      await updateBudget(id, {
        ...formData,
        discount: Number(formData.discount) || 0,
        items,
      });

      setMessage("Orçamento atualizado com sucesso.");

      setTimeout(() => {
        navigate(`/orcamentos/${id}`);
      }, 1000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Carregando orçamento...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Editar orçamento</h1>
          <p className="text-slate-400 mt-2">
            Atualize os dados e os itens do orçamento.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold mb-4">Dados do cliente</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm text-slate-300">
                    Nome do cliente
                  </label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="client_email"
                    value={formData.client_email}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Telefone
                  </label>
                  <input
                    type="text"
                    name="client_phone"
                    value={formData.client_phone}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm text-slate-300">
                    Empresa
                  </label>
                  <input
                    type="text"
                    name="client_company"
                    value={formData.client_company}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold mb-4">Dados do orçamento</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Data de emissão
                  </label>
                  <input
                    type="date"
                    name="issue_date"
                    value={formData.issue_date}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Validade
                  </label>
                  <input
                    type="date"
                    name="valid_until"
                    value={formData.valid_until}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Prazo de entrega
                  </label>
                  <input
                    type="text"
                    name="delivery_time"
                    value={formData.delivery_time}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Forma de pagamento
                  </label>
                  <input
                    type="text"
                    name="payment_terms"
                    value={formData.payment_terms}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Desconto
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="discount"
                    value={formData.discount}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  >
                    <option value="draft">Rascunho</option>
                    <option value="finalized">Finalizado</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-sm text-slate-300">
                    Observações
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows="4"
                    className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Itens do orçamento</h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="rounded-xl bg-white text-slate-950 px-4 py-2 font-semibold hover:opacity-90 transition"
                >
                  Adicionar item
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="block mb-2 text-sm text-slate-300">
                          Nome do serviço
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(event) =>
                            handleItemChange(index, "title", event.target.value)
                          }
                          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block mb-2 text-sm text-slate-300">
                          Descrição
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(event) =>
                            handleItemChange(index, "description", event.target.value)
                          }
                          rows="3"
                          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm text-slate-300">
                          Quantidade
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.quantity}
                          onChange={(event) =>
                            handleItemChange(index, "quantity", event.target.value)
                          }
                          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm text-slate-300">
                          Valor unitário
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(event) =>
                            handleItemChange(index, "unit_price", event.target.value)
                          }
                          className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-slate-400 text-sm">
                        Total do item:{" "}
                        <span className="text-white font-semibold">
                          R$ {calculatedItems[index].total_price.toFixed(2)}
                        </span>
                      </p>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Remover
                      </button>
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
                  <span className="text-white">R$ {subtotal.toFixed(2)}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Desconto</span>
                  <span className="text-white">
                    R$ {(Number(formData.discount) || 0).toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-slate-800" />

                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>R$ {total.toFixed(2)}</span>
                </div>
              </div>

              {errorMessage && (
                <p className="text-sm text-red-400 mt-4">{errorMessage}</p>
              )}

              {message && (
                <p className="text-sm text-green-400 mt-4">{message}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full mt-6 rounded-xl bg-white text-slate-950 py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}