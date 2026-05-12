import { nanoid } from "nanoid";

/**
 * Gera um ID único compatível com o formato CUID usado pelo Prisma.
 * Usa nanoid como alternativa leve.
 */
export function generateId() {
  return nanoid(25);
}
