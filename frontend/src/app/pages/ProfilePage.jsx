import { useEffect, useState } from "react";
import { toast } from "sonner";
import PageLoader from "../components/ui/PageLoader";
import { getProfile, createProfile, updateProfile } from "../services/profile";
import { formatPhone } from "../../utils/formatters";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    full_name: "",
    business_name: "",
    email: "",
    phone: "",
    primary_color: "#f66504",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
  const { name, value } = event.target;

  setFormData((prevState) => ({
    ...prevState,
    [name]: name === "phone" ? formatPhone(value) : value,
  }));
}

  async function loadProfile() {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getProfile();

      if (data) {
        setFormData({
          full_name: data.full_name || "",
          business_name: data.business_name || "",
          email: data.email || "",
          phone: data.phone || "",
          primary_color: data.primary_color || "#f66504",
        });
        setProfileExists(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
      toast.error("Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (profileExists) {
        await updateProfile(formData);
        setMessage("Perfil atualizado com sucesso.");
        toast.success("Perfil atualizado com sucesso.");
      } else {
        await createProfile(formData);
        setProfileExists(true);
        setMessage("Perfil criado com sucesso.");
        toast.success("Perfil criado com sucesso.");
      }
    } catch (error) {
      setErrorMessage(error.message);
      toast.error("Não foi possível salvar o perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <PageLoader message="Carregando perfil..." />;
  }

  return (
    <section className="text-slate-900">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <span className="inline-flex rounded-full border border-[#ffd6bf] bg-[#fff3eb] px-3 py-1 text-xs text-[#f66504]">
          Configuração da conta
        </span>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Perfil profissional
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Esses dados serão usados nos seus orçamentos e PDFs para deixar sua
          apresentação mais profissional.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nome completo
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-[#f66504] focus:ring-4 focus:ring-[#ffd6bf]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Nome do negócio
                </label>
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  placeholder="Ex: Studio Criativo"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-[#f66504] focus:ring-4 focus:ring-[#ffd6bf]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  E-mail profissional
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contato@empresa.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-[#f66504] focus:ring-4 focus:ring-[#ffd6bf]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  WhatsApp
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-[#f66504] focus:ring-4 focus:ring-[#ffd6bf]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Cor principal
                </label>

                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    name="primary_color"
                    value={formData.primary_color}
                    onChange={handleChange}
                    className="h-12 w-20 cursor-pointer rounded-xl border border-slate-200 bg-white"
                  />

                  <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Cor atual:{" "}
                    <span className="font-medium text-slate-900">
                      {formData.primary_color}
                    </span>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              {message && (
                <p className="text-sm text-green-600">{message}</p>
              )}

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#f66504] px-5 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#e15a00] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar perfil"}
              </button>
            </form>
          </div>
        </div>

        <aside className="lg:col-span-4">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              Preview da identidade
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Essa prévia mostra como sua marca pode aparecer nas áreas do
              sistema e nos documentos.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-sm"
                  style={{ backgroundColor: formData.primary_color }}
                >
                  {formData.business_name?.[0] || formData.full_name?.[0] || "B"}
                </div>

                <div>
                  <p className="font-semibold text-slate-900">
                    {formData.business_name || "Seu negócio"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formData.full_name || "Seu nome"}
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-medium text-slate-800">E-mail:</span>{" "}
                  {formData.email || "contato@empresa.com"}
                </p>
                <p>
                  <span className="font-medium text-slate-800">WhatsApp:</span>{" "}
                  {formData.phone || "(00) 00000-0000"}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                Dica: mantenha seus dados atualizados para que os PDFs dos seus
                orçamentos saiam com aparência mais profissional.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}