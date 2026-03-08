export const formatCurrency = (value) =>
  new Intl.NumberFormat("uz-UZ", {
    style: "currency",
    currency: "UZS",
    maximumFractionDigits: 0,
  }).format(value || 0);
