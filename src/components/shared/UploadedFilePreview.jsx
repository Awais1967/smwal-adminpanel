import React, { useEffect, useMemo, useState } from "react";
import { FiFile, FiImage, FiX, FiDownload } from "react-icons/fi";
import IconButton from "./IconButton";

const cx = (...c) => c.filter(Boolean).join(" ");

function formatBytes(bytes = 0) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const v = bytes / Math.pow(k, i);
  return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export default function UploadedFilePreview({
  file,
  onRemove,
  onDownload,
  className,
}) {
  const isFile = typeof File !== "undefined" && file instanceof File;
  const name = file?.name || "file";
  const size = file?.size || 0;
  const type = file?.type || "";

  const isImage = type.startsWith("image/");
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!isFile || !isImage) return;
    const u = URL.createObjectURL(file);
    const t = setTimeout(() => setUrl(u), 0);
    return () => {
      clearTimeout(t);
      URL.revokeObjectURL(u);
    };
  }, [isFile, isImage, file]);

  const Icon = useMemo(() => (isImage ? FiImage : FiFile), [isImage]);

  return (
    <div
      className={cx(
        "flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3",
        className,
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
        {isImage && url ? (
          <img src={url} alt={name} className="h-full w-full object-cover" />
        ) : (
          <Icon className="text-[18px] text-white/70" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-medium text-white/85">
          {name}
        </div>
        <div className="mt-0.5 text-[11px] text-white/45">
          {formatBytes(size)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onDownload ? (
          <IconButton
            icon={FiDownload}
            label="Download"
            onClick={() => onDownload(file)}
            variant="ghost"
          />
        ) : null}
        {onRemove ? (
          <IconButton
            icon={FiX}
            label="Remove"
            onClick={() => onRemove(file)}
            variant="danger"
          />
        ) : null}
      </div>
    </div>
  );
}
