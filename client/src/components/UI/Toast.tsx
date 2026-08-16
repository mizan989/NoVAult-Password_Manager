import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, XCircle, X } from "lucide-react";
import { useToast, ToastType } from "../../hooks/useToast";

const icons: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
  error: XCircle,
};

const styles: Record<ToastType, { border: string; bg: string; text: string; iconColor: string }> = {
  success: {
    border: "border-emerald-200",
    bg: "bg-white/95",
    text: "text-slate-900",
    iconColor: "text-emerald-500",
  },
  info: {
    border: "border-blue-200",
    bg: "bg-white/95",
    text: "text-slate-900",
    iconColor: "text-blue-500",
  },
  warning: {
    border: "border-amber-200",
    bg: "bg-white/95",
    text: "text-slate-900",
    iconColor: "text-amber-500",
  },
  error: {
    border: "border-rose-200",
    bg: "bg-white/95",
    text: "text-slate-900",
    iconColor: "text-rose-500",
  },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const type = t.type || "success";
          const Icon = icons[type];
          const style = styles[type];

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-auto flex items-center gap-3 rounded-xl border ${style.border} ${style.bg} px-4 py-3 shadow-card backdrop-blur-md min-w-[280px] max-w-sm`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${style.iconColor}`} />
              <div className="flex-1">
                <p className={`text-sm font-medium ${style.text}`}>{t.title}</p>
                {t.description && (
                  <p className="text-xs text-vault-muted mt-0.5">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-vault-muted hover:text-vault-text transition-colors p-1"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
