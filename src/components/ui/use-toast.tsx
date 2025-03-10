import { useState, useEffect } from "react";
import { createContext, useContext } from "react";

type ToastType = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive";
};

type ToastContextType = {
  toasts: ToastType[];
  addToast: (toast: Omit<ToastType, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = ({
    title,
    description,
    action,
    variant,
  }: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, action, variant }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="toast-viewport fixed right-0 bottom-0 z-50 flex flex-col gap-2 p-4">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`toast-container animate-in slide-in-from-bottom-5 fade-in-20 max-w-md rounded-lg bg-white p-4 shadow-lg ring-1 ring-black/5 dark:bg-slate-800 ${
                toast.variant === "destructive"
                  ? "border-l-4 border-red-500"
                  : ""
              }`}
            >
              {toast.title && <h3 className="font-semibold">{toast.title}</h3>}
              {toast.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {toast.description}
                </p>
              )}
              {toast.action && <div className="mt-2">{toast.action}</div>}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return {
    toast: context.addToast,
    dismiss: context.removeToast,
  };
}

// Simplified function for external use
export const toast = (props: Omit<ToastType, "id">) => {
  console.log("Toast notification:", props.title, props.description);
};
