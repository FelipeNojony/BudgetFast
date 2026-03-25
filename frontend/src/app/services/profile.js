import { supabase } from "../lib/supabase";

const API_URL = "http://localhost:3333";

async function getAccessToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("SESSION:", session);
  return session?.access_token;
}

export async function getProfile() {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar perfil.");
  }

  return response.json();
}

export async function createProfile(profileData) {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erro ao criar perfil.");
  }

  return response.json();
}

export async function updateProfile(profileData) {
  const token = await getAccessToken();

  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    let errorMessage = "Erro ao atualizar perfil.";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status} ao atualizar perfil.`;
    }

    throw new Error(errorMessage);
  }

  return response.json();
}