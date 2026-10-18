// Форматирование секунд в «M:SS» для таймера (всегда с нулями)
export const fmtClock = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

// Форматирование для бейджей в списке: «30с» или «1:30»
export const fmtShort = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}с`;
};
