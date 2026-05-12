// =====================================================
// DTOs da API Eduno EAD
// Formato exato das respostas e requisições da API
// Documentação: https://edunoead.docs.apiary.io/
// =====================================================

// === Base ===

export interface EdunoBaseResponse {
  rc: string; // "00" = sucesso, "08"+ = erro
  msg?: string[];
}

// === Cursos ===

export interface EdunoCourseListResponse extends EdunoBaseResponse {
  empresa: string;
  repositorio: string | string[];
  lista: EdunoCourseItem[];
}

export interface EdunoCourseItem {
  id: number;
  titulo: string;
  imagem: string;
  temimagem: "S" | "N";
  area_id?: number;
  area?: string;
}

// Resposta do endpoint /cursos/detalhado — retorna cursos com disciplinas
export interface EdunoCourseDetailedListResponse extends EdunoBaseResponse {
  empresa: string;
  repositorio: string | string[];
  lista: EdunoCourseDetailedItem[];
}

export interface EdunoCourseDetailedItem {
  id: number;
  titulo: string;
  imagem: string;
  temimagem: "S" | "N";
  area_id: number;
  area: string;
  publicoalvo: string | null;
  duracao: number | null; // meses
  carga_horaria: number;
  tcc: string;
  disciplinas: { titulo: string; carga_horaria: string }[];
}

export interface EdunoCourseDetailResponse extends EdunoBaseResponse {
  empresa: string;
  repositorio: string | string[];
  area: string;
  titulo: string;
  carga_horaria: number;
  descricao: string;
  publicoalvo: string | null;
  imagem: string; // pode ser apenas o nome do arquivo (sem URL completa)
  temimagem: "S" | "N";
  duracao: number | null; // meses (API retorna number, não string)
  tcc: string;
  lista: { titulo: string }[]; // disciplinas
}

// === Áreas de Interesse ===

export interface EdunoAreaListResponse extends EdunoBaseResponse {
  empresa: string | string[];
  lista: EdunoAreaItem[];
}

export interface EdunoAreaItem {
  id: number;
  titulo: string;
}

// === Matrícula (Request) ===

export interface EdunoEnrollmentRequest {
  cpf: string;
  nome: string;
  celular: number;
  email: string;
  cep: number;
  uf: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  cpf_vendedor: string;
  numero_parcelas: number;
  vencimento_parcela1: string; // ISO 8601
  cursos: EdunoEnrollmentCourse[];

  // Opcionais
  complemento?: string;
  nacionalidade?: string;
  naturalidade?: string;
  rg?: string;
  orgao_expedidor?: string;
  sexo?: "M" | "F";
  estado_civil?: "S" | "C" | "P" | "D" | "V" | "O";
  data_nascimento?: string; // ISO 8601
  mae?: string;
  pai?: string;
  graduacao?: string;
  ano_colacao?: number;
  instituicao?: string;
  acesso_degustacao?: boolean;
  polo?: string; // 3 chars
  vencimento_matricula?: string;
  vencimento_entrada?: string;
  numero_itens_pagos?: number;
  data_pagamento?: string;
  forma_pagamento?: "B" | "C" | "X";
}

export interface EdunoEnrollmentCourse {
  codigo: number;
  valor_parcela: number;
  valor_matricula?: number;
  valor_entrada?: number;
}

// === Matrícula (Response) ===

export interface EdunoEnrollmentResponse extends EdunoBaseResponse {
  contratacao?: number;
}

// === Confirmar Matrícula ===

export interface EdunoConfirmEnrollmentRequest {
  cpf: string;
  contratacao: number;
  numero_parcelas: number;
  vencimento_parcela1: string;
  cursos: EdunoEnrollmentCourse[];

  // Opcionais
  vencimento_matricula?: string;
  vencimento_entrada?: string;
  numero_itens_pagos?: number;
  data_pagamento?: string;
  forma_pagamento?: "B" | "C" | "X";
}

// === Proposta ===

export interface EdunoProposalRequest {
  nome: string; // máx 80 chars
  campanha_id: number;
  numero_parcelas: number;
  vencimento_parcela1: string;
  cursos: EdunoProposalCourse[];

  // Opcionais
  polo?: string; // 3 chars
  vencimento_matricula?: string;
  forma_pagamento?: "B" | "C"; // PIX não disponível para propostas
  mensagem?: string;
  disponibilidade?: number; // default: 1
  expiracao?: string; // ISO 8601 com hora
}

export interface EdunoProposalCourse {
  codigo: number;
  valor_parcela: number;
  valor_negociado?: number;
  valor_matricula?: number;
}

export interface EdunoProposalResponse extends EdunoBaseResponse {
  link?: string;
}
