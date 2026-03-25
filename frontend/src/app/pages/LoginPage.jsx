import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    const { error } = await signIn(formData);

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/dashboard");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Entrar</h1>
        <p className="text-slate-400 mb-6">
          Faça login para acessar sua conta.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm text-slate-300">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seuemail@email.com"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm text-slate-300">Senha</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 outline-none focus:border-slate-500"
              required
            />
          </div>

          {errorMessage && (
            <p className="text-red-400 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white text-slate-950 py-3 font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-6 text-center">
          Ainda não tem conta?{" "}
          <Link
            to="/cadastro"
            className="text-white font-medium hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}