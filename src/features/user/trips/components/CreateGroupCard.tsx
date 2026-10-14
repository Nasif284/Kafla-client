import { Plus } from "lucide-react";

export default function CreateGroupCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group py-10 sm:py-14 px-4 min-h-[220px] flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#bec9c3]/60 bg-[#f1f4f1]/60 hover:bg-[#eaf4ef] hover:border-[#005440] active:scale-[0.99] transition-all duration-300 cursor-pointer"
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#c9eadb] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform text-[#005440] shadow-xs">
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </div>
      <span className="text-base sm:text-lg font-bold text-[#005440] font-headline">Create New Group</span>
      <p className="text-xs sm:text-sm text-[#3f4944] mt-1.5 px-4 sm:px-6 text-center font-medium">
        Start a new adventure and invite your travel squad to join.
      </p>
    </button>
  );
}