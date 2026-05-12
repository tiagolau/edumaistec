import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .min(2, { error: "Nome é obrigatório" })
    .max(100),
  email: z
    .string({ error: "Email é obrigatório" })
    .min(1, { error: "Email é obrigatório" })
    .email({ error: "Email inválido" }),
  phone: z.string().optional().default(""),
  subject: z
    .string({ error: "Assunto é obrigatório" })
    .min(2, { error: "Assunto é obrigatório" })
    .max(200),
  message: z
    .string({ error: "Mensagem é obrigatória" })
    .min(10, { error: "Mensagem deve ter pelo menos 10 caracteres" })
    .max(2000, { error: "Mensagem deve ter no máximo 2000 caracteres" }),
});

export type ContactFormData = z.infer<typeof contactSchema>;
