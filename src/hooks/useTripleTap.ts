import { useRef } from "react";

export function useTriplePress(callback: () => void) {
  const count = useRef(0);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handler = () => {
    count.current++;

    if (count.current === 1) {
      timer.current = setTimeout(() => {
        count.current = 0;
      }, 400);
    } else if (count.current === 3) {
      if (timer.current) clearTimeout(timer.current);
      count.current = 0;
      callback();
    }
  };

  return {
    onClick: handler,
    onTouchEnd: handler,
  };
}
