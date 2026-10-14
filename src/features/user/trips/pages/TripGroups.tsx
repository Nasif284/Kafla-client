"use client";

import { useState } from "react";
import ModalLayout from "@/src/components/Modal";
import CreateGroupCard from "../components/CreateGroupCard";
import TripGroupCard from "../components/TripGroupCard";
import { GroupData } from "../interfaces/interface";
import CreateGroupButton from "../components/CreateGroupButton";
import { useGetActiveGroups, useGetPastGroups } from "../hooks/trip.hooks";
import CreateGroup from "../components/CreateGroup";
import EmptyTripGroupsState from "../components/EmptyTripGroupsState";
import JoinTripModal from "../components/JoinTripModal";
import { Users } from "lucide-react";

export default function TripGroups() {
  const [selectedTab, setSelectedTab] = useState<"active" | "past">("active");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [suggestedTripName, setSuggestedTripName] = useState("");

  const { data: activeData, isLoading: activeLoading } = useGetActiveGroups();
  const { data: pastData, isLoading: pastLoading } = useGetPastGroups();

  const activeGroups = activeData?.data?.groups || [];
  const pastGroups = pastData?.data?.groups || [];

  const isLoading = activeLoading || pastLoading;
  const hasAnyTrips = activeGroups.length > 0 || pastGroups.length > 0;

  const handleOpenCreateModal = (suggestedName?: string) => {
    setSuggestedTripName(suggestedName || "");
    setCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalOpen(false);
    setSuggestedTripName("");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen pb-20 sm:pb-32 bg-[#f7faf6]">
        <div className="max-w-7xl mx-auto w-full pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4 mb-6 sm:mb-10">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#181d1a] tracking-tight font-headline">
                Your Group Trips
              </h2>
              <p className="text-xs sm:text-base text-[#3f4944] mt-1 font-medium">
                Manage your active travel squads and upcoming adventures.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-56 animate-pulse border border-[#bec9c3]/20 p-3.5"
              >
                <div className="bg-gray-200 h-28 rounded-xl mb-3" />
                <div className="bg-gray-200 h-4 w-3/4 rounded mb-2" />
                <div className="bg-gray-200 h-3 w-1/2 rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pb-20 sm:pb-32 bg-[#f7faf6]">
      <div className="max-w-7xl mx-auto w-full pt-24 sm:pt-28 px-4 sm:px-6 lg:px-8">
        {hasAnyTrips ? (
          <>
            {/* Header section */}
            <div className="flex justify-between items-center gap-4 mb-5 sm:mb-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#181d1a] tracking-tight font-headline">
                  Your Group Trips
                </h2>
                <p className="text-xs sm:text-base text-[#3f4944] mt-1 font-medium">
                  Manage your active travel squads and past adventures.
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => setJoinModalOpen(true)}
                  className="bg-white hover:bg-[#f1f4f1] border border-[#bec9c3]/60 hover:border-[#005440] text-[#005440] px-3 py-2 sm:px-4 sm:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 active:scale-95 transition-all shadow-2xs cursor-pointer"
                  title="Join a trip with an invite code"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Join Trip</span>
                  <span className="sm:hidden">Join</span>
                </button>

                <CreateGroupButton onClick={() => handleOpenCreateModal()} />
              </div>
            </div>

            {/* Simple Segmented Tab Switcher */}
            <div className="inline-flex p-1 bg-[#ebefeb] rounded-xl mb-6 sm:mb-8 border border-[#bec9c3]/30">
              <button
                onClick={() => setSelectedTab("active")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedTab === "active"
                    ? "bg-white text-[#005440] shadow-xs"
                    : "text-[#3f4944] hover:text-[#181d1a]"
                }`}
              >
                Active Trips ({activeGroups.length})
              </button>
              <button
                onClick={() => setSelectedTab("past")}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedTab === "past"
                    ? "bg-white text-[#005440] shadow-xs"
                    : "text-[#3f4944] hover:text-[#181d1a]"
                }`}
              >
                Past Trips ({pastGroups.length})
              </button>
            </div>

            {/* Active Trips Tab Content */}
            {selectedTab === "active" && (
              <>
                {activeGroups.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {activeGroups.map((group: GroupData) => (
                      <TripGroupCard key={group.id} group={group} isPast={false} />
                    ))}
                    <CreateGroupCard onClick={() => handleOpenCreateModal()} />
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#bec9c3]/30 p-8 sm:p-10 text-center max-w-lg mx-auto">
                    <p className="text-base font-bold text-[#181d1a]">No active trips right now</p>
                    <p className="text-xs sm:text-sm text-[#3f4944] mt-1 mb-6">
                      You don't have any ongoing or upcoming trips. Ready to plan your next squad journey?
                    </p>
                    <button
                      onClick={() => handleOpenCreateModal()}
                      className="px-5 py-2.5 rounded-xl bg-[#005440] text-white font-bold text-xs sm:text-sm hover:bg-[#0f6e56] transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      Create New Trip
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Past Trips Tab Content */}
            {selectedTab === "past" && (
              <>
                {pastGroups.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {pastGroups.map((group: GroupData) => (
                      <TripGroupCard key={group.id} group={group} isPast={true} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-[#bec9c3]/30 p-8 sm:p-10 text-center max-w-lg mx-auto">
                    <p className="text-base font-bold text-[#181d1a]">No past trips yet</p>
                    <p className="text-xs sm:text-sm text-[#3f4944] mt-1">
                      Trips that have concluded will be automatically preserved here.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <EmptyTripGroupsState
            onCreateClick={handleOpenCreateModal}
            onJoinClick={() => setJoinModalOpen(true)}
          />
        )}
      </div>

      {/* Create Group Modal */}
      {createModalOpen && (
        <ModalLayout
          isOpen={createModalOpen}
          onClose={handleCloseCreateModal}
          title="Create New Group"
        >
          <CreateGroup
            onClose={handleCloseCreateModal}
            initialName={suggestedTripName}
          />
        </ModalLayout>
      )}

      {/* Join Trip Modal */}
      <JoinTripModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
      />
    </main>
  );
}
