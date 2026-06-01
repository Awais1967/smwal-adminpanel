import React from "react";
import DeleteConfirmModal from "../../shared/Modal/DeleteConfirmModal";

export default function DeleteLessonModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <DeleteConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      title="Delete Lesson?"
      description="This will permanently remove this lesson from the platform. This action cannot be undone."
    />
  );
}
