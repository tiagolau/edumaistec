export type CourseDuration = "3 meses" | "4 meses" | "6 meses";

export interface CoursePricing {
  /** Preço "de vitrine" (tachado) — ex: 12x R$ 125,00 */
  originalInstallments: number;
  originalInstallmentValue: number;
  /** Preço promocional no cartão — ex: 12x R$ 89,00 */
  promoInstallments: number;
  promoInstallmentValue: number;
  /** Valor à vista no Pix */
  pixTotal: number;
  /** Parcelas no boleto */
  boletoInstallments: number;
  boletoInstallmentValue: number;
}

export interface Course {
  id: string | number;
  slug: string;
  name: string;
  categorySlug: string;
  description: string;
  duration: CourseDuration | string;
  workload: number; // carga horária em horas
  modality: "EAD" | string;
  targetAudience: string;
  prerequisites: string;
  curriculum: string[];
  price: number;
  installments: number;
  pricing: CoursePricing;
  featured: boolean;
  active: boolean;

  // Campos da Eduno (opcionais — populados quando dados vêm da API)
  edunoId?: number;
  image?: string | null;
  hasImage?: boolean;
  tccRequired?: string | null;
  area?: CourseArea;
  durationMonths?: number | null; // duração em meses (da Eduno)
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  courseCount: number;
}

// Área de interesse da Eduno (mapeada para o frontend)
export interface CourseArea {
  id: number;
  title: string;
  slug: string;
  icon: string;
  courseCount?: number;
}

export interface Consultant {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  email: string;
  photo?: string;
  active: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface Advantage {
  id: string;
  icon: string;
  title: string;
  description: string;
}
