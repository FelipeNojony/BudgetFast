import { supabaseAdmin } from "../lib/supabase.js";

export async function getProfileByUserId(userId) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function createProfile(profileData) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .insert(profileData)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateProfileByUserId(userId, profileData) {
  const payload = {
    ...profileData,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(payload)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}