import z from "zod";

export const participantSchema = z.object({
  memberId: z.string(),
  value: z.string(), 
});

export const expenseSchema = z
  .object({
    title: z.string().min(1, "Expense name is required"),
    amount: z.string().refine((v) => parseFloat(v) > 0, { message: "Amount must be greater than 0" }),
    category: z.string().min(1),
    paidById: z.string().min(1),
    splitMethod: z.enum(["EQUAL", "PERCENTAGE", "CUSTOM", "SHARES"]),
    participants: z.array(participantSchema),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const total = parseFloat(data.amount) || 0;
    if (total <= 0) return;

    if (data.splitMethod === "PERCENTAGE") {
      const sum = data.participants.reduce((acc, p) => acc + (parseFloat(p.value) || 0), 0);
      if (Math.abs(sum - 100) > 0.01) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Percentages must sum to 100% (currently ${sum.toFixed(1)}%)`, path: ["participants"] });
      }
      for (const [i, p] of data.participants.entries()) {
        const v = parseFloat(p.value) || 0;
        if (v < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Percentage cannot be negative", path: [`participants.${i}.value`] });
      }
    }

    if (data.splitMethod === "CUSTOM") {
      const sum = data.participants.reduce((acc, p) => acc + (parseFloat(p.value) || 0), 0);
      if (Math.abs(sum - total) > 0.01) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Custom amounts must sum to ₹${total.toFixed(0)} (currently ₹${sum.toFixed(0)})`, path: ["participants"] });
      }
      for (const [i, p] of data.participants.entries()) {
        const v = parseFloat(p.value) || 0;
        if (v < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Amount cannot be negative", path: [`participants.${i}.value`] });
        if (v > total) ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Amount cannot exceed ₹${total}`, path: [`participants.${i}.value`] });
      }
    }

    if (data.splitMethod === "SHARES") {
      for (const [i, p] of data.participants.entries()) {
        const v = parseFloat(p.value) || 0;
        if (v < 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shares cannot be negative", path: [`participants.${i}.value`] });
        if (!Number.isInteger(v) && v !== 0) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Shares must be whole numbers", path: [`participants.${i}.value`] });
      }
      const totalShares = data.participants.reduce((acc, p) => acc + (parseFloat(p.value) || 0), 0);
      if (totalShares <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Total shares must be greater than 0", path: ["participants"] });
      }
    }
  });

export type ExpenseFormValues = z.infer<typeof expenseSchema>;