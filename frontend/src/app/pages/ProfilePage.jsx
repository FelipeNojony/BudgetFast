import { useEffect, useState } from "react";
import { getProfile, createProfile, updateProfile } from "../services/profile";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    full_name: "",
    business_name: "",
    email: "",
    phone: "",
    primary_color: "#0f172a",
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
      [name]: value,
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
          primary_color: data.primary_color || "#0f172a",
        });
        setProfileExists(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
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
      } else {
        await createProfile(formData);
        setProfileExists(true);
        setMessage("Perfil criado com sucesso.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p>Carregando perfil...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Perfil profissional</h1>
          <p className="text-slate-400 mt-2">
            Esses dados serão usados nos seus orçamentos.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Nome completo
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Nome do negócio
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="Ex: Studio Criativo"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                E-mail profissional
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="contato@empresa.com"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                WhatsApp
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label className="block mb-2 text-sm text-slate-300">
                Cor principal
              </label>
              <input
                type="color"
                name="primary_color"
                value={formData.primary_color}
                onChange={handleChange}
                className="h-12 w-24 rounded-lg border border-slate-700 bg-slate-800"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-400">{errorMessage}</p>
            )}

            {message && (
              <p className="text-sm text-green-400">{message}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {saving ? "Salvando..." : "Salvar perfil"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}