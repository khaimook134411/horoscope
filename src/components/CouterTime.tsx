import { getTimeUntilMidnight } from "@/lib/day";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CouterTime() {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());
  const [isBounce, setIsBounce] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <p
        className={`text-xs ${
          isBounce ? "animate-bounce" : ""
        } text-[#B0B3C6] text-center`}
      >
        รอรับคำทำนายใหม่ได้หลังเที่ยงคืน ✨
      </p>
      <p
        className="text-sm font-mono tracking-wide"
        onClick={() => {
          setIsBounce(true);
          setTimeout(() => setIsBounce(false), 1000);
          toast("รอเที่ยงคืนนะคะ!", {
            icon: "🔮",
          });
        }}
      >
        {timeLeft}
      </p>
    </div>
  );
}
