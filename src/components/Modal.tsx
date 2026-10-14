"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalLayoutProps {
  isOpen: boolean;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function ModalLayout({ isOpen, title, size = "lg", onClose, children, footer }: ModalLayoutProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const widthMap = {
    sm: "max-w-sm sm:max-w-md",
    md: "max-w-md sm:max-w-xl",
    lg: "max-w-full sm:max-w-2xl lg:max-w-3xl",
    xl: "max-w-full sm:max-w-3xl lg:max-w-5xl",
  };

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/50 backdrop-blur-sm
        flex items-center justify-center
        p-3 sm:p-6
        animate-in fade-in duration-150
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full
          ${widthMap[size]}
          bg-white
          rounded-2xl sm:rounded-3xl
          shadow-2xl
          overflow-hidden
          flex flex-col
          max-h-[92vh] sm:max-h-[88vh]
          animate-in zoom-in-95 duration-200
        `}
      >
        {title && (
          <div className="px-4 sm:px-8 py-3.5 sm:py-5 border-b border-[#bec9c3]/20 bg-white sticky top-0 z-10">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#181d1a] tracking-tight font-headline truncate">{title}</h2>

              <button
                onClick={onClose}
                className="
                  w-8 h-8 sm:w-10 sm:h-10
                  rounded-full
                  bg-gray-100 hover:bg-gray-200
                  active:scale-95
                  flex items-center justify-center
                  text-gray-600 hover:text-gray-900
                  transition-all
                  shrink-0
                "
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto hide-scrollbar">{children}</div>

        {footer && <div className="border-t border-[#bec9c3]/20 bg-[#f5f7f6] p-3.5 sm:p-6">{footer}</div>}
      </div>
    </div>
  );
}
