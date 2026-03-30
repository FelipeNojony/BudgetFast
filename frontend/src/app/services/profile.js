import { apiRequest } from "./api";

export async function getProfile() {
  return apiRequest("/profile");
}

export async function createProfile(profileData) {
  return apiRequest("/profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
}

export async function updateProfile(profileData) {
  return apiRequest("/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });
}