import { useState } from "react";
import DigitPickerModal from "./DigitPickerModal";

export default function RoundsField({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="time-field">
        <span className="time-field-label">Повторений</span>
        <button
          type="button"
          className="time-field-value"
          onClick={() => setOpen(true)}
        >
          {value > 0 ? value : "—"}
        </button>
      </div>

      {open && (
        <DigitPickerModal
          title="Повторений"
          groups={[{ label: "повт", digits: [9, 9] }]}
          initialValue={value}
          min={1}
          onSave={(v) => {
            onChange(v);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
