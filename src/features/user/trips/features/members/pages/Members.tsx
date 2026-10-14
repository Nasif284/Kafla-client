"use client";
import { useState, useEffect } from "react";
import { GroupInvite, Member } from "../interfaces/interfaces";
import MemberMenu from "../components/MembersMenu";
import InviteModal from "../../../components/InviteModal";
import ConfirmDialog from "@/src/components/ConfirmDialog";
import Avatar from "@/src/components/Avatar";
import ShareLinkModal from "../components/ShareLinkModal";
import { useChangeMemberRole, useGetInvites, useGetMembers, useInviteByEmail, useLeaveGroup, useRemoveMember } from "../hooks/hooks";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/src/store/auth.store";
import { Mail, Star, MoreVertical } from "lucide-react";

export default function MembersPage() {
  const { id } = useParams();
  const userId = useAuthStore((state) => state.user?.id);
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);
  const { data, isLoading } = useGetMembers(id as string);
  const membersData = data?.data?.members;
  const { data: invitesData, isLoading: invitesLoading } = useGetInvites(id as string);
  const invites = invitesData?.data?.invites;
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<null | {
    type: "remove" | "leave" | "delete";
    memberId?: string;
  }>(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const inviteByEmail = useInviteByEmail();
  const members = [...(membersData ?? [])].sort((a, b) => {
    if (a.userId === currentUserId) return -1;
    if (b.userId === currentUserId) return 1;
    return 0;
  });
  const currentMember = members.find((m) => m.userId === currentUserId);
  const isCurrentUserAdmin = currentMember?.role === "admin";
  useEffect(() => {
    document.body.style.overflow = confirmModal || inviteModal ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [confirmModal, inviteModal]);

  const remove = useRemoveMember();
  const changeRole = useChangeMemberRole();
  const leave = useLeaveGroup();

  function promoteMember(memberId: string) {
    changeRole.mutate({ groupId: id as string, memberId });
    setOpenMenuId(null);
  }

  function removeMember() {
    if (!confirmModal?.memberId) return;
    remove.mutate({ groupId: id as string, memberId: confirmModal.memberId });
    setConfirmModal(null);
  }
  function leaveGroup() {
    leave.mutate(id as string);
    setConfirmModal(null);
  }

  function resendInvite(email: string) {
    setResendingEmail(email);

    inviteByEmail.mutate(
      { id: id as string, email },
      {
        onSettled: () => {
          setResendingEmail(null);
        },
      },
    );
  }

  function handleInvite(email: string) {
    inviteByEmail.mutate(
      { id: id as string, email },
      {
        onSuccess: () => {
          setInviteModal(false);
        },
      },
    );
  }

  function confirmAction() {
    if (!confirmModal) return;
    if (confirmModal.type === "remove") {
      removeMember();
      return;
    }
    if (confirmModal.type === "leave") {
      leaveGroup()
      return;
    }
  }

  const confirmConfig = {
    remove: {
      title: "Remove member?",
      description: `${members?.find((m: Member) => m.userId === confirmModal?.memberId)?.name ?? "This member"} will be removed from the trip and lose access to all shared content.`,
      confirmLabel: "Remove",
      confirmClass: "bg-[#ba1a1a] text-white hover:bg-red-700",
    },
    leave: {
      title: "Leave trip?",
      description: "You'll lose access to the trip dashboard, expenses, and shared content. This can't be undone.",
      confirmLabel: "Leave trip",
      confirmClass: "bg-[#ba1a1a] text-white hover:bg-red-700",
    },
    delete: {
      title: "Delete trip?",
      description: "This will permanently delete this trip for all members. There's no going back.",
      confirmLabel: "Delete forever",
      confirmClass: "bg-[#ba1a1a] text-white hover:bg-red-700",
    },
  };
  if (isLoading) {
    return (
      <div className="max-w-[700px] mx-auto w-full space-y-10">
        <h1>Loading...</h1>
      </div>
    );
  }
  return (
    <>
      <div className="max-w-[700px] mx-auto w-full space-y-6 sm:space-y-8">
        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-headline tracking-tight text-[#181d1a]">Trip Members</h2>
            <p className="text-xs sm:text-sm text-[#6f7a74] font-medium mt-0.5">{members.length} travelers currently in this group</p>
          </div>
        </section>

        {/* Member list */}
        <section className="space-y-2.5">
          {members.map((member: Member) => (
            <div key={member.id} className="bg-white min-h-[72px] p-3.5 sm:px-5 sm:py-4 flex items-center justify-between rounded-2xl border border-[#bec9c3]/20 shadow-xs transition-all hover:border-[#bec9c3]/40 hover:shadow-sm">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1 pr-2">
                <Avatar src={member.avatarUrl} alt={member.name} size={44} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="font-bold text-[#181d1a] text-xs sm:text-sm truncate max-w-[160px] sm:max-w-none">
                      {member.userId == currentUserId ? member.name + " (You)" : member.name}
                    </span>

                    {/* Admin star */}
                    {member.role === "admin" && <span className="text-[#005440] shrink-0"><Star className="w-3.5 h-3.5 fill-current" /></span>}

                    {/* Role badge */}
                    {member.role === "admin" ? (
                      <span className="bg-[#005440]/10 text-[#005440] px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0">Admin</span>
                    ) : (
                      <span className="bg-[#e5e9e5] text-[#3f4944] px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0">Member</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#6f7a74] mt-0.5">
                    <span>
                      Joined{" "}
                      {new Date(member.joinedAt).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                        year: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {member.userId !== userId && (
                <div className="flex items-center shrink-0">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === member.id ? null : member.id);
                      }}
                      className="p-1.5 sm:p-2 hover:bg-[#f1f4f1] rounded-full transition-colors text-[#6f7a74] cursor-pointer"
                      aria-label="Member options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {openMenuId === member.id && (
                      <MemberMenu
                        member={member}
                        isCurrentUserAdmin={isCurrentUserAdmin}
                        onPromote={() => promoteMember(member.userId)}
                        onRemove={() => {
                          setOpenMenuId(null);
                          setConfirmModal({ type: "remove", memberId: member.userId });
                        }}
                        onClose={() => setOpenMenuId(null)}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full">
          <button onClick={() => setInviteModal(true)} className="h-11 px-4 rounded-xl bg-[#005440] hover:bg-[#004030] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer">
            <Mail className="w-4 h-4" />
            Invite by Email
          </button>

          <button onClick={() => setShareModal(true)} className="h-11 px-4 rounded-xl border border-[#005440] text-[#005440] hover:bg-[#005440]/10 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
            Share Link
          </button>
        </div>

        {/* Pending Invites */}
        {invites?.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.15em] text-[#6f7a74]">Pending Invitations</h3>
              <span className="text-xs text-[#6f7a74]">{invites.length} pending</span>
            </div>
            <div className="bg-[#f8faf8] rounded-2xl border border-[#bec9c3]/20 overflow-hidden divide-y divide-[#bec9c3]/15">
              {invites.map((invite: GroupInvite) => (
                <div key={invite.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#e0e3e0] rounded-full flex items-center justify-center shrink-0 text-[#6f7a74]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#181d1a] text-xs sm:text-sm truncate max-w-[220px] sm:max-w-xs">{invite.invitedUserEmail}</p>
                      <p className="text-[11px] text-[#6f7a74]">
                        Invited{" "}
                        {new Date(invite.createdAt).toLocaleDateString("en-US", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end shrink-0">
                    <button onClick={() => resendInvite(invite.invitedUserEmail)} disabled={resendingEmail === invite.invitedUserEmail} className="text-xs font-bold text-[#005440] hover:underline transition-colors disabled:opacity-60 cursor-pointer">
                      {resendingEmail === invite.invitedUserEmail ? "Resending..." : "Resend"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Danger Zone */}
        <section className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-[#bec9c3] opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ba1a1a]/70">Danger Zone</span>
            <div className="h-px flex-1 bg-[#bec9c3] opacity-20" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <button onClick={() => setConfirmModal({ type: "leave" })} className="w-full sm:w-auto px-8 py-3 bg-[#ba1a1a] hover:bg-[#961313] text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer">
              Leave Trip
            </button>
          </div>
        </section>
      </div>

      {inviteModal && <InviteModal onClose={() => setInviteModal(false)} onInvite={handleInvite} isSending={inviteByEmail.isPending} />}
      {confirmModal && <ConfirmDialog {...confirmConfig[confirmModal.type]} onConfirm={confirmAction} onCancel={() => setConfirmModal(null)} />}
      {shareModal && <ShareLinkModal onClose={() => setShareModal(false)} id={id as string} />}
    </>
  );
}
