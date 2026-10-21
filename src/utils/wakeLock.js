let wakeLock = null;

export async function requestWakeLock() {
  if (!("wakeLock" in navigator)) return false;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    return true;
  } catch (err) {
    // Например, низкий заряд батареи или вкладка не активна
    console.warn("Wake Lock недоступен:", err.message);
    return false;
  }
}

export async function releaseWakeLock() {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
}
