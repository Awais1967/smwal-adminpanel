export const EVT = "mih_toast";

export default function useToast() {
  const toast = (payload) => {
    window.dispatchEvent(new CustomEvent(EVT, { detail: payload }));
  };

  return {
    success: (message) => toast({ type: "success", message }),
    error: (message) => toast({ type: "error", message }),
    info: (message) => toast({ type: "info", message }),
  };
}
