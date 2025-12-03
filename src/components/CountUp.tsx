import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { animate, useMotionValue } from "framer-motion";

type CountUpProps = {
  target: number;
  start?: boolean;
  duration?: number;
  delay?: number;
  startValue?: number;
  decimals?: number;
  className?: string;
  suffix?: string;
  style?: CSSProperties;
};

export function CountUp({
  target,
  start = false,
  duration = 1,
  delay = 0,
  startValue = 0,
  decimals = 0,
  className = "",
  suffix = "",
  style,
}: CountUpProps) {
  const count = useMotionValue(startValue);
  const [display, setDisplay] = useState(startValue);
  const startValueRef = useRef(startValue);

  useEffect(() => {
    startValueRef.current = startValue;
  }, [startValue]);

  useEffect(() => {
    const from = startValueRef.current;
    count.set(from);
    setDisplay(from);

    if (start && target !== from) {
      const controls = animate(count, target, {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplay(Number(v.toFixed(decimals))),
      });

      return () => controls.stop();
    }
  }, [start, target, duration, delay, count, decimals]);

  const formatted = Number.isFinite(display)
    ? (() => {
        const [integerPart, fractionPart = ""] = display
          .toFixed(decimals)
          .split(".");
        const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return decimals > 0
          ? `${groupedInteger}.${fractionPart}`
          : groupedInteger;
      })()
    : display;

  return (
    <span className={className} style={style}>
      {formatted}
      {suffix}
    </span>
  );
}

export default CountUp;
