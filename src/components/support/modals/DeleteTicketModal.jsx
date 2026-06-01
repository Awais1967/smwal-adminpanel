import React from "react";
import DeleteConfirmModal from "../../shared/Modal/DeleteConfirmModal";

export default function DeleteTicketModal({
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
      title="Delete Ticket?"
      description="This will permanently remove this ticket from the platform. This action cannot be undone."
    />
  );
}
