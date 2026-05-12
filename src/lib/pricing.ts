// =====================================================
// Pricing padronizado para todos os cursos
// A API Eduno não fornece preços — são gerenciados aqui
// =====================================================

export const PRICING = {
  /** Preço "de vitrine" (valor cheio tachado) */
  originalInstallmentValue: 166.67,
  originalInstallments: 12,

  /** Preço promocional base (usado no cartão) */
  promoInstallmentValue: 83.34,
  promoInstallments: 12,

  /** Condições por forma de pagamento */
  pix: {
    total: 1000.08, // 12 × 83,34
    label: "à vista no Pix",
  },
  card: {
    installments: 12,
    installmentValue: 83.34,
    label: "sem juros no cartão",
  },
  boleto: {
    installments: 18,
    installmentValue: 83.34,
    label: "no boleto",
  },
} as const;

// =====================================================
// Bundle pricing — desconto progressivo por curso extra
// =====================================================

export const BUNDLE_PRICING = {
  secondCourse: {
    installmentValue: 19.9,
    installments: 12,
    discountLabel: "29% OFF",
  },
  thirdAndBeyond: {
    installmentValue: 14.9,
    installments: 12,
    discountLabel: "47% OFF",
  },
} as const;

/** Valor da parcela para o N-esimo curso (1-indexed) */
export function getInstallmentForPosition(position: number): number {
  if (position <= 1) return PRICING.card.installmentValue;
  if (position === 2) return BUNDLE_PRICING.secondCourse.installmentValue;
  return BUNDLE_PRICING.thirdAndBeyond.installmentValue;
}

/** Total mensal para N cursos */
export function calculateBundleMonthly(courseCount: number): number {
  let total = 0;
  for (let i = 1; i <= courseCount; i++) {
    total += getInstallmentForPosition(i);
  }
  return Math.round(total * 100) / 100;
}

/** Economia mensal vs preco cheio (todos a R$83,34) */
export function calculateBundleSavings(courseCount: number): number {
  const fullPrice = courseCount * PRICING.card.installmentValue;
  const bundlePrice = calculateBundleMonthly(courseCount);
  return Math.round((fullPrice - bundlePrice) * 100) / 100;
}

// Helpers de formatação

export function formatCurrency(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

export function formatInstallments(qty: number, value: number): string {
  return `${qty}x R$ ${formatCurrency(value)}`;
}
