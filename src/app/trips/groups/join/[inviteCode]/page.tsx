"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { useJoinWithLink } from "@/src/features/user/trips/features/members/hooks/hooks";

export default function JoinGroupPage() {
  const { inviteCode } = useParams();
  const router = useRouter();
  const join = useJoinWithLink();
  const { mutate, isPending, isSuccess, isError } = join;

  useEffect(() => {
    if (!inviteCode || isPending || isSuccess || isError) return;

    mutate(inviteCode as string, {
      onSuccess: (res) => {
        router.replace(`/trips/groups/${res.data.groupId}/members`);
      },
    });
  }, [inviteCode, isError, isPending, isSuccess, mutate, router]);

  return (
    <main className="min-h-screen pt-20 pb-32 flex items-center justify-center px-4 bg-[#f7faf6]">
      <div className="w-full max-w-md rounded-2xl bg-white border border-[#e0e3e0] p-8 text-center shadow-sm">
        <div className="w-14 h-14 mx-auto rounded-full bg-[#eef8f4] flex items-center justify-center text-[#0f6e56]">
          <Users className="w-6 h-6 stroke-[2.3]" />
        </div>
        <h1 className="mt-5 text-2xl font-black text-[#181d1a]">Joining group</h1>
        <p className="mt-2 text-sm text-[#3f4944]">{isError ? "This invite link could not be used." : "Adding you to the trip group..."}</p>
        {isError && (
          <button onClick={() => router.replace("/trips/groups")} className="mt-6 h-11 px-5 rounded-xl bg-[#0f6e56] text-white font-semibold">
            View groups
          </button>
        )}
      </div>
    </main>
  );
}
