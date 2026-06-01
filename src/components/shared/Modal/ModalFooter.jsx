import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function ModalFooter({ children, className }) {
  return (
    <div className={cx("border-t border-white/10 px-6 py-5", className)}>
      {children}
    </div>
  );
}
