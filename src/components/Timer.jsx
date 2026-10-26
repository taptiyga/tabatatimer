import { useEffect, useRef } from "react";
import { useTimer } from "../hooks/useTimer";
import { unlockAudio } from "../utils/sounds";
import { fmtClock } from "../utils/format";

const LABELS = { prepare: "Подготовка", exercise: "Упражнение", rest: "Отдых" };
const COLORS = { prepare: "#f59e0b", exercise: "#ef4444", rest: "#10b981" };
const CIRCUMFERENCE = 2 * Math.PI * 54;

function TopBar({ onClose }) {
  return (
    <div className="timer-top" onClick={(e) => e.stopPropagation()}>
      <button
        className="timer-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose?.();
        }}
        aria-label="Закрыть таймер"
        title="Закрыть"
      >
        ✕
      </button>
    </div>
  );
}

export default function Timer({
  startSteps,
  clearStartSteps,
  soundEnabled = true,
  onClose,
}) {
  const timer = useTimer({ soundEnabled });
  const {
    currentStep,
    currentIndex,
    timeLeft,
    isRunning,
    isFinished,
    start,
    restart,
    pause,
    resume,
    skip,
    prevStep,
    totalSteps,
  } = timer;

  const lastStepsRef = useRef(null);

  useEffect(() => {
    if (startSteps && startSteps !== lastStepsRef.current) {
      lastStepsRef.current = startSteps;
      unlockAudio();
      start(startSteps);
      clearStartSteps?.();
    }
  }, [startSteps, start, clearStartSteps]);

  const togglePause = () => {
    if (isFinished) return;
    unlockAudio();
    if (isRunning) pause();
    else resume();
  };

  const progress = currentStep
    ? currentStep.duration === 0
      ? 1
      : Math.min(1, Math.max(0, 1 - timeLeft / currentStep.duration))
    : 0;

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  if (isFinished) {
    return (
      <div className="timer-card finished">
        <TopBar onClose={onClose} />
        <h2>🎉 Готово!</h2>
        <button
          className="btn primary"
          onClick={() => {
            unlockAudio();
            restart();
          }}
        >
          ⏮ Начать сначала
        </button>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="timer-card">
        <TopBar onClose={onClose} />
        <p className="muted">Загрузка…</p>
      </div>
    );
  }

  return (
    <div
      className="timer-card timer-clickable"
      onClick={togglePause}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          togglePause();
        }
      }}
      aria-label={isRunning ? "Поставить на паузу" : "Продолжить"}
    >
      <TopBar onClose={onClose} />

      <div className="timer-meta">
        <span>
          Шаг {currentIndex + 1} / {totalSteps}
        </span>
        {currentStep.round && (
          <span>
            Раунд {currentStep.round}
            {currentStep.totalRounds ? ` / ${currentStep.totalRounds}` : ""}
          </span>
        )}
      </div>

      <h2 style={{ color: COLORS[currentStep.type] }}>
        {LABELS[currentStep.type]}
      </h2>
      <div className="timer-name">{currentStep.exerciseName}</div>

      <div className="circle-wrap">
        <svg viewBox="0 0 120 120" className="circle">
          <circle cx="60" cy="60" r="54" className="circle-bg" />
          <circle
            cx="60"
            cy="60"
            r="54"
            className="circle-fg"
            style={{
              stroke: COLORS[currentStep.type],
              strokeDasharray: CIRCUMFERENCE,
              strokeDashoffset: dashOffset,
            }}
          />
        </svg>
        <div className="circle-time">{fmtClock(timeLeft)}</div>

        <div className={`paused-overlay ${!isRunning ? "" : "hidden"}`}>
          ⏸ Пауза
        </div>
      </div>

      <p className="tap-hint">
        {isRunning
          ? "Нажмите, чтобы поставить на паузу"
          : "Нажмите, чтобы продолжить"}
      </p>

      <div className="actions center" onClick={(e) => e.stopPropagation()}>
        <button
          className="btn"
          onClick={prevStep}
          title="Назад к предыдущему шагу"
        >
          ⏮ Назад
        </button>
        <button className="btn" onClick={skip}>
          ⏭ Пропустить
        </button>
      </div>
    </div>
  );
}
