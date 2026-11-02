// Разбор секунд на минуты и секунды с защитой от отрицательных/NaN
const splitTime = (sec) => {
  const safe = Math.max(0, Math.floor(sec || 0));
  return { m: Math.floor(safe / 60), s: safe % 60 };
};

// Форматирование в «M:SS» для таймера (всегда с нулями)
export const fmtClock = (sec) => {
  const { m, s } = splitTime(sec);
  return `${m}:${String(s).padStart(2, "0")}`;
};

// Форматирование для бейджей: «30с» или «1:30»
export const fmtShort = (sec) => {
  const { m, s } = splitTime(sec);
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}с`;
};
