"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, ArrowRight, Menu, X, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/src/store/auth.store";

export const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-[#f7faf6]/95 backdrop-blur-md border-b border-[#bec9c3]/30 shadow-xs"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#005440] flex items-center justify-center text-white shadow-md shadow-[#005440]/15 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-5 h-5 text-[#a0f3d4]" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-2xl tracking-tight text-[#181d1a]">
              Kafla
            </span>
            <span className="text-[10px] tracking-wider uppercase font-bold text-[#476459] -mt-1">
              Group Travel Hub
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#route-map"
            className="text-sm font-semibold text-[#3f4944] hover:text-[#005440] transition-colors"
          >
            Route Map
          </a>
          <a
            href="#features"
            className="text-sm font-semibold text-[#3f4944] hover:text-[#005440] transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-semibold text-[#3f4944] hover:text-[#005440] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#faq"
            className="text-sm font-semibold text-[#3f4944] hover:text-[#005440] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Auth CTA Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <Link
              href="/trips/groups"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#005440] text-white text-sm font-bold hover:bg-[#0f6e56] transition-all shadow-sm shadow-[#005440]/20 active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4 text-[#a0f3d4]" />
              <span>Go to Trips</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 text-sm font-bold text-[#3f4944] hover:text-[#005440] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#005440] text-white text-sm font-bold hover:bg-[#0f6e56] transition-all shadow-sm shadow-[#005440]/20 active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-[#a0f3d4]" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-[#3f4944] hover:bg-[#ebefeb] transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#f7faf6] border-b border-[#bec9c3]/30 px-5 pt-3 pb-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            <a
              href="#route-map"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#3f4944] hover:text-[#005440] py-1"
            >
              Route Map
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#3f4944] hover:text-[#005440] py-1"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#3f4944] hover:text-[#005440] py-1"
            >
              How It Works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-[#3f4944] hover:text-[#005440] py-1"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-3 border-t border-[#bec9c3]/20 flex flex-col gap-2.5">
            {isAuthenticated && user ? (
              <Link
                href="/trips/groups"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#005440] text-white text-sm font-bold"
              >
                <LayoutDashboard className="w-4 h-4 text-[#a0f3d4]" />
                <span>Go to Trips</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-[#3f4944] border border-[#bec9c3]/40 rounded-full"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#005440] text-white text-sm font-bold"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 text-[#a0f3d4]" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
