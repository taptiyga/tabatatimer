import { useState, useEffect, useRef, useCallback } from "react";
import {
  playPrepare,
  playExercise,
  playRest,
  playTick,
  playFinish,
} from "../utils/sounds";
import { requestWakeLock, releaseWakeLock } from "../utils/wakeLock";

export function useTimer({ soundEnabled = true } = {}) {
  const [steps, setSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const intervalRef = useRef(null);
  const finishedRef = useRef(false);
  const soundRef = useRef(soundEnabled);
  const lastTickRef = useRef(null);

  // Актуальные значения — в ref, чтобы интервал не пересоздавался
  const stepsRef = useRef(steps);
  const indexRef = useRef(currentIndex);
  const timeLeftRef = useRef(timeLeft);

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);
  useEffect(() => {
    indexRef.current = currentIndex;
  }, [currentIndex]);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const clearIntervalSafe = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const playForStep = (step) => {
    if (!soundRef.current || !step) return;
    if (step.type === "prepare") playPrepare();
    else if (step.type === "exercise") playExercise();
    else if (step.type === "rest") playRest();
  };

  const start = useCallback((newSteps) => {
    clearIntervalSafe();
    finishedRef.current = false;
    setSteps(newSteps);
    stepsRef.current = newSteps;
    setCurrentIndex(0);
    indexRef.current = 0;
    setTimeLeft(newSteps[0]?.duration || 0);
    timeLeftRef.current = newSteps[0]?.duration || 0;
    setIsFinished(false);
    setIsRunning(true);
    lastTickRef.current = null;
    playForStep(newSteps[0]);
    requestWakeLock();
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearIntervalSafe();
    releaseWakeLock();
  }, []);

  const resume = useCallback(() => {
    if (stepsRef.current.length > 0 && !finishedRef.current) {
      setIsRunning(true);
      requestWakeLock();
    }
  }, []);

  const stop = useCallback(() => {
    clearIntervalSafe();
    setIsRunning(false);
    setCurrentIndex(0);
    indexRef.current = 0;
    setTimeLeft(0);
    timeLeftRef.current = 0;
    setIsFinished(false);
    setSteps([]);
    stepsRef.current = [];
    lastTickRef.current = null;
    releaseWakeLock();
  }, []);

  const skip = useCallback(() => {
    setTimeLeft(0);
    timeLeftRef.current = 0;
  }, []);

  // Назад к предыдущему шагу.
  // Если это первый шаг — перезапускаем таймер с самого начала.
  const prevStep = useCallback(() => {
    const list = stepsRef.current;
    if (!list.length) return;

    const idx = indexRef.current;
    const targetIdx = Math.max(0, idx - 1);
    const targetStep = list[targetIdx];
    if (!targetStep) return;

    indexRef.current = targetIdx;
    timeLeftRef.current = targetStep.duration;
    lastTickRef.current = null;

    setCurrentIndex(targetIdx);
    setTimeLeft(targetStep.duration);
    setIsFinished(false);
    // Звук не играем
  }, []);

  // Единый таймер: тик и переход к следующему шагу.
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      const prev = timeLeftRef.current;

      // Тик на последних 3 секундах
      if (
        soundRef.current &&
        prev > 0 &&
        prev <= 3 &&
        lastTickRef.current !== prev
      ) {
        lastTickRef.current = prev;
        playTick();
      }

      if (prev > 0) {
        const next = prev - 1;
        timeLeftRef.current = next;
        setTimeLeft(next);
        return;
      }

      // prev === 0 → переходим к следующему шагу
      const idx = indexRef.current;
      const list = stepsRef.current;
      const nextIdx = idx + 1;

      if (nextIdx >= list.length) {
        if (!finishedRef.current) {
          finishedRef.current = true;
          clearIntervalSafe();
          setIsRunning(false);
          setIsFinished(true);
          if (soundRef.current) playFinish();
          releaseWakeLock();
        }
        return;
      }

      const nextStep = list[nextIdx];
      indexRef.current = nextIdx;
      timeLeftRef.current = nextStep.duration;
      lastTickRef.current = null;
      setCurrentIndex(nextIdx);
      setTimeLeft(nextStep.duration);
      playForStep(nextStep);
    }, 1000);

    return () => clearIntervalSafe();
  }, [isRunning]);

  const currentStep = steps[currentIndex] || null;
  const totalSteps = steps.length;

  return {
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
    prevStep,
    totalSteps,
  };
}
