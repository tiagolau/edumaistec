import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { EdunoApiError, mapEdunoErrors } from "@/lib/eduno/errors";

const confirmSchema = z.object({
  cpf: z.string().min(11),
  contratacao: z.number(),
  installments: z.number().min(1),
  firstDueDate: z.string(),
  courses: z
    .array(
      z.object({
        id: z.number(),
        installmentValue: z.number(),
        enrollmentFee: z.number().optional(),
        downPayment: z.number().optional(),
      }),
    )
    .min(1),
  paymentMethod: z.enum(["B", "C", "X"]).optional(),
});

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo da requisição inválido" },
      { status: 400 },
    );
  }

  const result = confirmSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const { confirmEnrollment } = await import("@/lib/eduno/endpoints");
    const data = result.data;

    await confirmEnrollment({
      cpf: data.cpf.replace(/\D/g, "").padStart(11, "0"),
      contratacao: data.contratacao,
      numero_parcelas: data.installments,
      vencimento_parcela1: data.firstDueDate,
      cursos: data.courses.map((c) => ({
        codigo: c.id,
        valor_parcela: c.installmentValue,
        ...(c.enrollmentFee ? { valor_matricula: c.enrollmentFee } : {}),
        ...(c.downPayment ? { valor_entrada: c.downPayment } : {}),
      })),
      ...(data.paymentMethod
        ? { forma_pagamento: data.paymentMethod }
        : {}),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof EdunoApiError) {
      return NextResponse.json(
        {
          error: "Erro ao confirmar matrícula",
          messages: mapEdunoErrors(error.messages),
        },
        { status: 422 },
      );
    }

    console.error("POST /api/matricula/confirmar error:", error);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 },
    );
  }
}
