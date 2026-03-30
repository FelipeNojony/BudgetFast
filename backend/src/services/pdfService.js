import puppeteer from "puppeteer";

function formatCurrency(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value) {
  if (!value) return "-";

  try {
    return new Date(`${value}T00:00:00`).toLocaleDateString("pt-BR");
  } catch {
    return value;
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildBudgetHtml({ budget, profile }) {
  const primaryColor = profile?.primary_color || "#f66504";
  const businessName = profile?.business_name || "OrçaPro";
  const responsibleName = profile?.full_name || "";
  const businessEmail = profile?.email || "";
  const businessPhone = profile?.phone || "";

  const itemsRows = (budget.items || [])
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.title)}</td>
          <td>${escapeHtml(item.description || "-")}</td>
          <td style="text-align:center;">${Number(item.quantity || 0)}</td>
          <td style="text-align:right;">${formatCurrency(item.unit_price)}</td>
          <td style="text-align:right;">${formatCurrency(item.total_price)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Orçamento ${escapeHtml(budget.budget_number || "")}</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            color: #0f172a;
            margin: 0;
            padding: 32px;
            background: #ffffff;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid ${primaryColor};
            padding-bottom: 20px;
            margin-bottom: 28px;
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

          .doc-title {
            text-align: right;
          }

          .doc-title h2 {
            margin: 0;
            font-size: 24px;
            color: #0f172a;
          }

          .doc-title p {
            margin: 6px 0 0;
            color: #475569;
            font-size: 14px;
          }

          .section {
            margin-bottom: 24px;
          }

          .section-title {
            margin: 0 0 12px;
            font-size: 16px;
            color: ${primaryColor};
            border-left: 4px solid ${primaryColor};
            padding-left: 10px;
          }

          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px 24px;
          }

          .field {
            font-size: 14px;
          }

          .field strong {
            display: block;
            color: #334155;
            margin-bottom: 4px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          thead {
            background: #f8fafc;
          }

          th, td {
            border: 1px solid #e2e8f0;
            padding: 10px;
            font-size: 13px;
            vertical-align: top;
          }

          th {
            text-align: left;
            color: #334155;
          }

          .totals {
            margin-top: 18px;
            margin-left: auto;
            width: 320px;
          }

          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
          }

          .totals-row.total {
            font-size: 18px;
            font-weight: bold;
            color: ${primaryColor};
            border-bottom: none;
            padding-top: 14px;
          }

          .notes {
            margin-top: 16px;
            font-size: 14px;
            color: #334155;
            background: #f8fafc;
            padding: 14px;
            border-radius: 12px;
          }

          .footer {
            margin-top: 36px;
            padding-top: 16px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <h1>${escapeHtml(businessName)}</h1>
            <p>${escapeHtml(responsibleName)}</p>
            <p>${escapeHtml(businessEmail)}</p>
            <p>${escapeHtml(businessPhone)}</p>
          </div>

          <div class="doc-title">
            <h2>Orçamento</h2>
            <p>Nº ${escapeHtml(budget.budget_number || "-")}</p>
            <p>Emitido em ${formatDate(budget.issue_date)}</p>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Dados do cliente</h3>
          <div class="grid">
            <div class="field">
              <strong>Cliente</strong>
              <span>${escapeHtml(budget.client_name || "-")}</span>
            </div>

            <div class="field">
              <strong>Empresa</strong>
              <span>${escapeHtml(budget.client_company || "-")}</span>
            </div>

            <div class="field">
              <strong>E-mail</strong>
              <span>${escapeHtml(budget.client_email || "-")}</span>
            </div>

            <div class="field">
              <strong>Telefone</strong>
              <span>${escapeHtml(budget.client_phone || "-")}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Informações do orçamento</h3>
          <div class="grid">
            <div class="field">
              <strong>Validade</strong>
              <span>${formatDate(budget.valid_until)}</span>
            </div>

            <div class="field">
              <strong>Prazo de entrega</strong>
              <span>${escapeHtml(budget.delivery_time || "-")}</span>
            </div>

            <div class="field">
              <strong>Forma de pagamento</strong>
              <span>${escapeHtml(budget.payment_terms || "-")}</span>
            </div>

            <div class="field">
              <strong>Status</strong>
              <span>${escapeHtml(budget.status || "-")}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Itens</h3>

          <table>
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Descrição</th>
                <th>Qtd.</th>
                <th>Valor unitário</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal</span>
              <span>${formatCurrency(budget.subtotal)}</span>
            </div>

            <div class="totals-row">
              <span>Desconto</span>
              <span>${formatCurrency(budget.discount)}</span>
            </div>

            <div class="totals-row total">
              <span>Total</span>
              <span>${formatCurrency(budget.total)}</span>
            </div>
          </div>
        </div>

        ${
          budget.notes
            ? `
              <div class="section">
                <h3 class="section-title">Observações</h3>
                <div class="notes">
                  ${escapeHtml(budget.notes)}
                </div>
              </div>
            `
            : ""
        }

        <div class="footer">
          Documento gerado pelo OrçaPro
        </div>
      </body>
    </html>
  `;
}

export async function generateBudgetPdf(payload) {
  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();
    const html = buildBudgetHtml(payload);

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