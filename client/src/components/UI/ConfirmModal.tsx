import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import Button from "./Button";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = true,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl border border-vault-border bg-vault-surface p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`rounded-xl p-2.5 ${
                  danger ? "bg-rose-50 text-rose-500 border border-rose-100" : "bg-blue-50 text-blue-500"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-base font-semibold text-slate-900">{title}</h3>
            </div>
            <p className="text-sm text-vault-muted mb-6 leading-relaxed">{message}</p>
            <div className="flex justify-end gap-2.5">
              <Button variant="ghost" onClick={onCancel} disabled={loading}>
                {cancelText}
              </Button>
              <Button
                variant={danger ? "danger" : "primary"}
                onClick={onConfirm}
                loading={loading}
              >
                {confirmText}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
