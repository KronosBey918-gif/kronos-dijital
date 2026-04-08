"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "error" | "info";

interface ToastState {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

let toastQueue: ToastState[] = [];
let setToastsExternal: ((toasts: ToastState[]) => void) | null = null;

export function toast(opts: Omit<ToastState, "id">) {
  const newToast: ToastState = { ...opts, id: Math.random().toString(36).slice(2) };
  toastQueue = [...toastQueue, newToast];
  setToastsExternal?.([...toastQueue]);

  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== newToast.id);
    setToastsExternal?.([...toastQueue]);
  }, 5000);
}

export function Toaster() {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  React.useEffect(() => {
    setToastsExternal = setToasts;
    return () => {
      setToastsExternal = null;
    };
  }, []);

  const variantIcon = (variant?: ToastVariant) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case "info":
        return <Info className="w-5 h-5 text-brand-violet" />;
      default:
        return <Info className="w-5 h-5 text-brand-orange" />;
    }
  };

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          className={cn(
            "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-2xl border border-border bg-brand-surface p-4 pr-8 shadow-lg transition-all",
            "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
            "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full",
            "data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full"
          )}
        >
          <div className="flex items-start gap-3">
            {variantIcon(t.variant)}
            <div className="grid gap-1">
              <ToastPrimitive.Title className="text-sm font-semibold">{t.title}</ToastPrimitive.Title>
              {t.description && (
                <ToastPrimitive.Description className="text-sm text-muted-foreground">
                  {t.description}
                </ToastPrimitive.Description>
              )}
            </div>
          </div>
          <ToastPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100">
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
    </ToastPrimitive.Provider>
  );
}
