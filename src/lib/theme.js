// Manage the `dark` class on the <html> root.

const STORAGE_KEY = 'cfa-coach-theme';

export function getStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY); // 'light' | 'dark' | null
  } catch {
    return null;
  }
}

export function resolveTheme() {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') return stored;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

export function setTheme(theme) {
  try {
    if (theme === 'system') localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, theme);
  } catch {}
  applyTheme(theme === 'system' ? resolveTheme() : theme);
  notify();
}

const listeners = new Set();
function notify() { listeners.forEach(l => l()); }
export function subscribeTheme(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Initial apply — call once at app start.
export function initTheme() {
  applyTheme(resolveTheme());
}
