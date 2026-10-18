import { useState, useEffect, useRef, useCallback } from "react";
import {
  playPrepare,
  playExercise,
  playRest,
  playTick,
  playFinish,
} from "../utils/sounds";

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

  useEffect(() => {
    soundRef.current = soundEnabled;
  }, [soundEnabled]);

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
    setCurrentIndex(0);
    setTimeLeft(newSteps[0]?.duration || 0);
    setIsFinished(false);
    setIsRunning(true);
    lastTickRef.current = null;
    playForStep(newSteps[0]);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearIntervalSafe();
  }, []);

  const resume = useCallback(() => {
    if (steps.length > 0 && !isFinished) setIsRunning(true);
  }, [steps, isFinished]);

  const stop = useCallback(() => {
    clearIntervalSafe();
    setIsRunning(false);
    setCurrentIndex(0);
    setTimeLeft(0);
    setIsFinished(false);
    setSteps([]);
    lastTickRef.current = null;
  }, []);

  const skip = useCallback(() => {
    setTimeLeft(0);
  }, []);

  // Обратный отсчёт
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearIntervalSafe();
  }, [isRunning]);

  // Тик на последних 3 секундах
  useEffect(() => {
    if (!isRunning || !soundRef.current) return;
    if (timeLeft > 0 && timeLeft <= 3 && lastTickRef.current !== timeLeft) {
      lastTickRef.current = timeLeft;
      playTick();
    }
  }, [timeLeft, isRunning]);

  // Переход к следующему шагу
  useEffect(() => {
    if (!isRunning || timeLeft !== 0) return;

    const next = currentIndex + 1;
    if (next >= steps.length) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        clearIntervalSafe();
        setIsRunning(false);
        setIsFinished(true);
        if (soundRef.current) playFinish();
      }
      return;
    }
    setCurrentIndex(next);
    setTimeLeft(steps[next].duration);
    lastTickRef.current = null;
    playForStep(steps[next]);
  }, [timeLeft, isRunning, currentIndex, steps]);

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
    totalSteps,
  };
}
