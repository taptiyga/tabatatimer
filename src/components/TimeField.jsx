import { useState } from "react";
import TimePickerModal from "./TimePickerModal";
import { fmtShort } from "../utils/format";

export default function TimeField({ label, value, onChange, min = 0 }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="time-field">
        <span className="time-field-label">{label}</span>
        <button
          type="button"
          className="time-field-value"
          onClick={() => setOpen(true)}
        >
          {value > 0 ? fmtShort(value) : "—"}
        </button>
      </div>

      {open && (
        <TimePickerModal
          label={label}
          initialSeconds={value}
          min={min}
          onSave={(seconds) => {
            onChange(seconds);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
