import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

const VARIANTS = {
  ghost:
    "border border-white/10 bg-white/5 text-white/70 hover:bg-white/8 hover:text-white focus:ring-sky-500/30",
  subtle:
    "border border-transparent bg-transparent text-white/65 hover:bg-white/5 hover:text-white focus:ring-sky-500/30",
  edit:
    "border border-transparent bg-transparent text-white/80 hover:bg-white/5 hover:text-white focus:ring-sky-500/30",
  danger:
    "border border-transparent bg-transparent text-[#FF5B57] hover:bg-white/5 hover:text-[#FF5B57] focus:ring-red-500/20",
};

const SIZES = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-9 w-9 rounded-xl",
};

export default function IconButton({
  icon: Icon,
  label,
  onClick,
  variant = "subtle",
  size = "sm",
  className,
  disabled,
  type = "button",
}) {
  const handleClick = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onClick?.(e);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cx(
        "inline-flex items-center justify-center outline-none transition",
        "focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant] || VARIANTS.subtle,
        SIZES[size] || SIZES.sm,
        className,
      )}
    >
      {Icon ? <Icon className="text-[16px]" /> : null}
    </button>
  );
}
