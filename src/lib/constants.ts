// TODO(EdumaisTec): substituir os placeholders "A DEFINIR" pelos dados oficiais
// (endereço da sede, WhatsApp comercial, e-mail, redes sociais e domínio final).
export const INSTITUTION = {
  name: "EdumaisTec",
  legalName: "EdumaisTec",
  slogan: "Sua experiência vale um Diploma Oficial em mãos",
  cnpj: "63.111.623/0001-51",
  mecPortaria: "Cadastrado no SISTEC/MEC",
  address: {
    street: "A DEFINIR",
    city: "A DEFINIR",
    state: "MG",
    zip: "00000-000",
    full: "A DEFINIR",
  },
  contacts: {
    whatsapp: "(00) 00000-0000",
    whatsappLink: "https://wa.me/550000000000",
    email: "contato@edumaistec.com.br",
  },
  businessHours: {
    weekdays: "Segunda a Sexta: 8h às 18h",
    friday: "Sábado: 8h às 12h",
  },
  social: {
    facebook: "https://facebook.com/edumaistec",
    instagram: "https://instagram.com/edumaistec",
  },
  domain: "www.edumaistec.com.br",
} as const;

export const NAV_LINKS = [
  { href: "/certificacao-por-competencia", label: "Como Funciona" },
  { href: "/cursos", label: "Cursos" },
  { href: "/contato", label: "Contato" },
] as const;
