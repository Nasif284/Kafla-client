export interface Connection {
  id?: string;
  userId: string;
  fullName: string;
  avatarUrl: string;
  bio?: string;
  location?: string;
}

export type MemberRole = "admin" | "member";

export interface MemberMenuProps {
  member: Member;
  isCurrentUserAdmin: boolean;
  onPromote: () => void;
  onRemove: () => void;
  onClose: () => void;
}

export interface ConfirmModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface Member {
  id: string;
  name: string;
  userId: string;
  avatarUrl: string | null;
  joinedAt: Date;
  role: string;
}

export interface GroupInvite {
  id: string;
  groupId: string;
  invitedBy: string;
  invitedUserEmail: string;
  statusCode: string;
  createdAt: Date;
}