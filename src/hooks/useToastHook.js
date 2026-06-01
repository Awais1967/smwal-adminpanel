import { useCallback, useMemo } from "react";

export const EVT = "mih_toast";

export default function useToast() {
  const toast = useCallback((payload) => {
    window.dispatchEvent(new CustomEvent(EVT, { detail: payload }));
  }, []);

  return useMemo(
    () => ({
      success: (message) => toast({ type: "success", message }),
      error: (message) => toast({ type: "error", message }),
      info: (message) => toast({ type: "info", message }),
    }),
    [toast],
  );
}
