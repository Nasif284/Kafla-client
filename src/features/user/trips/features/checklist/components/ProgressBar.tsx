export default function ProgressBar({ pct, color = "bg-[#0f6e56]", h = "h-3" }: { pct: number; color?: string; h?: string }) {
  return (
    <div className={`w-full ${h} bg-[#e0e3e0] rounded-full overflow-hidden`}>
      <div className={`${h} ${color} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
    </div>
  );
}
