import React, { useCallback, useMemo, useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import UploadedFilePreview from "./UploadedFilePreview";

const cx = (...c) => c.filter(Boolean).join(" ");

function toAcceptString(accept) {
  if (!accept) return undefined;
  if (Array.isArray(accept)) return accept.join(",");
  return accept;
}

function fileListToArray(list) {
  return Array.from(list || []);
}

export default function FileDropzone({
  value = [],
  onChange,
  accept, // e.g. ["image/*", ".pdf"]
  multiple = true,
  maxFiles,
  disabled,
  title = "Upload files",
  subtitle = "Drag & drop here, or click to browse",
  className,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const acceptStr = useMemo(() => toAcceptString(accept), [accept]);

  const emit = useCallback(
    (files) => {
      let next = multiple ? [...(value || []), ...files] : files.slice(0, 1);
      if (typeof maxFiles === "number") next = next.slice(0, maxFiles);
      onChange?.(next);
    },
    [multiple, value, onChange, maxFiles],
  );

  const onPick = useCallback(() => {
    if (disabled) return;
    inputRef.current?.click();
  }, [disabled]);

  const onInputChange = useCallback(
    (e) => {
      const picked = fileListToArray(e.target.files);
      if (picked.length) emit(picked);
      e.target.value = "";
    },
    [emit],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const dropped = fileListToArray(e.dataTransfer.files);
      if (dropped.length) emit(dropped);
    },
    [disabled, emit],
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const removeFile = useCallback(
    (f) => {
      const next = (value || []).filter((x) => x !== f);
      onChange?.(next);
    },
    [value, onChange],
  );

  return (
    <div className={cx("w-full", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={onPick}
        onKeyDown={(e) =>
          e.key === "Enter" || e.key === " " ? onPick() : null
        }
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={cx(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border p-8 text-center outline-none transition",
          "border-white/10 bg-white/5",
          isDragging ? "border-sky-500/30 bg-sky-500/10" : "hover:bg-white/8",
          disabled ? "cursor-not-allowed opacity-60 hover:bg-white/5" : "",
          "focus:ring-4 focus:ring-sky-500/10",
        )}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
          <FiUploadCloud className="text-[22px] text-white/70" />
        </div>
        <div className="mt-4 text-[14px] font-semibold text-white">{title}</div>
        <div className="mt-1 text-[12px] text-white/55">{subtitle}</div>
      </div>

      <input
        ref={inputRef}
        type="file"
        disabled={disabled}
        multiple={multiple}
        accept={acceptStr}
        onChange={onInputChange}
        className="hidden"
      />

      {value?.length ? (
        <div className="mt-4 space-y-2">
          {value.map((f, i) => (
            <UploadedFilePreview
              key={`${f.name}-${f.size}-${i}`}
              file={f}
              onRemove={removeFile}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
