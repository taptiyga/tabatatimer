// Генерация звуков через Web Audio API.
// Не требует mp3-файлов, работает в современных браузерах.

let ctx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function beep(freq = 880, duration = 0.15, volume = 0.5) {
  const ac = getCtx();
  if (!ac) return;

  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = "sine";
  osc.frequency.value = freq;

  const now = ac.currentTime;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.01);
  gain.gain.linearRampToValueAtTime(0, now + duration);

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

export const playPrepare = () => beep(660, 0.2, 0.5);
export const playExercise = () => beep(1046, 0.25, 0.6);
export const playRest = () => beep(440, 0.25, 0.5);
export const playTick = () => beep(1200, 0.08, 0.35);
export const playFinish = () => {
  beep(880, 0.2, 0.6);
  setTimeout(() => beep(1100, 0.2, 0.6), 220);
  setTimeout(() => beep(1320, 0.35, 0.7), 440);
};

export function unlockAudio() {
  getCtx();
}
