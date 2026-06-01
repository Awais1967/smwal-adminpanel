import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function Skeleton({
  className,
  rounded = "rounded-xl",
  as = "div",
}) {
  return React.createElement(as, {
    className: cx(
      "animate-pulse border border-white/10 bg-white/5",
      rounded,
      className,
    ),
  });
}
