import { z } from "zod";

// === Validação de CPF ===

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false; // todos iguais

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits.charAt(10))) return false;

  return true;
}

// === Step 1: Dados Pessoais ===

export const personalDataSchema = z.object({
  fullName: z
    .string({ error: "Nome completo é obrigatório" })
    .min(3, { error: "Nome deve ter pelo menos 3 caracteres" })
    .max(80, { error: "Nome deve ter no máximo 80 caracteres" }),
  cpf: z
    .string({ error: "CPF é obrigatório" })
    .min(1, { error: "CPF é obrigatório" })
    .refine((val) => isValidCPF(val), { error: "CPF inválido" }),
  email: z
    .string({ error: "Email é obrigatório" })
    .min(1, { error: "Email é obrigatório" })
    .email({ error: "Email inválido" }),
  phone: z
    .string({ error: "Telefone é obrigatório" })
    .min(1, { error: "Telefone é obrigatório" })
    .refine(
      (val) => val.replace(/\D/g, "").length >= 10,
      { error: "Telefone deve ter pelo menos 10 dígitos" },
    ),
  birthDate: z.string().optional().default(""),
  sex: z.union([z.enum(["M", "F"]), z.literal("")]).transform((v) => v || undefined).optional(),
  maritalStatus: z.union([z.enum(["S", "C", "P", "D", "V", "O"]), z.literal("")]).transform((v) => v || undefined).optional(),
  rg: z.string().optional().default(""),
  rgIssuer: z.string().optional().default(""),
  nationality: z.string().optional().default("brasileira"),
  motherName: z.string().optional().default(""),
  fatherName: z.string().optional().default(""),
});

// === Step 2: Endereço ===

export const addressSchema = z.object({
  cep: z
    .string({ error: "CEP é obrigatório" })
    .min(1, { error: "CEP é obrigatório" })
    .refine(
      (val) => val.replace(/\D/g, "").length === 8,
      { error: "CEP deve ter 8 dígitos" },
    ),
  state: z.string({ error: "UF é obrigatória" }).min(2, { error: "UF é obrigatória" }).max(2),
  city: z
    .string({ error: "Cidade é obrigatória" })
    .min(2, { error: "Cidade é obrigatória" })
    .max(100),
  neighborhood: z
    .string({ error: "Bairro é obrigatório" })
    .min(2, { error: "Bairro é obrigatório" })
    .max(100),
  street: z
    .string({ error: "Logradouro é obrigatório" })
    .min(2, { error: "Logradouro é obrigatório" })
    .max(100),
  number: z
    .string({ error: "Número é obrigatório" })
    .min(1, { error: "Número é obrigatório" })
    .max(50),
  complement: z.string().max(100).optional().default(""),
});

// === Step 3: Qualificação (Escolaridade + Experiência) ===

export const educationSchema = z.object({
  educationLevel: z.enum(["medio_completo", "superior_cursando", "superior_completo"], {
    error: "Selecione sua escolaridade",
  }),
  experienceYears: z.enum(["1_2", "2_5", "5_mais"], {
    error: "Selecione seu tempo de experiência (mínimo 1 ano)",
  }),
  experienceArea: z
    .string({ error: "Descreva sua área de atuação" })
    .min(2, { error: "Descreva brevemente sua área de atuação" })
    .max(200),
});

// === Step 4: Seleção de Curso ===

export const courseSelectionSchema = z.object({
  courses: z
    .array(
      z.object({
        id: z.number(),
        title: z.string(),
        installmentValue: z.number().min(0),
        enrollmentFee: z.number().optional(),
        downPayment: z.number().optional(),
      }),
    )
    .min(1, { error: "Selecione pelo menos um curso" }),
});

// === Step 5: Pagamento ===

export const paymentSchema = z.object({
  paymentMethod: z.enum(["B", "C", "X"], {
    error: "Selecione a forma de pagamento",
  }),
  installments: z.number().min(1, { error: "Selecione o número de parcelas" }),
  firstDueDate: z.string({ error: "Data de vencimento é obrigatória" }).min(1, { error: "Data de vencimento é obrigatória" }),
});

// === Schema completo (validação server-side) ===

export const enrollmentSchema = personalDataSchema
  .merge(addressSchema)
  .merge(educationSchema)
  .merge(courseSelectionSchema)
  .merge(paymentSchema);

// === Tipos inferidos ===

export type PersonalDataFormData = z.infer<typeof personalDataSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type EducationFormData = z.infer<typeof educationSchema>;
export type CourseSelectionFormData = z.infer<typeof courseSelectionSchema>;
export type PaymentFormData = z.infer<typeof paymentSchema>;
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

// === Nomes dos campos por etapa (para validação parcial) ===

export const STEP_FIELDS: Record<number, string[]> = {
  0: ["educationLevel", "experienceYears", "experienceArea"],
  1: ["fullName", "cpf", "email", "phone", "birthDate", "sex", "maritalStatus", "rg", "rgIssuer", "nationality", "motherName", "fatherName"],
  2: ["cep", "state", "city", "neighborhood", "street", "number", "complement"],
  3: ["courses"],
  4: ["paymentMethod", "installments", "firstDueDate"],
};
