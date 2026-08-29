/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface ToastItem {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, 'id'>) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title: string = 'Success') => addToast({ type: 'success', title, message }), [addToast]);
  const error = useCallback((message: string, title: string = 'Error') => addToast({ type: 'error', title, message, duration: 6000 }), [addToast]);
  const info = useCallback((message: string, title: string = 'Notice') => addToast({ type: 'info', title, message }), [addToast]);
  const warning = useCallback((message: string, title: string = 'Warning') => addToast({ type: 'warning', title, message, duration: 5000 }), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Fixed Toast Stack */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-xl animate-slide-in transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-[#0f241a]/95 border-emerald-500/40 text-emerald-100 shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-[#291010]/95 border-red-500/40 text-red-100 shadow-red-950/40'
                : toast.type === 'warning'
                ? 'bg-[#2b1f09]/95 border-amber-500/40 text-amber-100 shadow-amber-950/40'
                : 'bg-[#10192e]/95 border-blue-500/40 text-blue-100 shadow-blue-950/40'
            }`}
          >
            <span
              className={`material-symbols-outlined text-xl shrink-0 mt-0.5 ${
                toast.type === 'success'
                  ? 'text-emerald-400'
                  : toast.type === 'error'
                  ? 'text-red-400'
                  : toast.type === 'warning'
                  ? 'text-amber-400'
                  : 'text-blue-400'
              }`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {toast.type === 'success'
                ? 'check_circle'
                : toast.type === 'error'
                ? 'error'
                : toast.type === 'warning'
                ? 'warning'
                : 'info'}
            </span>
            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="font-semibold text-sm leading-tight text-white mb-0.5">{toast.title}</h5>}
              <p className="text-xs text-opacity-90 leading-relaxed text-gray-200">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors shrink-0 p-1"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
