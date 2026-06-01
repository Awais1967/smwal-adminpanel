import React from "react";
import DeleteConfirmModal from "../../shared/Modal/DeleteConfirmModal";

export default function DeletePaymentModal({
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
      title="Delete Payment Record?"
      description="This will permanently remove this payment record from the platform. This action cannot be undone."
    />
  );
}
