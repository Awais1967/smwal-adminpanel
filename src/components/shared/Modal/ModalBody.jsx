import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function ModalBody({ children, className }) {
  return <div className={cx("px-6 py-5", className)}>{children}</div>;
}
