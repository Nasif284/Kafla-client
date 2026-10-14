"use client";

import React, { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen?: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "danger" | "primary" | "warning";
  confirmClass?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen = true,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "danger",
  confirmClass,
  isLoading = false,
  icon,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: "bg-[#ba1a1a] hover:bg-red-700 text-white",
    primary: "bg-[#0f6e56] hover:bg-[#005440] text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
  };

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-sm rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200"
      >
        {icon !== undefined ? (
          icon
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#ffdad6] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 text-[#ba1a1a]">
            <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-black text-[#181d1a] mb-2 font-headline">{title}</h3>
        <div className="text-xs sm:text-sm text-[#3f4944] mb-6 sm:mb-8 leading-relaxed">
          {description}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 h-11 sm:h-12 border-2 border-[#bec9c3] text-[#3f4944] font-bold rounded-xl hover:bg-[#f1f4f1] active:scale-95 transition-all text-sm cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 h-11 sm:h-12 font-bold rounded-xl active:scale-95 transition-all text-sm shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 ${
              confirmClass || variantStyles[confirmVariant]
            }`}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
