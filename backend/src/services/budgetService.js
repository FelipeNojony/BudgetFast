import { supabaseAdmin } from "../lib/supabase.js";

export async function getBudgetsByUserId(userId) {
  const { data, error } = await supabaseAdmin
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getBudgetByIdAndUserId(budgetId, userId) {
  const { data: budget, error: budgetError } = await supabaseAdmin
    .from("budgets")
    .select("*")
    .eq("id", budgetId)
    .eq("user_id", userId)
    .single();

  if (budgetError) {
    throw budgetError;
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("budget_items")
    .select("*")
    .eq("budget_id", budgetId)
    .order("created_at", { ascending: true });

  if (itemsError) {
    throw itemsError;
  }

  return {
    ...budget,
    items,
  };
}

export async function createBudgetWithItems(budgetData, items) {
  const { data: budget, error: budgetError } = await supabaseAdmin
    .from("budgets")
    .insert(budgetData)
    .select()
    .single();

  if (budgetError) {
    throw budgetError;
  }

  const itemsPayload = items.map((item) => ({
    budget_id: budget.id,
    title: item.title,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
  }));

  const { data: insertedItems, error: itemsError } = await supabaseAdmin
    .from("budget_items")
    .insert(itemsPayload)
    .select();

  if (itemsError) {
    throw itemsError;
  }

  return {
    ...budget,
    items: insertedItems,
  };
}

export async function updateBudgetWithItems(budgetId, userId, budgetData, items) {
  const { data: existingBudget, error: existingBudgetError } = await supabaseAdmin
    .from("budgets")
    .select("id")
    .eq("id", budgetId)
    .eq("user_id", userId)
    .single();

  if (existingBudgetError || !existingBudget) {
    throw new Error("Orçamento não encontrado.");
  }

  const { data: updatedBudget, error: budgetError } = await supabaseAdmin
    .from("budgets")
    .update({
      ...budgetData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", budgetId)
    .eq("user_id", userId)
    .select()
    .single();

  if (budgetError) {
    throw budgetError;
  }

  const { error: deleteItemsError } = await supabaseAdmin
    .from("budget_items")
    .delete()
    .eq("budget_id", budgetId);

  if (deleteItemsError) {
    throw deleteItemsError;
  }

  const itemsPayload = items.map((item) => ({
    budget_id: budgetId,
    title: item.title,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.total_price,
  }));

  const { data: insertedItems, error: insertItemsError } = await supabaseAdmin
    .from("budget_items")
    .insert(itemsPayload)
    .select();

  if (insertItemsError) {
    throw insertItemsError;
  }

  return {
    ...updatedBudget,
    items: insertedItems,
  };
}

export async function deleteBudgetByIdAndUserId(budgetId, userId) {
  const { error } = await supabaseAdmin
    .from("budgets")
    .delete()
    .eq("id", budgetId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return { success: true };
}