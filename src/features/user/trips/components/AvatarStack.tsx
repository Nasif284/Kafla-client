import { GroupMembers } from "../interfaces/interface";

export default function AvatarStack({ members }: { members: GroupMembers[] }) {
  const visibleMembers = members.slice(0, 4);
  const extra = Math.max(0, members.length - 4);

  return (
    <div className="flex items-center">
      {visibleMembers.map((m, i) => (
        <div
          key={m.id}
          className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-[#e0e3e0] shrink-0"
          style={{ marginLeft: i > 0 ? "-0.75rem" : 0 }}
        >
          {m.avatarUrl ? (
            <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#005440] text-white flex items-center justify-center text-[11px] font-bold">
              {m.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>
      ))}

      {extra > 0 && (
        <div
          className="w-8 h-8 rounded-full border-2 border-white bg-[#0f6e56] flex items-center justify-center text-[10px] font-bold text-white shrink-0"
          style={{ marginLeft: "-0.75rem" }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
}
