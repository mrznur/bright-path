"use client";

import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

export type ToastType = "success" | "error";

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  let counter = 0;

  function toast(type: ToastType, message: string) {
    const id = ++counter + Date.now();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismiss(id), 3500);
  }

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return { toasts, toast, dismiss };
}

export function ToastContainer({
  toasts,
  dismiss,
}: {
  toasts: ToastMessage[];
  dismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 right-4 z-[200] flex flex-col gap-2 w-[min(360px,calc(100vw-2rem))]"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on mount
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const isSuccess = toast.type === "success";

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-2xl px-4 py-3 shadow-lg border transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      } ${
        isSuccess
          ? "bg-green-50 border-green-200 text-green-800"
          : "bg-red-50 border-red-200 text-red-700"
      }`}
    >
      {isSuccess ? (
        <FiCheckCircle className="shrink-0 text-green-600 text-lg mt-0.5" />
      ) : (
        <FiXCircle className="shrink-0 text-red-500 text-lg mt-0.5" />
      )}
      <p className="text-sm leading-relaxed flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className={`shrink-0 rounded-full p-0.5 transition-colors ${
          isSuccess ? "hover:bg-green-100" : "hover:bg-red-100"
        }`}
      >
        <FiX className="text-sm" />
      </button>
    </div>
  );
}
