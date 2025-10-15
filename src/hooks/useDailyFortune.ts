// useDailyFortune.js
import { useEffect, useState, useRef } from "react";
import {
  formatDateKey,
  msUntilNextMidnight,
  setCookie,
  getCookie,
  saveFortuneForDate,
  loadFortuneForDate,
} from "./helpers";

/**
 * useDailyFortune({ apiUrl, autoFetch=true })
 * - apiUrl: endpoint ที่สุ่มดวง (GET)
 * - autoFetch: ถ้า true จะ fetch ทันทีถ้าไม่มี cache สำหรับวันนี้
 *
 * Returns: { fortune, loading, error, refresh(force=false) }
 */
export default function useDailyFortune({
  apiUrl = "/api/fortune",
  autoFetch = true,
} = {}) {
  const [fortune, setFortune] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const midnightTimerRef = useRef(null);

  const todayKey = formatDateKey();

  // ตรวจสอบ localStorage ก่อน
  useEffect(() => {
    const cached = loadFortuneForDate(todayKey);
    if (cached) {
      setFortune(cached);
      // set cookie to mark visited today (safety)
      try {
        setCookie("daily_visit", todayKey, msUntilNextMidnight());
      } catch (e) {}
    } else if (autoFetch) {
      fetchAndCache();
    }

    // set timer to clear at midnight (so component re-renders next day)
    const ms = msUntilNextMidnight();
    midnightTimerRef.current = setTimeout(() => {
      setFortune(null);
      setError(null);
      // optionally remove stale local state; localStorage stays for history if wanted
    }, ms + 200); // a tiny buffer
    return () => clearTimeout(midnightTimerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  async function fetchAndCache() {
    // ถ้ามี cache หลังจาก race condition ให้ใช้ cache (double-check)
    const cached = loadFortuneForDate(todayKey);
    if (cached) {
      setFortune(cached);
      return cached;
    }

    // ถ้ามี cookie ว่าเคยมาในวันนี้ แต่ localStorage หายไป -> เราอาจยังเลือกไม่ fetch ใหม่
    const cookieVisit = getCookie("daily_visit");
    if (cookieVisit === todayKey) {
      // cookie บอกว่าเข้ามาแล้ววันนี้ แต่ localStorage ไม่มี (อาจถูกลบ) — เพื่อความปลอดภัยให้ fetch ใหม่
      // คุณอาจเลือกไม่ fetch ขึ้นอยู่กับนโยบาย — ที่นี่จะ fetch ใหม่
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      // สมมติ json มีรูปแบบ { fortune: "...", ... } — เก็บทั้ง object ได้
      setFortune(json);
      saveFortuneForDate(todayKey, json);
      setCookie("daily_visit", todayKey, msUntilNextMidnight());
      setLoading(false);
      return json;
    } catch (err) {
      setError(err);
      setLoading(false);
      return null;
    }
  }

  // refresh(force): ถ้า force=true จะเรียก API ใหม่เสมอ (แม้มี cache)
  async function refresh(force = false) {
    if (!force) {
      const cached = loadFortuneForDate(todayKey);
      if (cached) {
        setFortune(cached);
        return cached;
      }
    }
    return await fetchAndCache();
  }

  return { fortune, loading, error, refresh };
}
