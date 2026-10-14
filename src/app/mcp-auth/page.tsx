"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { userApi } from "@/src/lib/api-client";
import { useAuthStore } from "@/src/store/auth.store";
import Link from "next/link";
import { ShieldCheck, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

function McpAuthContent() {
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const { user, isAuthenticated } = useAuthStore();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activeUser, setActiveUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    userApi
      .get("/auth/me")
      .then((res) => {
        if (mounted) {
          const u = res.data?.data?.user;
          setActiveUser(u);
          useAuthStore.getState().setUser(u);
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        if (mounted) {
          useAuthStore.getState().logout();
          setActiveUser(null);
          setCheckingAuth(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleAuthorize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.post("/auth/mcp-token");
      const token = res.data?.data?.token;

      if (!token) {
        throw new Error("Failed to generate authorization token");
      }

      setGeneratedToken(token);

      if (callback) {
        try {
          // Send token to local MCP server callback
          await fetch(callback, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
            mode: "cors",
          });
          setAuthorized(true);
        } catch {
          // If direct fetch fails (e.g. CORS/GET handler), redirect
          window.location.href = `${callback}${callback.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
          return;
        }
      } else {
        setAuthorized(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to authorize";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-emerald-100/60 p-6 sm:p-8">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-700 text-white mb-3 shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Authorize Kafla AI</h1>
          <p className="text-sm text-gray-500 mt-1">Model Context Protocol (MCP) Integration</p>
        </div>

        {/* State: Verifying actual session */}
        {checkingAuth ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 mx-auto border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs text-gray-500 font-medium">Verifying Kafla session...</p>
          </div>
        ) : !activeUser ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-semibold text-gray-900">Sign in to Kafla first</h2>
            <p className="text-xs text-gray-600 mt-1 mb-5">
              You must be logged into your Kafla account to grant AI access to your trip itineraries.
            </p>
            <Link
              href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname + window.location.search : "/mcp-auth")}`}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-700 text-white font-medium text-sm hover:bg-emerald-800 transition"
            >
              Log in to Kafla <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : authorized ? (
          /* State: Successfully Authorized */
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Authorization Successful!</h2>
            <p className="text-sm text-gray-600 mt-2 mb-4">
              Your AI assistant is now connected to Kafla. You can close this tab and return to your chat.
            </p>
            {generatedToken && !callback && (
              <div className="mt-4 text-left">
                <p className="text-xs font-semibold text-gray-700 mb-1">Your Access Token:</p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs text-gray-800 font-mono break-all select-all">
                  {generatedToken}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* State: Confirmation Prompt */
          <div>
            {/* User Info Card */}
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100 mb-5">
              <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                {activeUser.fullName?.charAt(0) || "U"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{activeUser.fullName}</p>
                <p className="text-xs text-gray-500 truncate">{activeUser.email}</p>
              </div>
            </div>

            {/* Permission Scope */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Permissions Requested
              </p>
              <div className="flex items-start gap-2.5 text-xs text-gray-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>View your active group trips, destinations, and dates</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Read existing trip itineraries to identify gaps</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Save new multi-day itineraries <strong>only upon your explicit chat approval</strong></span>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAuthorize}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Authorizing..." : "Authorize AI Access"}
              </button>
              <button
                onClick={() => window.close()}
                className="w-full py-2.5 px-4 rounded-xl text-gray-600 hover:bg-gray-100 font-medium text-sm transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function McpAuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading...</div>}>
      <McpAuthContent />
    </Suspense>
  );
}
