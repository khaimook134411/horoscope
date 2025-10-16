import { useEffect, useState, useRef } from "react";
import {
  formatDateKey,
  getCookie,
  loadFortuneForDate,
  msUntilNextMidnight,
  removeFortuneForDate,
  saveFortuneForDate,
  setCookie,
} from "./helpers";
import { horoscopeAPI } from "@/lib/api";
import { Horoscope } from "@/types";

export default function useDailyFortune({
  autoFetch = false,
}: {
  autoFetch?: boolean;
}) {
  const [horoscope, setHoroscope] = useState<Horoscope | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const todayKey = formatDateKey();
  const midnightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlightRef = useRef<Promise<Horoscope | undefined> | null>(null);

  // โหลด cache ทันทีที่ mount/เปลี่ยนวัน และตั้ง timer เคลียร์ตอนเที่ยงคืน
  useEffect(() => {
    const cached = loadFortuneForDate(todayKey);
    if (cached) {
      setHoroscope(cached);
      try {
        setCookie("daily_visit", todayKey, msUntilNextMidnight());
      } catch (e) {
        console.warn("Could not set cookie", e);
      }
    } else if (autoFetch) {
      // กรณีอยากให้มีโหมด auto ได้ด้วย
      void requestFortune();
    }

    const ms = msUntilNextMidnight();
    midnightTimerRef.current = setTimeout(() => {
      setHoroscope(undefined);
      setError(null);
      inFlightRef.current = null;
    }, ms + 200);

    return () => {
      if (midnightTimerRef.current) clearTimeout(midnightTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey, autoFetch]);

  async function requestFortune(options?: { force?: boolean }) {
    if (loading) return inFlightRef.current ?? Promise.resolve(horoscope);
    setError(null);

    const cached = loadFortuneForDate(todayKey);
    const visitedToday = getCookie("daily_visit") === todayKey;

    if (!options?.force && cached) {
      setHoroscope(cached);
      return cached;
    }
    if (!options?.force && visitedToday && cached) {
      setHoroscope(cached);
      return cached;
    }

    const task = (async () => {
      try {
        setLoading(true);
        const { data } = await horoscopeAPI.getRandom();
        setHoroscope(data);
        saveFortuneForDate(todayKey, data);
        setCookie("daily_visit", todayKey, msUntilNextMidnight());
        return data as Horoscope;
      } catch (err) {
        setError((err as Error).message ?? err);
        return undefined;
      } finally {
        setLoading(false);
        inFlightRef.current = null;
      }
    })();

    inFlightRef.current = task;
    return task;
  }

  function clearTodayCache() {
    try {
      removeFortuneForDate(todayKey);
    } catch {}
    setHoroscope(undefined);
    setError(null);
  }

  const hasToday = Boolean(loadFortuneForDate(todayKey));

  return {
    horoscope,
    loading,
    error,
    hasToday,
    requestFortune,
    clearTodayCache,
  };
}
