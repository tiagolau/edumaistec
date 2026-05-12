import { NextRequest, NextResponse } from "next/server";
import { proposalSchema } from "@/lib/validators/proposal";
import { EdunoApiError, mapEdunoErrors } from "@/lib/eduno/errors";

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

  const result = proposalSchema.safeParse(body);
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
    const { generateProposal } = await import("@/lib/eduno/endpoints");
    const data = result.data;
    const campaignId = Number(process.env.EDUNO_CAMPAIGN_ID || "0");
    const polo = process.env.EDUNO_POLO_CODE || "";

    const response = await generateProposal({
      nome: data.name.toUpperCase(),
      campanha_id: campaignId,
      numero_parcelas: data.installments,
      vencimento_parcela1: data.firstDueDate,
      cursos: data.courses.map((c) => ({
        codigo: c.id,
        valor_parcela: c.installmentValue,
        valor_negociado: c.negotiatedValue ?? c.installmentValue,
        ...(c.enrollmentFee
          ? { valor_matricula: c.enrollmentFee }
          : {}),
      })),
      ...(polo ? { polo } : {}),
      ...(data.paymentMethod
        ? { forma_pagamento: data.paymentMethod }
        : {}),
      ...(data.message ? { mensagem: data.message } : {}),
    });

    return NextResponse.json({
      success: true,
      link: response.link,
    });
  } catch (error) {
    if (error instanceof EdunoApiError) {
      return NextResponse.json(
        {
          error: "Erro ao gerar proposta",
          messages: mapEdunoErrors(error.messages),
        },
        { status: 422 },
      );
    }

    console.error("POST /api/proposta error:", error);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 },
    );
  }
}
