import { supabase } from "../lib/supabase";

const API_URL = "http://localhost:3333";

async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session?.access_token;
}

export async function createBudget(budgetData) {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/budgets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(budgetData),
  });

  if (!response.ok) {
    let errorMessage = "Erro ao criar orçamento.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status} ao criar orçamento.`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function getBudgets() {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/budgets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar orçamentos.");
  }

  return response.json();
}

export async function getBudgetById(id) {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/budgets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar orçamento.");
  }

  return response.json();
}

export async function updateBudget(id, budgetData) {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/budgets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(budgetData),
  });

  if (!response.ok) {
    let errorMessage = "Erro ao atualizar orçamento.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status} ao atualizar orçamento.`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function deleteBudget(id) {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/budgets/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Erro ao excluir orçamento.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status} ao excluir orçamento.`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function downloadBudgetPdf(id) {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/budgets/${id}/pdf`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errorMessage = "Erro ao baixar PDF.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status} ao baixar PDF.`;
    }

    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `orcamento-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}