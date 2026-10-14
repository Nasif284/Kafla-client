function ProgressBar({ pct, color = "bg-[#0f6e56]", h = "h-2" }: { pct: number; color?: string; h?: string }) {
  return (
    <div className={`w-full ${h} bg-[#e5e9e5] rounded-full overflow-hidden`}>
      <div className={`${h} ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

