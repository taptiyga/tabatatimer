let wakeLock = null;

export async function requestWakeLock() {
  if (!("wakeLock" in navigator)) return false;

  // Освобождаем предыдущий, если он есть
  if (wakeLock) {
    try {
      await wakeLock.release();
    } catch {
      // уже освобождён — игнорируем
    }
    wakeLock = null;
  }

  try {
    const lock = await navigator.wakeLock.request("screen");
    wakeLock = lock;

    // Если браузер сам снимет lock (например, при сворачивании вкладки),
    // обнулим ссылку, чтобы следующий request создал новый
    lock.addEventListener("release", () => {
      if (wakeLock === lock) wakeLock = null;
    });

    return true;
  } catch (err) {
    console.warn("Wake Lock недоступен:", err.message);
    return false;
  }
}

export async function releaseWakeLock() {
  if (!wakeLock) return;
  const lock = wakeLock;
  wakeLock = null;
  try {
    await lock.release();
  } catch {
    // уже освобождён — игнорируем
  }
}
