export class EdunoApiError extends Error {
  constructor(
    message: string,
    public readonly rc: string,
    public readonly messages: string[] = [],
    public readonly status?: number,
  ) {
    super(message);
    this.name = "EdunoApiError";
  }
}

const ERROR_MESSAGES: Record<string, string> = {
  "CPF inválido":
    "O CPF informado não é válido. Verifique e tente novamente.",
  "Curso não encontrado":
    "O curso selecionado não está mais disponível.",
  "Email inválido": "O email informado não é válido.",
  "Celular inválido":
    "O número de celular informado não é válido. Use o formato com DDD (11 dígitos).",
  "CEP inválido": "O CEP informado não é válido.",
  DEFAULT:
    "Ocorreu um erro ao processar sua solicitação. Tente novamente ou entre em contato pelo WhatsApp.",
};

export function mapEdunoErrors(messages: string[]): string[] {
  return messages.map((msg) => {
    const key = Object.keys(ERROR_MESSAGES).find((k) =>
      msg.toLowerCase().includes(k.toLowerCase()),
    );
    // Se não reconhecer a mensagem, repassa a original ao invés de genérica
    return key ? ERROR_MESSAGES[key] : msg;
  });
}

export function isEdunoSuccess(rc: string): boolean {
  return rc === "00";
}
