import {
  getProfileByUserId,
  createProfile,
  updateProfileByUserId,
} from "../services/profileService.js";

export async function getProfile(request, reply) {
  try {
    const userId = request.user.id;

    const profile = await getProfileByUserId(userId);

    return reply.send(profile ?? null);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao buscar perfil.",
      error: error.message,
    });
  }
}

export async function createProfileHandler(request, reply) {
  try {
    const userId = request.user.id;
    const { full_name, business_name, email, phone, primary_color } =
      request.body;

    const existingProfile = await getProfileByUserId(userId);

    if (existingProfile) {
      return reply.status(400).send({
        message: "Perfil já existe para este usuário.",
      });
    }

    const profile = await createProfile({
      user_id: userId,
      full_name,
      business_name,
      email,
      phone,
      primary_color,
    });

    return reply.status(201).send(profile);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao criar perfil.",
      error: error.message,
    });
  }
}

export async function updateProfileHandler(request, reply) {
  try {
    const userId = request.user.id;
    const { full_name, business_name, email, phone, primary_color } =
      request.body;

    console.log("Atualizando perfil do usuário:", userId);
    console.log("Dados recebidos:", {
      full_name,
      business_name,
      email,
      phone,
      primary_color,
    });

    const profile = await updateProfileByUserId(userId, {
      full_name,
      business_name,
      email,
      phone,
      primary_color,
    });

    return reply.send(profile);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);

    return reply.status(500).send({
      message: "Erro ao atualizar perfil.",
      error: error.message,
    });
  }
}