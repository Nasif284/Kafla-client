export default function HeaderAction({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={label}
      title={label}
      className="rounded-xl p-2 sm:p-2.5 text-[#6f7a74] transition-all hover:bg-[#f1f4f1] hover:text-[#005440] active:scale-95 shrink-0"
    >
      {children}
    </button>
  );
}
