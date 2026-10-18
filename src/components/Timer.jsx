import { useEffect, useRef } from "react";
import { useTimer } from "../hooks/useTimer";
import { unlockAudio } from "../utils/sounds";
import { fmtClock } from "../utils/format";

const LABELS = { prepare: "Подготовка", exercise: "Упражнение", rest: "Отдых" };
const COLORS = { prepare: "#f59e0b", exercise: "#ef4444", rest: "#10b981" };

export default function Timer({
  startSteps,
  clearStartSteps,
  soundEnabled = true,
}) {
  const timer = useTimer({ soundEnabled });
  const {
    currentStep,
    currentIndex,
    timeLeft,
    isRunning,
    isFinished,
    start,
    pause,
    resume,
    stop,
    skip,
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

  const handleResume = () => {
    unlockAudio();
    resume();
  };

  const progress = currentStep ? 1 - timeLeft / currentStep.duration : 0;

  if (isFinished) {
    return (
      <div className="timer-card finished">
        <h2>🎉 Готово!</h2>
        <button className="btn primary" onClick={stop}>
          Закрыть
        </button>
      </div>
    );
  }

  if (!currentStep) {
    return (
      <div className="timer-card">
        <p className="muted">Выберите упражнение или тренировку для старта</p>
      </div>
    );
  }

  return (
    <div className="timer-card">
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
              strokeDasharray: 339.292,
              strokeDashoffset: 339.292 * (1 - progress),
            }}
          />
        </svg>
        <div className="circle-time">{fmtClock(timeLeft)}</div>
      </div>

      <div className="actions center">
        {isRunning ? (
          <button className="btn" onClick={pause}>
            ⏸ Пауза
          </button>
        ) : (
          <button className="btn primary" onClick={handleResume}>
            ▶ Продолжить
          </button>
        )}
        <button className="btn" onClick={skip}>
          ⏭ Пропустить
        </button>
        <button className="btn danger" onClick={stop}>
          ⏹ Стоп
        </button>
      </div>
    </div>
  );
}
