export function formatMoney(rub) {
  try {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(rub);
  } catch (e) {
    return `${Math.round(rub)} ₽`;
  }
}

