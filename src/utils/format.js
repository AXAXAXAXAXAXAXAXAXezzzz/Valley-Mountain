export const formatCurrency = (value) => {
  const numeric = Number(value) || 0;
  const amount = numeric * 1000;
  const formatted = new Intl.NumberFormat("ru-RU", {
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\u00A0/g, " ");
  return `${formatted} UZS`;
};
