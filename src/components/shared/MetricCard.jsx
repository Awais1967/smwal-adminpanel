import React, { useState, useEffect } from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

function useNumberAnimation(targetValue, duration = 800) {
  const numValue = parseInt(targetValue, 10);
  const [displayValue, setDisplayValue] = useState(
    isNaN(numValue) ? targetValue : 0,
  );

  useEffect(() => {
    if (isNaN(numValue)) {
      return;
    }

    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const current = Math.floor(numValue * progress);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetValue, duration, numValue]);

  return displayValue;
}

export default function MetricCard({ icon, label, value, className = "" }) {
  const animatedValue = useNumberAnimation(value, 800);

  return (
    <div
      className={cx(
        "rounded-2xl border border-white/10 bg-white/5 p-6",
        "shadow-(--shadow-card)",
        className,
      )}
    >
      {/* icon top-left */}
      {icon ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7EFFF] text-[#0B67CD]">
          {icon}
        </div>
      ) : null}

      {/* label + value stacked */}
      <div className="mt-5">
        <div className="text-[13px] font-medium text-white/70">{label}</div>
        <div className="mt-2 text-[28px] font-semibold leading-none text-white">
          {animatedValue}
        </div>
      </div>
    </div>
  );
}
