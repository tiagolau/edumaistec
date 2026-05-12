import { z } from "zod";

const formFieldSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, { error: "Nome do campo é obrigatório" }),
  label: z.string().min(1, { error: "Label é obrigatório" }),
  type: z.enum(["text", "email", "phone", "select", "checkbox"]),
  placeholder: z.string().optional(),
  required: z.boolean(),
  options: z.array(z.string()).optional(),
  order: z.number().int().min(0),
});

export const createLandingPageSchema = z.object({
  title: z
    .string({ error: "Título é obrigatório" })
    .min(2, { error: "Título deve ter pelo menos 2 caracteres" })
    .max(200),
  slug: z
    .string({ error: "Slug é obrigatório" })
    .min(2, { error: "Slug deve ter pelo menos 2 caracteres" })
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Slug deve conter apenas letras minúsculas, números e hífens",
    }),
  redirectUrl: z
    .string({ error: "URL de redirect é obrigatória" })
    .url({ error: "URL de redirect inválida" }),
  webhookUrl: z
    .string()
    .url({ error: "URL de webhook inválida" })
    .optional()
    .or(z.literal("")),
  formFields: z
    .array(formFieldSchema)
    .min(1, { error: "Pelo menos um campo é necessário" }),
  bannerUrl: z.string().optional(),
  bannerPath: z.string().optional(),
});

export const updateLandingPageSchema = createLandingPageSchema.partial();

export const submissionSchema = z.object({
  landingPageId: z.string().min(1, { error: "ID da landing page é obrigatório" }),
  data: z.record(z.string(), z.unknown()),
});

export type CreateLandingPageData = z.infer<typeof createLandingPageSchema>;
export type UpdateLandingPageData = z.infer<typeof updateLandingPageSchema>;
export type SubmissionData = z.infer<typeof submissionSchema>;
