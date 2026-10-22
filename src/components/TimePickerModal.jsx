import DigitPickerModal from "./DigitPickerModal";

export default function TimePickerModal({
  label,
  initialSeconds = 0,
  min = 0,
  onSave,
  onClose,
}) {
  return (
    <DigitPickerModal
      title={label}
      groups={[
        { label: "мин", digits: [5, 9] },
        { label: "сек", digits: [5, 9] },
      ]}
      initialValue={initialSeconds}
      min={min}
      onSave={onSave}
      onClose={onClose}
    />
  );
}
