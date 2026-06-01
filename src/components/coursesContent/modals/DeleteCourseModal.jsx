import React from "react";
import DeleteConfirmModal from "../../shared/Modal/DeleteConfirmModal";

export default function DeleteCourseModal({
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
      title="Delete Course?"
      description="This will permanently remove this course and its lessons from the platform. This action cannot be undone."
    />
  );
}
