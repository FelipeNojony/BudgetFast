import {
  getBudgetsByUserId,
  getBudgetByIdAndUserId,
  createBudgetWithItems,
  updateBudgetWithItems,
  deleteBudgetByIdAndUserId,
} from "../services/budgetService.js";
import { getProfileByUserId } from "../services/profileService.js";
import { generateBudgetPdf } from "../services/pdfService.js";

function generateBudgetNumber() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");

  return `ORC-${year}${month}${day}-${hour}${minute}${second}`;
}

export async function createBudget(request, reply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const {
      items = [],
      client_name,
      client_email,
      client_phone,
      client_company,
      client_document,
      issue_date,
      valid_until,
      delivery_time,
      payment_terms,
      service_description,
      subtotal,
      discount,
      total,
      notes,
      status,
    } = request.body;

    if (!Array.isArray(items) || items.length === 0) {
      return reply.status(400).send({
        message: "Informe ao menos um item no orçamento.",
      });
    }

    const budgetData = {
      user_id: userId,
      budget_number: generateBudgetNumber(),
      client_name,
      client_email,
      client_phone,
      client_company,
      client_document,
      issue_date: issue_date || new Date().toISOString().split("T")[0],
      valid_until,
      delivery_time,
      payment_terms,
      service_description,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      total: Number(total) || 0,
      notes,
      status: status || "draft",
    };

    const budget = await createBudgetWithItems(budgetData, items);

    return reply.status(201).send(budget);
  } catch (error) {
    console.error("Erro ao criar orçamento:", error);

    return reply.status(500).send({
      message: "Erro ao criar orçamento.",
    });
  }
}

export async function getBudgets(request, reply) {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const budgets = await getBudgetsByUserId(userId);

    return reply.send(budgets);
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error);

    return reply.status(500).send({
      message: "Erro ao buscar orçamentos.",
    });
  }
}

export async function getBudgetById(request, reply) {
  try {
    const userId = request.user?.id;
    const { id } = request.params;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const budget = await getBudgetByIdAndUserId(id, userId);

    if (!budget) {
      return reply.status(404).send({
        message: "Orçamento não encontrado.",
      });
    }

    return reply.send(budget);
  } catch (error) {
    console.error("Erro ao buscar orçamento:", error);

    return reply.status(500).send({
      message: "Erro ao buscar orçamento.",
    });
  }
}

export async function updateBudget(request, reply) {
  try {
    const userId = request.user?.id;
    const { id } = request.params;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const existingBudget = await getBudgetByIdAndUserId(id, userId);

    if (!existingBudget) {
      return reply.status(404).send({
        message: "Orçamento não encontrado.",
      });
    }

    const {
      items = [],
      client_name,
      client_email,
      client_phone,
      client_company,
      client_document,
      issue_date,
      valid_until,
      delivery_time,
      payment_terms,
      service_description,
      subtotal,
      discount,
      total,
      notes,
      status,
    } = request.body;

    if (!Array.isArray(items) || items.length === 0) {
      return reply.status(400).send({
        message: "Informe ao menos um item no orçamento.",
      });
    }

    const budgetData = {
      client_name,
      client_email,
      client_phone,
      client_company,
      client_document,
      issue_date,
      valid_until,
      delivery_time,
      payment_terms,
      service_description,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      total: Number(total) || 0,
      notes,
      status: status || existingBudget.status || "draft",
    };

    const updatedBudget = await updateBudgetWithItems(
      id,
      userId,
      budgetData,
      items
    );

    return reply.send(updatedBudget);
  } catch (error) {
    console.error("Erro ao atualizar orçamento:", error);

    return reply.status(500).send({
      message: "Erro ao atualizar orçamento.",
    });
  }
}

export async function deleteBudget(request, reply) {
  try {
    const userId = request.user?.id;
    const { id } = request.params;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const existingBudget = await getBudgetByIdAndUserId(id, userId);

    if (!existingBudget) {
      return reply.status(404).send({
        message: "Orçamento não encontrado.",
      });
    }

    await deleteBudgetByIdAndUserId(id, userId);

    return reply.status(200).send({
      message: "Orçamento excluído com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir orçamento:", error);

    return reply.status(500).send({
      message: "Erro ao excluir orçamento.",
    });
  }
}

export async function downloadBudgetPdf(request, reply) {
  try {
    const userId = request.user?.id;
    const { id } = request.params;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const budget = await getBudgetByIdAndUserId(id, userId);

    if (!budget) {
      return reply.status(404).send({
        message: "Orçamento não encontrado.",
      });
    }

    const profile = await getProfileByUserId(userId);

    const pdfBuffer = await generateBudgetPdf({
      budget,
      profile,
    });

    reply
      .header("Content-Type", "application/pdf")
      .header("Content-Disposition", `attachment; filename=orcamento-${id}.pdf`);

    return reply.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar PDF do orçamento:", error);

    return reply.status(500).send({
      message: "Erro ao gerar PDF do orçamento.",
    });
  }
}

export async function duplicateBudget(request, reply) {
  try {
    const userId = request.user?.id;
    const { id } = request.params;

    if (!userId) {
      return reply.status(401).send({
        message: "Usuário não autenticado.",
      });
    }

    const budget = await getBudgetByIdAndUserId(id, userId);

    if (!budget) {
      return reply.status(404).send({
        message: "Orçamento não encontrado.",
      });
    }

    const { items = [], ...budgetData } = budget;

    const newBudget = await createBudgetWithItems(
      {
        ...budgetData,
        id: undefined,
        created_at: undefined,
        updated_at: undefined,
        user_id: userId,
        budget_number: generateBudgetNumber(),
        issue_date: new Date().toISOString().split("T")[0],
        status: "draft",
      },
      items
    );

    return reply.status(201).send(newBudget);
  } catch (error) {
    console.error("Erro ao duplicar orçamento:", error);

    return reply.status(500).send({
      message: "Erro ao duplicar orçamento.",
    });
  }
}