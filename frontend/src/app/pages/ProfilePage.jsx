import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createProfile, getProfile, updateProfile } from "../services/profile";
import { formatPhone } from "../../utils/formatters";

const initialFormData = {
  full_name: "",
  business_name: "",
  email: "",
  phone: "",
  primary_color: "#0f172a",
};

export default function ProfilePage() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileExists, setProfileExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevState) => {
      if (name === "phone") {
        return {
          ...prevState,
          [name]: formatPhone(value),
        };
      }

      return {
        ...prevState,
        [name]: value,
      };
    });
  }

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setErrorMessage("");

        const profile = await getProfile();

        if (profile) {
          setFormData({
            full_name: profile.full_name || "",
            business_name: profile.business_name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            primary_color: profile.primary_color || "#0f172a",
          });

          setProfileExists(true);
        } else {
          setFormData(initialFormData);
          setProfileExists(false);
        }
      } catch (error) {
        setErrorMessage(error.message || "Erro ao carregar perfil.");
        toast.error("Erro ao carregar perfil.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (profileExists) {
        await updateProfile(formData);
        setSuccessMessage("Perfil atualizado com sucesso.");
        toast.success("Perfil atualizado com sucesso!");
      } else {
        await createProfile(formData);
        setProfileExists(true);
        setSuccessMessage("Perfil criado com sucesso.");
        toast.success("Perfil criado com sucesso!");
      }
    } catch (error) {
      setErrorMessage(error.message || "Erro ao salvar perfil.");
      toast.error("Erro ao salvar perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <section className="text-slate-900">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-slate-600">Carregando perfil...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="text-slate-900">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <span className="inline-flex rounded-full border border-[#ffd6bf] bg-[#fff3eb] px-3 py-1 text-xs text-[#f66504]">
          Meu negócio
        </span>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
          Perfil da empresa
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Configure os dados principais do seu negócio no OrçaPro.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-900">
            Informações principais
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
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
                placeholder="Nome da empresa"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-[#f66504] focus:ring-4 focus:ring-[#ffd6bf]"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                E-mail
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
                Telefone
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

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cor principal
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleChange}
                  className="h-12 w-16 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
                />

                <input
                  type="text"
                  name="primary_color"
                  value={formData.primary_color}
                  onChange={handleChange}
                  placeholder="#f66504"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition-all duration-200 focus:border-[#f66504] focus:ring-4 focus:ring-[#ffd6bf]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          {errorMessage && (
            <p className="mb-4 text-sm text-red-600">{errorMessage}</p>
          )}

          {successMessage && (
            <p className="mb-4 text-sm text-green-600">{successMessage}</p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#f66504] px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-[#e15a00] active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Salvando..." : profileExists ? "Salvar alterações" : "Criar perfil"}
            </button>
          </div>
        </section>
      </form>
    </section>
  );
}