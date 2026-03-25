import puppeteer from "puppeteer";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("pt-BR");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildBudgetPdfHtml(profile, budget) {
  const primaryColor = profile?.primary_color || "#0f172a";
  const businessName = profile?.business_name || "Seu Negócio";
  const fullName = profile?.full_name || "";
  const email = profile?.email || "";
  const phone = profile?.phone || "";

  const itemsRows = (budget.items || [])
    .map(
      (item) => `
        <tr>
          <td>
            <strong>${escapeHtml(item.title)}</strong>
            <div class="item-description">${escapeHtml(item.description || "")}</div>
          </td>
          <td class="text-center">${Number(item.quantity || 0)}</td>
          <td class="text-right">${formatCurrency(item.unit_price)}</td>
          <td class="text-right">${formatCurrency(item.total_price)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Orçamento ${escapeHtml(budget.budget_number)}</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
            background: #ffffff;
            padding: 32px;
          }

          .container {
            max-width: 900px;
            margin: 0 auto;
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            align-items: flex-start;
            padding-bottom: 24px;
            border-bottom: 3px solid ${primaryColor};
          }

          .brand h1 {
            margin: 0;
            font-size: 28px;
            color: ${primaryColor};
          }

          .brand p {
            margin: 6px 0 0;
            color: #475569;
            font-size: 14px;
          }

          .document-title {
            text-align: right;
          }

          .document-title h2 {
            margin: 0;
            font-size: 24px;
            color: #111827;
          }

          .document-title p {
            margin: 6px 0 0;
            color: #475569;
            font-size: 14px;
          }

          .section {
            margin-top: 28px;
          }

          .section-title {
            margin: 0 0 12px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: ${primaryColor};
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 16px;
          }

          .card p {
            margin: 0 0 8px;
            font-size: 14px;
            color: #334155;
          }

          .card p:last-child {
            margin-bottom: 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
          }

          thead {
            background: #f1f5f9;
          }

          th, td {
            padding: 12px 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
            vertical-align: top;
          }

          th {
            text-align: left;
            color: #334155;
          }

          .text-right {
            text-align: right;
          }

          .text-center {
            text-align: center;
          }

          .item-description {
            margin-top: 4px;
            color: #64748b;
            font-size: 12px;
          }

          .summary {
            margin-top: 24px;
            margin-left: auto;
            width: 320px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 16px;
            font-size: 14px;
            background: #ffffff;
            border-bottom: 1px solid #e2e8f0;
          }

          .summary-row:last-child {
            border-bottom: none;
          }

          .summary-row.total {
            background: ${primaryColor};
            color: white;
            font-weight: bold;
            font-size: 16px;
          }

          .notes {
            white-space: pre-wrap;
            font-size: 14px;
            color: #334155;
            line-height: 1.6;
          }

          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header class="header">
            <div class="brand">
              <h1>${escapeHtml(businessName)}</h1>
              ${fullName ? `<p>${escapeHtml(fullName)}</p>` : ""}
              ${email ? `<p>${escapeHtml(email)}</p>` : ""}
              ${phone ? `<p>${escapeHtml(phone)}</p>` : ""}
            </div>

            <div class="document-title">
              <h2>Orçamento</h2>
              <p><strong>Número:</strong> ${escapeHtml(budget.budget_number)}</p>
              <p><strong>Emissão:</strong> ${formatDate(budget.issue_date)}</p>
              <p><strong>Validade:</strong> ${formatDate(budget.valid_until)}</p>
            </div>
          </header>

          <section class="section">
            <h3 class="section-title">Cliente</h3>
            <div class="grid">
              <div class="card">
                <p><strong>Nome:</strong> ${escapeHtml(budget.client_name)}</p>
                <p><strong>E-mail:</strong> ${escapeHtml(budget.client_email || "-")}</p>
                <p><strong>Telefone:</strong> ${escapeHtml(budget.client_phone || "-")}</p>
                <p><strong>Empresa:</strong> ${escapeHtml(budget.client_company || "-")}</p>
              </div>

              <div class="card">
                <p><strong>Prazo de entrega:</strong> ${escapeHtml(budget.delivery_time || "-")}</p>
                <p><strong>Forma de pagamento:</strong> ${escapeHtml(budget.payment_terms || "-")}</p>
                <p><strong>Status:</strong> ${budget.status === "finalized" ? "Finalizado" : "Rascunho"}</p>
              </div>
            </div>
          </section>

          <section class="section">
            <h3 class="section-title">Itens do orçamento</h3>
            <table>
              <thead>
                <tr>
                  <th>Serviço</th>
                  <th class="text-center">Qtd</th>
                  <th class="text-right">Valor unitário</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${formatCurrency(budget.subtotal)}</span>
              </div>
              <div class="summary-row">
                <span>Desconto</span>
                <span>${formatCurrency(budget.discount)}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>${formatCurrency(budget.total)}</span>
              </div>
            </div>
          </section>

          <section class="section">
            <h3 class="section-title">Observações</h3>
            <div class="card">
              <div class="notes">${escapeHtml(budget.notes || "Nenhuma observação informada.")}</div>
            </div>
          </section>

          <footer class="footer">
            Documento gerado automaticamente pelo BudgetFast.
          </footer>
        </div>
      </body>
    </html>
  `;
}

export async function generateBudgetPdf(profile, budget) {
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    const html = buildBudgetPdfHtml(profile, budget);

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20px",
        right: "20px",
        bottom: "20px",
        left: "20px",
      },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}