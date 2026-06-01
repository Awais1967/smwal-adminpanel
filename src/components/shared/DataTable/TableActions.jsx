import React from "react";
import IconButton from "../IconButton";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function TableActions({ onView, onEdit, onDelete }) {
  return (
    <div className="inline-flex items-center justify-end gap-1">
      {onView && (
        <IconButton
          icon={FiEye}
          label="View"
          onClick={onView}
          variant="subtle"
          size="sm"
          className="text-white/80"
        />
      )}
      {onEdit && (
        <IconButton
          icon={FiEdit2}
          label="Edit"
          onClick={onEdit}
          variant="edit"
          size="sm"
        />
      )}
      {onDelete && (
        <IconButton
          icon={FiTrash2}
          label="Delete"
          onClick={onDelete}
          variant="danger"
          size="sm"
        />
      )}
    </div>
  );
}
