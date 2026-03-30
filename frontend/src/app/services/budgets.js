import { apiRequest } from "./api";

export async function createBudget(budgetData) {
  return apiRequest("/budgets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budgetData),
  });
}

export async function getBudgets(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  });

  const queryString = params.toString();
  const path = queryString ? `/budgets?${queryString}` : "/budgets";

  return apiRequest(path);
}

export async function getBudgetById(id) {
  return apiRequest(`/budgets/${id}`);
}

export async function updateBudget(id, budgetData) {
  return apiRequest(`/budgets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(budgetData),
  });
}

export async function deleteBudget(id) {
  return apiRequest(`/budgets/${id}`, {
    method: "DELETE",
  });
}

export async function duplicateBudget(id) {
  return apiRequest(`/budgets/${id}/duplicate`, {
    method: "POST",
  });
}

export async function downloadBudgetPdf(id) {
  const blob = await apiRequest(`/budgets/${id}/pdf`, {
    method: "GET",
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `orcamento-${id}.pdf`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}