"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { LogOut, Users, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/src/store/auth.store";
import { useLogout } from "@/src/features/user/auth/hooks/auth.hooks";
import Avatar from "@/src/components/Avatar";
import Logo from "@/src/components/Logo";

export default function TripHQTopBar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on navigation
  useEffect(() => {
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logoutMutation.mutate();
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md z-40 px-4 sm:px-8 flex justify-between items-center border-b border-[#bec9c3]/20 shadow-xs">
      {/* ── Left: Logo & Brand ── */}
      <Link href="/trips/groups" className="flex items-center group">
        <Logo size={36} tagline="Group Travel" className="group-hover:opacity-90 transition-opacity" />
      </Link>

      {/* ── Right: Profile Menu with Logout ── */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl hover:bg-[#f1f4f1] border border-transparent hover:border-[#bec9c3]/20 transition-all cursor-pointer select-none"
          aria-label="User menu"
        >
          <Avatar
            name={user?.fullName || "User"}
            avatarUrl={user?.avatarUrl}
            size={34}
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-[#181d1a] truncate max-w-[120px]">
              {user?.fullName || "Account"}
            </span>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#6f7a74] transition-transform duration-200 hidden sm:block ${
              dropdownOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#bec9c3]/20 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            {/* User Details Header */}
            <div className="px-4 py-3 border-b border-[#bec9c3]/15">
              <p className="text-xs font-bold text-[#181d1a] truncate">
                {user?.fullName || "Traveler"}
              </p>
              <p className="text-[11px] text-[#6f7a74] truncate mt-0.5">
                {user?.email || ""}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <Link
                href="/trips/groups"
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#3f4944] hover:text-[#005440] hover:bg-[#f1f4f1] transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Users className="w-4 h-4 text-[#005440]" />
                <span>My Group Trips</span>
              </Link>
            </div>

            {/* Logout Action */}
            <div className="border-t border-[#bec9c3]/15 pt-1 mt-1">
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#ba1a1a] hover:bg-[#ffdad6]/30 transition-colors text-left disabled:opacity-60 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{logoutMutation.isPending ? "Logging out..." : "Log Out"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
