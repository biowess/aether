// ── Aether Storage Service ───────────────────────────────────────

const PREFIX = 'aether_';

export function storageGet(key, fallback = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silent fail
  }
}

export function storageRemove(key) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
}

export function storageClear() {
  try {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k));
  } catch {}
}
