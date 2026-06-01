import { useCallback, useState } from "react";

export default function useModal(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const [data, setData] = useState(null);

  const openModal = useCallback((payload = null) => {
    setData(payload);
    setOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  const reset = useCallback(() => {
    setOpen(false);
    setData(null);
  }, []);

  return { open, data, setData, setOpen, openModal, closeModal, reset };
}
