const COOKIE_PREFIX = 'ks_';
const COOKIE_EXPIRY = 365;

export function setCookie(name, value, days = COOKIE_EXPIRY) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${COOKIE_PREFIX}${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires};path=/;SameSite=Lax`;
}

export function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_PREFIX + name + '=([^;]*)'));
  if (!match) return null;
  try { return JSON.parse(decodeURIComponent(match[1])); } catch { return null; }
}

export function removeCookie(name) {
  document.cookie = `${COOKIE_PREFIX}${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export function hasConsent() {
  return getCookie('consent') !== null;
}

export function setConsent(granted) {
  setCookie('consent', { granted, timestamp: Date.now() });
}

export function getPrefs() {
  return getCookie('prefs') || {};
}

export function setPrefs(prefs) {
  const current = getPrefs();
  setCookie('prefs', { ...current, ...prefs });
}

export function addRecent(item) {
  const recents = getCookie('recents') || [];
  const filtered = recents.filter(r => r.id !== item.id);
  filtered.unshift({ id: item.id, type: item.media_type, title: item.title || item.name, poster: item.poster || item.poster_path, timestamp: Date.now() });
  setCookie('recents', filtered.slice(0, 20));
}

export function getRecents() {
  return getCookie('recents') || [];
}
