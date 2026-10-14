import { SplitPreviewProps } from "../interface/interface";
function formatAmount(n: number): string {
  return `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
export default function SplitPreview({ method, totalAmount, participants }: SplitPreviewProps) {
  if (method === "EQUAL") return null; // amounts shown inline in the equal display

  const totalShares = method === "SHARES" ? participants.reduce((a, p) => a + (parseFloat(p.value) || 0), 0) : 0;
  const totalPct = method === "PERCENTAGE" ? participants.reduce((a, p) => a + (parseFloat(p.value) || 0), 0) : 0;
  const totalCustom = method === "CUSTOM" ? participants.reduce((a, p) => a + (parseFloat(p.value) || 0), 0) : 0;

  const remainingPct = 100 - totalPct;
  const remainingCustom = totalAmount - totalCustom;

  return (
    <div className="mt-2 px-3 py-2 rounded-xl bg-[#f1f4f1] text-xs font-medium flex items-center justify-between">
      {method === "PERCENTAGE" && (
        <>
          <span className="text-[#3f4944]">
            Allocated: <span className="font-bold text-[#181d1a]">{totalPct.toFixed(1)}%</span> ({formatAmount((totalPct / 100) * totalAmount)})
          </span>
          <span className={`font-bold ${Math.abs(remainingPct) < 0.01 ? "text-[#005440]" : remainingPct < 0 ? "text-[#ba1a1a]" : "text-amber-600"}`}>{remainingPct < 0 ? `Over by ${Math.abs(remainingPct).toFixed(1)}%` : remainingPct < 0.01 ? "✓ 100% allocated" : `Remaining: ${remainingPct.toFixed(1)}%`}</span>
        </>
      )}
      {method === "CUSTOM" && (
        <>
          <span className="text-[#3f4944]">
            Allocated: <span className="font-bold text-[#181d1a]">{formatAmount(totalCustom)}</span>
          </span>
          <span className={`font-bold ${Math.abs(remainingCustom) < 0.01 ? "text-[#005440]" : remainingCustom < 0 ? "text-[#ba1a1a]" : "text-amber-600"}`}>{remainingCustom < 0 ? `Over by ${formatAmount(Math.abs(remainingCustom))}` : remainingCustom < 0.01 ? "✓ Fully allocated" : `Remaining: ${formatAmount(remainingCustom)}`}</span>
        </>
      )}
      {method === "SHARES" && (
        <>
          <span className="text-[#3f4944]">
            Total shares: <span className="font-bold text-[#181d1a]">{totalShares}</span>
            {totalShares > 0 && <span className="ml-1 text-[#3f4944]">· ₹{(totalAmount / totalShares).toFixed(0)}/share</span>}
          </span>
          <span className="font-bold text-[#005440]">{totalShares > 0 ? "✓ Ready" : "Enter shares"}</span>
        </>
      )}
    </div>
  );
}
