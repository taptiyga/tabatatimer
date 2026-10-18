import { useState } from "react";

/**
 * Ввод времени в формате «мин + сек».
 * value — секунды (число)
 * onChange(seconds) — новое значение в секундах
 *
 * Источник правды — value из пропсов.
 * Локальный state только для «сырого» текста во время фокуса,
 * чтобы не прыгали нули. Никакого useEffect с setState.
 */
export default function TimeInput({ value = 0, onChange, label, disabled }) {
  const [focused, setFocused] = useState(false);
  const [rawMinutes, setRawMinutes] = useState("");
  const [rawSeconds, setRawSeconds] = useState("");

  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const displayMinutes = focused
    ? rawMinutes
    : minutes === 0
      ? ""
      : String(minutes);
  const displaySeconds = focused
    ? rawSeconds
    : seconds === 0
      ? ""
      : String(seconds).padStart(2, "0");

  const onFocusMinutes = () => {
    setRawMinutes(minutes === 0 ? "" : String(minutes));
    setFocused(true);
  };

  const onFocusSeconds = () => {
    setRawSeconds(seconds === 0 ? "" : String(seconds));
    setFocused(true);
  };

  const onBlur = () => {
    setFocused(false);
    setRawMinutes("");
    setRawSeconds("");
  };

  const handleMinutes = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    setRawMinutes(raw);
    const m = raw === "" ? 0 : Number(raw);
    onChange(m * 60 + seconds);
  };

  const handleSeconds = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw === "") {
      setRawSeconds("");
      onChange(minutes * 60);
      return;
    }
    let s = Number(raw);
    if (s > 59) s = 59;
    setRawSeconds(String(s));
    onChange(minutes * 60 + s);
  };

  return (
    <div className="time-input">
      {label && <span className="time-input-label">{label}</span>}
      <div className="time-input-fields">
        <input
          type="text"
          inputMode="numeric"
          value={displayMinutes}
          placeholder="0"
          onChange={handleMinutes}
          onFocus={onFocusMinutes}
          onBlur={onBlur}
          disabled={disabled}
          aria-label="Минуты"
        />
        <span className="time-sep">:</span>
        <input
          type="text"
          inputMode="numeric"
          value={displaySeconds}
          placeholder="00"
          onChange={handleSeconds}
          onFocus={onFocusSeconds}
          onBlur={onBlur}
          disabled={disabled}
          aria-label="Секунды"
        />
      </div>
    </div>
  );
}
