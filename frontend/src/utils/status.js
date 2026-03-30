export function getStatusLabel(status) {
  const map = {
    draft: "Rascunho",
    sent: "Enviado",
    approved: "Aprovado",
    rejected: "Recusado",
    expired: "Expirado",
  };

  return map[status] || status;
}

export function getStatusColor(status) {
  const map = {
    draft: "bg-gray-100 text-gray-700",
    sent: "bg-blue-100 text-blue-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    expired: "bg-yellow-100 text-yellow-700",
  };

  return map[status] || "bg-gray-100 text-gray-700";
}