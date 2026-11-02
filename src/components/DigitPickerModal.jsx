import { useState, useEffect } from "react";

const clampDigit = (v, max) => Math.max(0, Math.min(max, v));

export default function DigitPickerModal({
  title,
  groups,
  initialValue,
  onSave,
  onClose,
  min = 0,
}) {
  const limits = groups.flatMap((g) => g.digits);

  const buildDigits = () => {
    if (groups.length === 2 && groups[0].label === "мин") {
      const m = Math.floor(initialValue / 60);
      const s = initialValue % 60;
      return [
        Math.min(5, Math.floor(m / 10)),
        m % 10,
        Math.min(5, Math.floor(s / 10)),
        s % 10,
      ];
    }

    let remaining = initialValue;
    const result = [];
    for (let i = limits.length - 1; i >= 0; i--) {
      const base = limits[i] + 1;
      const digit = remaining % base;
      remaining = Math.floor(remaining / base);
      result[i] = Math.min(digit, limits[i]);
    }
    return result;
  };

  const [digits, setDigits] = useState(buildDigits);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const setDigit = (index, value) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clampDigit(value, limits[index]);
      return next;
    });
  };

  const inc = (index) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = next[index] + 1;
      if (next[index] > limits[index]) next[index] = 0;
      return next;
    });
  };

  const dec = (index) => {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = next[index] - 1;
      if (next[index] < 0) next[index] = limits[index];
      return next;
    });
  };

  const computeTotal = () => {
    if (groups.length === 2 && groups[0].label === "мин") {
      const m = digits[0] * 10 + digits[1];
      const s = digits[2] * 10 + digits[3];
      return m * 60 + s;
    }
    const bases = limits.map((l) => l + 1);
    const weights = [];
    let w = 1;
    for (let i = bases.length - 1; i >= 0; i--) {
      weights[i] = w;
      w *= bases[i];
    }
    return digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  };

  const total = computeTotal();

  const handleSave = () => {
    onSave(Math.max(min, total));
  };

  const groupOffsets = [];
  {
    let offset = 0;
    for (const g of groups) {
      groupOffsets.push(offset);
      offset += g.digits.length;
    }
  }

  const digitLabel = (groupLabel, di) => {
    if (groupLabel === "мин") {
      return di === 0 ? "Десятки минут" : "Минуты";
    }
    if (groupLabel === "сек") {
      return di === 0 ? "Десятки секунд" : "Секунды";
    }
    return `${groupLabel}: цифра ${di + 1}`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
          }
        }}
      >
        <h3 className="modal-title">{title}</h3>

        <div className="digit-picker">
          {groups.map((group, gi) => {
            const groupOffset = groupOffsets[gi];
            const groupDigits = digits.slice(
              groupOffset,
              groupOffset + group.digits.length,
            );

            return (
              <div key={gi} style={{ display: "contents" }}>
                {gi > 0 && groups.length > 1 && (
                  <span className="digit-sep">:</span>
                )}
                <div className="digit-group">
                  <div className="digit-row">
                    {groupDigits.map((_, di) => (
                      <button
                        key={`inc-${di}`}
                        type="button"
                        className="digit-btn"
                        onClick={() => inc(groupOffset + di)}
                        aria-label={`Плюс ${digitLabel(group.label, di)}`}
                      >
                        +
                      </button>
                    ))}
                  </div>

                  <div className="digit-row digit-values">
                    {groupDigits.map((val, di) => (
                      <input
                        key={`val-${di}`}
                        type="text"
                        inputMode="numeric"
                        className="digit-input"
                        value={val}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          setDigit(
                            groupOffset + di,
                            raw === "" ? 0 : Number(raw),
                          );
                        }}
                        autoFocus={gi === 0 && di === 0}
                        aria-label={digitLabel(group.label, di)}
                      />
                    ))}
                  </div>

                  <div className="digit-row">
                    {groupDigits.map((_, di) => (
                      <button
                        key={`dec-${di}`}
                        type="button"
                        className="digit-btn"
                        onClick={() => dec(groupOffset + di)}
                        aria-label={`Минус ${digitLabel(group.label, di)}`}
                      >
                        −
                      </button>
                    ))}
                  </div>

                  <span className="digit-unit">{group.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-total">
          Итого: <strong>{formatTotal(total, groups)}</strong>
        </div>

        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Отмена
          </button>
          <button type="button" className="btn primary" onClick={handleSave}>
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTotal(total, groups) {
  if (groups.length === 2 && groups[0].label === "мин") {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}с`;
  }
  return String(total);
}
