"use client";

import { Button } from "@/components/ui/Button";
import { horoscopeAPI } from "@/lib/api";
import { textByLevelMap } from "@/lib/utils";
import { Horoscope } from "@/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [horoscope, setHoroscope] = useState<Horoscope>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHoroscope();
  }, []);

  const fetchHoroscope = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await horoscopeAPI.getRandom();

      setHoroscope(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-700 drop-shadow">
            คำทำนายดวงชะตา
          </h1>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="animate-spin h-8 w-8 border-4 border-blue-300 border-t-transparent rounded-full"></span>
              <span className="text-blue-500 font-medium">
                กำลังโหลดคำทำนาย...
              </span>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center font-semibold">
              {error}
            </div>
          ) : horoscope ? (
            <>
              <div className="flex items-center gap-3">
                <span className="flex w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                  <Image
                    src="/globe.svg"
                    alt="horoscope"
                    width={32}
                    height={32}
                  />
                </span>
                <span className="text-xl font-bold text-purple-700">
                  {textByLevelMap[horoscope.level]}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-lg text-gray-800 font-semibold mb-2">
                  {horoscope.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="flex w-6 h-6 bg-purple-100 rounded items-center justify-center">
                    <Image
                      src="/window.svg"
                      alt="note"
                      width={20}
                      height={20}
                    />
                  </span>
                  <span className="text-sm text-gray-600 italic">
                    {horoscope.note}
                  </span>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="secondary" size="sm" onClick={fetchHoroscope}>
                  ดูคำทำนายใหม่
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div
        className="mt-8 text-center text-xs text-gray-400"
        onDoubleClick={() => {
          window.location.href = "/login";
        }}
      >
        Good Luck
      </div>
    </div>
  );
}
