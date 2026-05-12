import type { Course, CourseArea, CoursePricing } from "@/types/course";
import type {
  EdunoCourseItem,
  EdunoCourseDetailedItem,
  EdunoCourseDetailResponse,
  EdunoAreaItem,
  EdunoEnrollmentRequest,
  EdunoEnrollmentCourse,
} from "@/types/eduno";
import type { EnrollmentFormData } from "@/lib/validators/enrollment";
import { PRICING } from "@/lib/pricing";

// === Mapa de ícones por área ===

const AREA_ICON_MAP: Record<string, string> = {
  DIREITO: "Scale",
  PEDAGOGIA: "GraduationCap",
  "EDUCAÇÃO": "GraduationCap",
  "SAÚDE": "Heart",
  "ADMINISTRAÇÃO": "Briefcase",
  "NEGÓCIOS": "Briefcase",
  ENGENHARIA: "HardHat",
  "COMPUTAÇÃO": "Monitor",
  "TECNOLOGIA DA INFORMAÇÃO": "Monitor",
  "COMUNICAÇÃO": "Users",
  "CIÊNCIAS SOCIAIS": "Users",
  ARTES: "Palette",
  "MÚSICA": "Palette",
  "CIÊNCIAS NATURAIS": "FlaskConical",
  "MATEMÁTICA": "FlaskConical",
  AGRICULTURA: "Leaf",
  "VETERINÁRIA": "Leaf",
  "SERVIÇOS": "Wrench",
  PSICOLOGIA: "Brain",
  DIVERSOS: "LayoutGrid",
};

const DEFAULT_ICON = "BookOpen";

function getDefaultPricing(): CoursePricing {
  return {
    originalInstallments: PRICING.originalInstallments,
    originalInstallmentValue: PRICING.originalInstallmentValue,
    promoInstallments: PRICING.card.installments,
    promoInstallmentValue: PRICING.card.installmentValue,
    pixTotal: PRICING.pix.total,
    boletoInstallments: PRICING.boleto.installments,
    boletoInstallmentValue: PRICING.boleto.installmentValue,
  };
}

function getIconForArea(areaTitle: string): string {
  const upper = areaTitle.toUpperCase();
  for (const [key, icon] of Object.entries(AREA_ICON_MAP)) {
    if (upper.includes(key)) return icon;
  }
  return DEFAULT_ICON;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDuration(months: number | null | undefined): string {
  if (!months) return "";
  return `${months} meses`;
}

// === Curso (listagem simples /cursos): Eduno → Frontend ===

export function mapEdunoCourseToFrontend(
  item: EdunoCourseItem,
  detail?: EdunoCourseDetailResponse,
): Course {
  const areaName = detail?.area || item.area || "";

  return {
    id: item.id,
    edunoId: item.id,
    slug: slugify(item.titulo),
    name: item.titulo,
    categorySlug: slugify(areaName),
    description: detail?.descricao || "",
    duration: formatDuration(detail?.duracao),
    durationMonths: detail?.duracao ?? null,
    workload: detail?.carga_horaria || 0,
    modality: "EAD",
    targetAudience: detail?.publicoalvo || "",
    prerequisites: "",
    curriculum: detail?.lista?.map((d) => d.titulo) || [],
    price: PRICING.pix.total,
    installments: PRICING.card.installments,
    pricing: getDefaultPricing(),
    featured: false,
    active: true,
    image: item.imagem || null,
    hasImage: item.temimagem === "S",
    tccRequired: detail?.tcc || null,
    area: areaName
      ? {
          id: Number(item.area_id) || 0,
          title: areaName,
          slug: slugify(areaName),
          icon: getIconForArea(areaName),
        }
      : undefined,
  };
}

// === Curso detalhado (/cursos/detalhado): Eduno → Frontend ===

export function mapEdunoCourseDetailedToFrontend(
  item: EdunoCourseDetailedItem,
): Course {
  const areaName = item.area || "";

  return {
    id: item.id,
    edunoId: item.id,
    slug: slugify(item.titulo),
    name: item.titulo,
    categorySlug: slugify(areaName),
    description: "",
    duration: formatDuration(item.duracao),
    durationMonths: item.duracao,
    workload: item.carga_horaria || 0,
    modality: "EAD",
    targetAudience: item.publicoalvo || "",
    prerequisites: "",
    curriculum: item.disciplinas?.map((d) => d.titulo) || [],
    price: PRICING.pix.total,
    installments: PRICING.card.installments,
    pricing: getDefaultPricing(),
    featured: false,
    active: true,
    image: item.imagem || null,
    hasImage: item.temimagem === "S",
    tccRequired: item.tcc || null,
    area: areaName
      ? {
          id: item.area_id,
          title: areaName,
          slug: slugify(areaName),
          icon: getIconForArea(areaName),
        }
      : undefined,
  };
}

// === Área: Eduno → Frontend ===

export function mapEdunoAreaToFrontend(item: EdunoAreaItem): CourseArea {
  return {
    id: item.id,
    title: item.titulo,
    slug: slugify(item.titulo),
    icon: getIconForArea(item.titulo),
  };
}

// === Matrícula: Frontend → Eduno ===

function stripNonDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function mapEnrollmentToEduno(
  formData: EnrollmentFormData,
): EdunoEnrollmentRequest {
  const cpfVendedor = process.env.EDUNO_SELLER_CPF || "11111111111";
  const polo = process.env.EDUNO_POLO_CODE || "";

  const cursos: EdunoEnrollmentCourse[] = formData.courses.map((c) => ({
    codigo: c.id,
    valor_parcela: c.installmentValue,
    ...(c.enrollmentFee ? { valor_matricula: c.enrollmentFee } : {}),
    ...(c.downPayment ? { valor_entrada: c.downPayment } : {}),
  }));

  return {
    cpf: stripNonDigits(formData.cpf).padStart(11, "0"),
    nome: formData.fullName.toUpperCase(),
    celular: Number(stripNonDigits(formData.phone)),
    email: formData.email,
    cep: Number(stripNonDigits(formData.cep)),
    uf: formData.state,
    cidade: formData.city.toUpperCase(),
    bairro: formData.neighborhood.toUpperCase(),
    logradouro: formData.street.toUpperCase(),
    numero: formData.number,
    cpf_vendedor: stripNonDigits(cpfVendedor).padStart(11, "0"),
    numero_parcelas: formData.installments,
    vencimento_parcela1: formData.firstDueDate,
    cursos,
    ...(polo ? { polo } : {}),
    acesso_degustacao: false,
    forma_pagamento: formData.paymentMethod,

    // Opcionais
    ...(formData.complement ? { complemento: formData.complement } : {}),
    ...(formData.nationality ? { nacionalidade: formData.nationality } : {}),
    ...(formData.rg ? { rg: formData.rg } : {}),
    ...(formData.rgIssuer ? { orgao_expedidor: formData.rgIssuer } : {}),
    ...(formData.sex ? { sexo: formData.sex } : {}),
    ...(formData.maritalStatus
      ? { estado_civil: formData.maritalStatus }
      : {}),
    ...(formData.birthDate ? { data_nascimento: formData.birthDate } : {}),
    ...(formData.motherName ? { mae: formData.motherName.toUpperCase() } : {}),
    ...(formData.fatherName
      ? { pai: formData.fatherName.toUpperCase() }
      : {}),
    ...(formData.experienceArea
      ? { graduacao: formData.experienceArea.toUpperCase() }
      : {}),
  };
}
