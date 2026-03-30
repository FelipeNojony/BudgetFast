import { supabaseAdmin } from "../lib/supabase.js";

export async function getProfile(request, reply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return reply.send(data || null);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);

    return reply.status(500).send({
      message: "Erro ao buscar perfil.",
    });
  }
}

export async function createProfile(request, reply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const {
      full_name,
      business_name,
      email,
      phone,
      primary_color,
    } = request.body;

    const { data: existingProfile, error: existingProfileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingProfileError) {
      throw existingProfileError;
    }

    if (existingProfile) {
      return reply.status(409).send({
        message: "Perfil já existe para este usuário.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        user_id: userId,
        full_name,
        business_name,
        email,
        phone,
        primary_color: primary_color || "#0f172a",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return reply.status(201).send(data);
  } catch (error) {
    console.error("Erro ao criar perfil:", error);

    return reply.status(500).send({
      message: "Erro ao criar perfil.",
    });
  }
}

export async function updateProfile(request, reply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const {
      full_name,
      business_name,
      email,
      phone,
      primary_color,
    } = request.body;

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name,
        business_name,
        email,
        phone,
        primary_color: primary_color || "#0f172a",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return reply.send(data);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);

    return reply.status(500).send({
      message: "Erro ao atualizar perfil.",
    });
  }
}