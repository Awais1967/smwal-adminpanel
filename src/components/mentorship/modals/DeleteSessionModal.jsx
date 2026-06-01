import React from "react";
import DeleteConfirmModal from "../../shared/Modal/DeleteConfirmModal";

export default function DeleteSessionModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <DeleteConfirmModal
      open={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      title="Delete Mentorship Session?"
      description="This will permanently remove this mentorship session from the platform. This action cannot be undone."
    />
  );
}
