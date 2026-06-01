import React from "react";
import DeleteConfirmModal from "../../shared/Modal/DeleteConfirmModal";

export default function DeleteCampaignModal({
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
      title="Delete Campaign?"
      description="This will permanently remove this campaign from the platform. This action cannot be undone."
    />
  );
}
