import { z } from "zod";

export const TECHNICAL_AREAS = [
  "Administração",
  "Agente Comunitário",
  "Agricultura",
  "Agrimensura",
  "Agroindústria",
  "Agronegócio",
  "Alimentação Escolar",
  "Análises Clínicas",
  "Aquicultura",
  "Automação Industrial",
  "Construção Naval",
  "Cooperativismo",
  "Cuidados de Idosos",
  "Edificações",
  "Eletromecânica",
  "Eletrônica",
  "Eletrotécnica",
  "Enfermagem",
  "Estética",
  "Farmácia",
  "Gastronomia",
  "Informática",
  "Infraestrutura Escolar",
  "Logística",
  "Manutenção Automotiva",
  "Mecânica",
  "Mecatrônica",
  "Meio Ambiente",
  "Metalurgia",
  "Mineração",
  "Multimeios Didáticos",
  "Nutrição e Dietética",
  "Petróleo e Gás",
  "Portos",
  "Qualidade",
  "Química",
  "Refrigeração e Climatização",
  "Secretaria Escolar",
  "Segurança do Trabalho",
  "Soldagem",
  "Telecomunicações",
  "Transações Imobiliárias",
  "Vendas",
  "Vigilância em Saúde",
] as const;

export const BRAZILIAN_STATES = [
  { uf: "AC", name: "Acre" },
  { uf: "AL", name: "Alagoas" },
  { uf: "AP", name: "Amapá" },
  { uf: "AM", name: "Amazonas" },
  { uf: "BA", name: "Bahia" },
  { uf: "CE", name: "Ceará" },
  { uf: "DF", name: "Distrito Federal" },
  { uf: "ES", name: "Espírito Santo" },
  { uf: "GO", name: "Goiás" },
  { uf: "MA", name: "Maranhão" },
  { uf: "MT", name: "Mato Grosso" },
  { uf: "MS", name: "Mato Grosso do Sul" },
  { uf: "MG", name: "Minas Gerais" },
  { uf: "PA", name: "Pará" },
  { uf: "PB", name: "Paraíba" },
  { uf: "PR", name: "Paraná" },
  { uf: "PE", name: "Pernambuco" },
  { uf: "PI", name: "Piauí" },
  { uf: "RJ", name: "Rio de Janeiro" },
  { uf: "RN", name: "Rio Grande do Norte" },
  { uf: "RS", name: "Rio Grande do Sul" },
  { uf: "RO", name: "Rondônia" },
  { uf: "RR", name: "Roraima" },
  { uf: "SC", name: "Santa Catarina" },
  { uf: "SP", name: "São Paulo" },
  { uf: "SE", name: "Sergipe" },
  { uf: "TO", name: "Tocantins" },
] as const;

export const REFERRAL_SOURCES = [
  "Indicação",
  "Google",
  "Facebook",
  "Instagram",
  "WhatsApp",
  "TikTok",
  "YouTube",
  "Rádio",
  "TV",
  "Jornal",
  "Outros",
] as const;

export const leadSchema = z.object({
  nome: z
    .string({ error: "Nome é obrigatório" })
    .trim()
    .min(2, { error: "Informe seu nome completo" })
    .max(120),
  email: z
    .string({ error: "E-mail é obrigatório" })
    .trim()
    .min(1, { error: "E-mail é obrigatório" })
    .email({ error: "E-mail inválido" }),
  ddd: z
    .string({ error: "DDD é obrigatório" })
    .trim()
    .regex(/^\d{2}$/, { error: "DDD deve ter 2 dígitos" }),
  telefone: z
    .string({ error: "Telefone é obrigatório" })
    .trim()
    .min(8, { error: "Telefone inválido" })
    .max(20),
  areaTecnica: z.enum(TECHNICAL_AREAS, { error: "Selecione uma área técnica" }),
  experienciaMinima: z.boolean({
    error: "Responda se possui pelo menos 1 ano de experiência",
  }),
  ensinoMedio: z.boolean({ error: "Responda se possui Ensino Médio completo" }),
  privacidade: z.literal(true, {
    error: "Você precisa aceitar a Política de Privacidade",
  }),
});

export type LeadFormData = z.infer<typeof leadSchema>;
