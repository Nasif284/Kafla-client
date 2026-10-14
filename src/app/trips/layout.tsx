import TripHQTopBar from "@/src/components/TripHQTopBar";
import AuthProvider from "@/src/components/providers/AuthProvider";
import CallProvider from "@/src/features/user/trips/features/call/components/CallProvider";
import React from "react";

export default function TripsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <CallProvider>
        <TripHQTopBar />
        {children}
      </CallProvider>
    </AuthProvider>
  );
}
