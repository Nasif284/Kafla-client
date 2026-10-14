"use client";

import DashboardNav from "@/src/features/user/trips/components/DashboardNav";
import GroupHeader from "@/src/features/user/trips/components/GroupHeader";
import TripNotFoundState from "@/src/features/user/trips/components/TripNotFoundState";
import { useGetGroup } from "@/src/features/user/trips/hooks/trip.hooks";
import { useParams } from "next/navigation";
import React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetGroup(id as string);
  const group = data?.data;

  return (
    <main className="min-h-screen pb-20 sm:pb-32 bg-[#f7faf6]">
      <div className="max-w-7xl mx-auto w-full pt-16 sm:pt-24 px-3 sm:px-6 lg:px-8">
        {isLoading ? (
          <section className="relative w-full h-[160px] sm:h-[220px] rounded-2xl overflow-hidden mb-6 sm:mb-8 bg-gray-200 animate-pulse border border-[#bec9c3]/20">
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 space-y-2">
              <div className="h-6 w-48 bg-gray-300 rounded-lg" />
              <div className="h-4 w-64 bg-gray-300 rounded-lg" />
            </div>
          </section>
        ) : isError || !group ? (
          <TripNotFoundState />
        ) : (
          <>
            <GroupHeader />
            <DashboardNav />
            {children}
          </>
        )}
      </div>
    </main>
  );
}
