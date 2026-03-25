import {
  getBudgetsByUserId,
  getBudgetByIdAndUserId,
  createBudgetWithItems,
  updateBudgetWithItems,
  deleteBudgetByIdAndUserId,
} from "../services/budgetService.js";
import { calculateBudgetTotals } from "../utils/budgetCalculations.js";
import { getProfileByUserId } from "../services/profileService.js";
import { generateBudgetPdf } from "../services/pdfService.js";

function generateBudgetNumber() {
  const timestamp = Date.now().toString().slice(-6);
  const year = new Date().getFullYear();
  return `ORC-${year}-${timestamp}`;
}

export async function getBudgets(request, reply) {
  try {
    const userId = request.user.id;
    const budgets = await getBudgetsByUserId(userId);

    return reply.send(budgets);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao listar orçamentos.",
      error: error.message,
    });
  }
}

export async function getBudgetById(request, reply) {
  try {
    const userId = request.user.id;
    const { id } = request.params;

    const budget = await getBudgetByIdAndUserId(id, userId);

    return reply.send(budget);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao buscar orçamento.",
      error: error.message,
    });
  }
}

export async function createBudget(request, reply) {
  try {
    const userId = request.user.id;

    const {
      client_name,
      client_email,
      client_phone,
      client_company,
      issue_date,
      valid_until,
      delivery_time,
      payment_terms,
      notes,
      discount,
      status,
      items = [],
    } = request.body;

    if (!client_name) {
      return reply.status(400).send({
        message: "Nome do cliente é obrigatório.",
      });
    }

    if (!issue_date) {
      return reply.status(400).send({
        message: "Data de emissão é obrigatória.",
      });
    }

    if (!items.length) {
      return reply.status(400).send({
        message: "Adicione pelo menos um item ao orçamento.",
      });
    }

    const invalidItem = items.find((item) => !item.title);

    if (invalidItem) {
      return reply.status(400).send({
        message: "Todos os itens precisam ter um nome.",
      });
    }

    const totals = calculateBudgetTotals(items, discount);

    const budget = await createBudgetWithItems(
      {
        user_id: userId,
        budget_number: generateBudgetNumber(),
        client_name,
        client_email,
        client_phone,
        client_company,
        issue_date,
        valid_until,
        delivery_time,
        payment_terms,
        notes,
        discount: totals.discount,
        subtotal: totals.subtotal,
        total: totals.total,
        status: status || "draft",
        updated_at: new Date().toISOString(),
      },
      totals.items
    );

    return reply.status(201).send(budget);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao criar orçamento.",
      error: error.message,
    });
  }
}

export async function updateBudget(request, reply) {
  try {
    const userId = request.user.id;
    const { id } = request.params;

    const {
      client_name,
      client_email,
      client_phone,
      client_company,
      issue_date,
      valid_until,
      delivery_time,
      payment_terms,
      notes,
      discount,
      status,
      items = [],
    } = request.body;

    if (!client_name) {
      return reply.status(400).send({
        message: "Nome do cliente é obrigatório.",
      });
    }

    if (!issue_date) {
      return reply.status(400).send({
        message: "Data de emissão é obrigatória.",
      });
    }

    if (!items.length) {
      return reply.status(400).send({
        message: "Adicione pelo menos um item ao orçamento.",
      });
    }

    const invalidItem = items.find((item) => !item.title);

    if (invalidItem) {
      return reply.status(400).send({
        message: "Todos os itens precisam ter um nome.",
      });
    }

    const totals = calculateBudgetTotals(items, discount);

    const budget = await updateBudgetWithItems(
      id,
      userId,
      {
        client_name,
        client_email,
        client_phone,
        client_company,
        issue_date,
        valid_until,
        delivery_time,
        payment_terms,
        notes,
        discount: totals.discount,
        subtotal: totals.subtotal,
        total: totals.total,
        status: status || "draft",
      },
      totals.items
    );

    return reply.send(budget);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao atualizar orçamento.",
      error: error.message,
    });
  }
}



export async function deleteBudget(request, reply) {
  try {
    const userId = request.user.id;
    const { id } = request.params;

    await deleteBudgetByIdAndUserId(id, userId);

    return reply.send({
      message: "Orçamento excluído com sucesso.",
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao excluir orçamento.",
      error: error.message,
    });
  }
}

export async function downloadBudgetPdf(request, reply) {
  try {
    const userId = request.user.id;
    const { id } = request.params;

    const [profile, budget] = await Promise.all([
      getProfileByUserId(userId),
      getBudgetByIdAndUserId(id, userId),
    ]);

    const pdfBuffer = await generateBudgetPdf(profile, budget);

    reply
      .header("Content-Type", "application/pdf")
      .header(
        "Content-Disposition",
        `attachment; filename="${budget.budget_number}.pdf"`
      )
      .send(pdfBuffer);
  } catch (error) {
    return reply.status(500).send({
      message: "Erro ao gerar PDF do orçamento.",
      error: error.message,
    });
  }
}