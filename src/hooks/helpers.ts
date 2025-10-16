export function formatDateKey(d = new Date()) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; // e.g. "2025-10-15"
}

export function msUntilNextMidnight() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return Number(tomorrow) - Number(now);
}

/* Cookie helpers */
export function setCookie(
  name: string,
  value: string,
  expiresMsFromNow: number
) {
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
export function saveFortuneForDate(
  dateKey: string,
  data: Record<string, unknown>
) {
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

export function removeFortuneForDate(dateKey: string) {
  try {
    localStorage.removeItem(`fortune_${dateKey}`);
  } catch (e) {
    console.warn("Could not remove fortune from localStorage", e);
  }
}

export function loadFortuneForDate(dateKey: string) {
  try {
    const raw = localStorage.getItem(`fortune_${dateKey}`);
    if (!raw) return null;
    return JSON.parse(raw).data;
  } catch (e) {
    return null;
  }
}
