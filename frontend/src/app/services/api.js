import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL não configurada.");
}

async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token ?? null;
}

async function buildHeaders(customHeaders = {}) {
  const token = await getAccessToken();

  const headers = {
    ...customHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    headers: customHeaders = {},
    body,
    responseType = "json",
  } = options;

  const headers = await buildHeaders(customHeaders);

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body,
  });

  if (!response.ok) {
    let message = "Erro na requisição.";

    try {
      const errorData = await response.json();
      message = errorData.message || errorData.error || message;
    } catch {
      message = `Erro na requisição (${response.status}).`;
    }

    throw new Error(message);
  }

  if (responseType === "blob") {
    return response.blob();
  }

  if (responseType === "text") {
    return response.text();
  }

  if (responseType === "raw") {
    return response;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response;
}