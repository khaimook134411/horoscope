import useDailyFortune from "@/hooks/useDailyFortune";
import { getBadgeVariant, textByLevelMap } from "@/lib/utils";
import React from "react";
import CouterTime from "./CouterTime";
import Badge from "./ui/Badge";

export default function FrontCard() {
  const { horoscope, error } = useDailyFortune({});
  return (
    <div className="w-[60%] min-w-[300px] h-[400px] text-center rounded-3xl  text-white backdrop-blur-sm bg-black/40 shadow-lg p-6 flex flex-col gap-4">
      {error ? (
        <div className="text-red-500 text-center font-semibold">
          {String(error)}
        </div>
      ) : horoscope ? (
        <div className="flex flex-col justify-between h-full">
          <div className="flex-1 flex flex-col items-center gap-3">
            <Badge variant={getBadgeVariant(horoscope.level)}>
              {textByLevelMap[horoscope.level] || horoscope.level}
            </Badge>
            <div className="flex-1 flex flex-col pb-5">
              <p className="flex-1 flex items-center justify-center text-xl font-semibold text-[#E4C27A]">
                {horoscope?.description}
              </p>
              <p className="text-sm italic text-[#9E8CFF]">
                คำแนะนำ: {horoscope?.note}
              </p>
            </div>
          </div>

          <CouterTime />
        </div>
      ) : null}
    </div>
  );
}
