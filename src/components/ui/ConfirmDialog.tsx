"use client";

import Modal from "./Modal";
import Button from "./Button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "danger" | "primary";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === "danger" ? "bg-red-50" : "bg-brand-50"}`}>
          <AlertTriangle
            size={22}
            className={variant === "danger" ? "text-red-500" : "text-nutado-green"}
          />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-nutado-gray-900">{title}</h3>
          <p className="text-sm text-nutado-gray-500 mt-1.5 leading-relaxed">{description}</p>
        </div>
        <div className="flex gap-3 w-full pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant}
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
