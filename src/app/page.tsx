"use client";

import FrontCard from "@/components/FrontCard";
import useDailyFortune from "@/hooks/useDailyFortune";
import { useTriplePress } from "@/hooks/useTripleTap";
import { useState } from "react";

export default function Home() {
  const [unLock, setUnLock] = useState(false);

  const { horoscope, loading, requestFortune } = useDailyFortune({});
  const { onClick, onTouchEnd } = useTriplePress(() => setUnLock(!unLock));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {horoscope ? (
        <FrontCard />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/behind_card.jpg"
          alt="behind_card"
          className={`w-[50%] min-w-[250px] object-cover rounded-3xl shadow-lg hover:opacity-80 cursor-pointer ${
            loading ? "animate-ping" : ""
          }`}
          onClick={() => {
            requestFortune();
          }}
        />
      )}

      <div className="absolute left-4 bottom-4">
        {unLock ? (
          <button
            onPointerDown={() => {
              window.location.href = "/login";
            }}
          >
            <img src="/unlock.png" alt="admin" className="w-4 h-4 " />
          </button>
        ) : (
          <button onClick={onClick} onTouchEnd={onTouchEnd}>
            <img src="/padlock.png" alt="admin" className="w-4 h-4 " />
          </button>
        )}
      </div>
    </div>
  );
}
