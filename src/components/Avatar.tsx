"use client";

import React, { useState, useEffect } from "react";

export interface AvatarProps {
  name?: string;
  alt?: string;
  avatarUrl?: string | null;
  src?: string | null;
  url?: string | null;
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  ring?: boolean;
  className?: string;
  grayscale?: boolean;
  isCurrentUser?: boolean;
}

function getInitials(name?: string): string {
  if (!name || !name.trim()) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const SIZE_MAP: Record<string, { box: string; text: string }> = {
  xs: { box: "w-6 h-6", text: "text-[10px]" },
  sm: { box: "w-8 h-8", text: "text-xs" },
  md: { box: "w-10 h-10", text: "text-xs sm:text-sm" },
  lg: { box: "w-12 h-12", text: "text-sm sm:text-base" },
  xl: { box: "w-16 h-16", text: "text-base sm:text-lg" },
};

export default function Avatar({
  name,
  alt,
  avatarUrl,
  src,
  url,
  size = "md",
  ring = false,
  className = "",
  grayscale = false,
  isCurrentUser = false,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const imageUrl = avatarUrl ?? src ?? url;
  const displayName = name || alt || "";

  useEffect(() => {
    setImgError(false);
  }, [imageUrl]);

  const initials = getInitials(displayName);
  const isNumericSize = typeof size === "number";
  const sizeConfig = !isNumericSize ? (SIZE_MAP[size] || SIZE_MAP.md) : null;

  return (
    <div className="relative inline-flex shrink-0">
      <div
        className={`rounded-full bg-[#0f6e56] flex items-center justify-center text-white font-bold overflow-hidden shrink-0 select-none ${
          ring ? "ring-2 ring-[#0f6e56]" : ""
        } ${grayscale ? "grayscale opacity-50" : ""} ${sizeConfig ? sizeConfig.box : ""} ${className}`}
        style={isNumericSize ? { width: size, height: size, minWidth: size, minHeight: size } : undefined}
      >
        {imageUrl && !imgError ? (
          <img
            className="w-full h-full object-cover"
            src={imageUrl}
            alt={displayName || "Avatar"}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className={sizeConfig ? sizeConfig.text : "text-xs"}>{initials}</span>
        )}
      </div>
      {isCurrentUser && (
        <span className="absolute -top-1 -right-1 bg-[#005440] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase leading-tight shadow-xs">
          You
        </span>
      )}
    </div>
  );
}
