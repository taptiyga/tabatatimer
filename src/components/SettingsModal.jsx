import { useState } from "react";

export default function SettingsModal({
  soundEnabled,
  onToggleSound,
  onExport,
  onImport,
  onClose,
}) {
  const [importError, setImportError] = useState("");

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = "";
    setImportError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.exercises || !data.workouts) {
          setImportError("Неверный формат файла");
          return;
        }
        if (window.confirm("Импорт заменит все текущие данные. Продолжить?")) {
          onImport(data);
          onClose();
        }
      } catch {
        setImportError("Не удалось прочитать файл");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">⚙ Настройки</h3>

        <div className="settings-list">
          <div className="settings-row">
            <span className="settings-label">Звук</span>
            <button
              type="button"
              className={`btn ${soundEnabled ? "primary" : ""}`}
              onClick={onToggleSound}
            >
              {soundEnabled ? "🔊 Вкл" : "🔇 Выкл"}
            </button>
          </div>

          <div className="settings-row">
            <span className="settings-label">Резервная копия</span>
            <button type="button" className="btn" onClick={onExport}>
              📥 Экспорт
            </button>
          </div>

          <div className="settings-row">
            <span className="settings-label">Восстановить</span>
            <label className="btn">
              📤 Импорт
              <input
                type="file"
                accept=".json"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </label>
          </div>

          {importError && <p className="settings-error">{importError}</p>}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn primary" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
