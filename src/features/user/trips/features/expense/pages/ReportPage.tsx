"use client";
import { ExpenseCategoryReportDTO, ExpenseMemberReportDTO } from "../interface/interface";
import Avatar from "@/src/components/Avatar";
import { useGetReport } from "../hooks/hooks";
import { useParams } from "next/navigation";

const CATEGORY_PALETTE: { bg: string; text: string; bar: string }[] = [
  { bg: "bg-[#005440]/10", text: "text-[#005440]", bar: "bg-[#005440]" },
  { bg: "bg-[#476459]/10", text: "text-[#476459]", bar: "bg-[#476459]" },
  { bg: "bg-[#78352b]/10", text: "text-[#78352b]", bar: "bg-[#78352b]" },
];

function fmt(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
export default function ExpenseReportPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetReport(id as string);
  const report = data?.data;
    if (isLoading) {
    return <h1>Loading...</h1>
}
  return (
    <>
      {" "}
      <div className="flex-1 flex flex-col gap-6">
        {/* Overall KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#bec9c3]/15 shadow-sm">
            <p className="text-[10px] font-bold text-[#3f4944]/60 uppercase tracking-widest mb-2">Total Group Expense</p>
            <h3 className="text-3xl font-black text-[#005440] font-[Manrope,sans-serif]">{fmt(report.overall.totalExpenseAmount)}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#bec9c3]/15 shadow-sm">
            <p className="text-[10px] font-bold text-[#3f4944]/60 uppercase tracking-widest mb-2">Average per Member</p>
            <h3 className="text-3xl font-black text-[#005440] font-[Manrope,sans-serif]">{fmt(report.overall.averageExpensePerMember)}</h3>
          </div>
        </div>

        {/* Spending by Category */}
        <section className="bg-white rounded-2xl border border-[#bec9c3]/15 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#bec9c3]/10 bg-[#f1f4f1]/30">
            <h3 className="text-[10px] font-bold text-[#3f4944]/60 uppercase tracking-widest">Spending by Category</h3>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {report.categories.map((cat:ExpenseCategoryReportDTO, i:number) => {
              const palette = CATEGORY_PALETTE[i % CATEGORY_PALETTE.length];
              return (
                <div key={cat.category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 ${palette.bg} ${palette.text} text-[10px] font-bold rounded uppercase`}>{cat.category}</span>
                    <span className="text-sm font-bold text-[#181d1a]">{fmt(cat.totalAmount)}</span>
                  </div>
                  <div className="w-full bg-[#e0e3e0] h-1.5 rounded-full overflow-hidden">
                    <div className={`${palette.bar} h-full rounded-full transition-all duration-700`} style={{ width: `${cat.percentage}%` }} />
                  </div>
                  <p className="text-[10px] text-[#3f4944]/60">{cat.percentage}% of total</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Member Breakdown */}
        <section className="bg-white rounded-2xl border border-[#bec9c3]/15 overflow-hidden">
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#bec9c3]/10 bg-[#f1f4f1]/30">
            <h3 className="text-[10px] font-bold text-[#3f4944]/60 uppercase tracking-widest">Member Breakdown</h3>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f1f4f1]/50">
                <tr className="text-[10px] font-bold text-[#3f4944]/60 uppercase tracking-widest">
                  <th className="px-6 py-3">Member</th>
                  <th className="px-6 py-3 text-right">Paid</th>
                  <th className="px-6 py-3 text-right">Share</th>
                  <th className="px-6 py-3 text-right">Net Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bec9c3]/10">
                {report.members.map((member: ExpenseMemberReportDTO) => {
                  const isNegative = member.balance < 0;
                  return (
                    <tr key={member.memberId} className="text-sm">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar url={member.avatarUrl} name={member.fullName} size={32} />
                          <span className="font-bold text-[#181d1a] truncate">{member.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#181d1a] text-right">{fmt(member.paid)}</td>
                      <td className="px-6 py-4 font-medium text-[#181d1a] text-right">{fmt(member.owes)}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`font-bold ${isNegative ? "text-[#ba1a1a]" : "text-[#005440]"}`}>
                          {member.balance > 0 ? "+" : ""}
                          {fmt(member.balance)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card / Compact List View */}
          <div className="sm:hidden divide-y divide-[#bec9c3]/10">
            {report.members.map((member: ExpenseMemberReportDTO) => {
              const isNegative = member.balance < 0;
              return (
                <div key={member.memberId} className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Avatar url={member.avatarUrl} name={member.fullName} size={32} />
                      <span className="font-bold text-sm text-[#181d1a] truncate">{member.fullName}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#6f7a74] uppercase font-bold block">Net Balance</span>
                      <span className={`text-sm font-black ${isNegative ? "text-[#ba1a1a]" : "text-[#005440]"}`}>
                        {member.balance > 0 ? "+" : ""}
                        {fmt(member.balance)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f1f4f1] bg-[#f8faf8] p-2.5 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-[#6f7a74] uppercase font-semibold block">Paid</span>
                      <span className="font-bold text-[#181d1a]">{fmt(member.paid)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6f7a74] uppercase font-semibold block">Share</span>
                      <span className="font-bold text-[#181d1a]">{fmt(member.owes)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
