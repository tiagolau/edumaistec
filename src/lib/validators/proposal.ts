import { z } from "zod";

export const proposalSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .min(2, { error: "Nome é obrigatório" })
    .max(80),
  installments: z.number().min(1, { error: "Mínimo 1 parcela" }),
  firstDueDate: z.string({ error: "Data de vencimento é obrigatória" }).min(1, { error: "Data de vencimento é obrigatória" }),
  courses: z
    .array(
      z.object({
        id: z.number(),
        installmentValue: z.number().positive(),
        negotiatedValue: z.number().optional(),
        enrollmentFee: z.number().optional(),
      }),
    )
    .min(1, { error: "Selecione pelo menos um curso" }),
  paymentMethod: z.enum(["B", "C"]).optional(),
  message: z.string().max(500).optional().default(""),
});

export type ProposalFormData = z.infer<typeof proposalSchema>;
