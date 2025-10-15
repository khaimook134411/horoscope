import { getTimeUntilMidnight } from "@/lib/day";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/Button";

interface Props {
  onClick: () => void;
}

export default function CouterTime({ onClick }: Props) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p>พลังดวงดาวต้องพัก รอรับคำทำนายใหม่ได้หลังเที่ยงคืน ✨</p>
      <Button variant="secondary" size="sm" onClick={onClick}>
        {timeLeft}
      </Button>
    </div>
  );
}
