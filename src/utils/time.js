export function formatMsCompactRu(ms) {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  if (hours > 0) {
    return `${hours}ч ${minutes}м`;
  }
  if (minutes > 0) {
    return `${minutes}м ${seconds}с`;
  }
  return `${seconds}с`;
}

export function formatProgressPercent(progress) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)));
  return `${pct}%`;
}

