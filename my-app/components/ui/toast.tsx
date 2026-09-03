"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string, duration = 4000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, message, title, duration };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, title?: string) => addToast("success", message, title),
    error: (message: string, title?: string) => addToast("error", message, title),
    warning: (message: string, title?: string) => addToast("warning", message, title),
    info: (message: string, title?: string) => addToast("info", message, title),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Render Container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex max-w-md w-full flex-col gap-2 p-4 pointer-events-none sm:bottom-6 sm:right-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl p-4 shadow-lg border backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              t.type === "success"
                ? "bg-white/95 border-emerald-200 text-zinc-900 dark:bg-zinc-900/95 dark:border-emerald-800 dark:text-zinc-100"
                : t.type === "error"
                ? "bg-white/95 border-rose-200 text-zinc-900 dark:bg-zinc-900/95 dark:border-rose-800 dark:text-zinc-100"
                : t.type === "warning"
                ? "bg-white/95 border-amber-200 text-zinc-900 dark:bg-zinc-900/95 dark:border-amber-800 dark:text-zinc-100"
                : "bg-white/95 border-blue-200 text-zinc-900 dark:bg-zinc-900/95 dark:border-blue-800 dark:text-zinc-100"
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {t.type === "success" && (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              )}
              {t.type === "error" && (
                <AlertCircle className="h-5 w-5 text-rose-500" />
              )}
              {t.type === "warning" && (
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              )}
              {t.type === "info" && (
                <Info className="h-5 w-5 text-blue-500" />
              )}
            </div>

            <div className="flex-1 text-sm leading-snug">
              {t.title && <h5 className="font-semibold mb-0.5">{t.title}</h5>}
              <p className="text-zinc-600 dark:text-zinc-300">{t.message}</p>
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="shrink-0 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
}
