export function setCookie(name: string, value, expiresMsFromNow) {
  const expires = new Date(Date.now() + expiresMsFromNow).toUTCString();
  // samesite & path; adjust Secure if on HTTPS
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getCookie(name: string) {
  const m = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return m ? decodeURIComponent(m[1]) : null;
}

/* localStorage wrapper */
export function saveFortuneForDate(dateKey, data) {
  try {
    localStorage.setItem(
      `fortune_${dateKey}`,
      JSON.stringify({ data, createdAt: Date.now() })
    );
  } catch (e) {
    // storage full / private mode -> ignore or fallback
    console.warn("Could not save fortune to localStorage", e);
  }
}

export function loadFortuneForDate(dateKey) {
  try {
    const raw = localStorage.getItem(`fortune_${dateKey}`);
    if (!raw) return null;
    return JSON.parse(raw).data;
  } catch (e) {
    return null;
  }
}
