"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          color: "var(--text-primary)",
        },
        classNames: {
          toast: "text-sm",
          success: "border-accent-success",
          error: "border-accent-danger",
          warning: "border-accent-warning",
          info: "border-accent-info",
        },
      }}
    />
  );
}
