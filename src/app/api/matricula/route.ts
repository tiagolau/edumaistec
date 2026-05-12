import { NextRequest, NextResponse } from "next/server";
import { enrollmentSchema } from "@/lib/validators/enrollment";
import { mapEnrollmentToEduno } from "@/lib/eduno/mappers";
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

  const result = enrollmentSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const edunoPayload = mapEnrollmentToEduno(result.data);

  try {
    const { submitEnrollment } = await import("@/lib/eduno/endpoints");
    const response = await submitEnrollment(edunoPayload);

    return NextResponse.json({
      success: true,
      contratacao: response.contratacao,
    });
  } catch (error) {
    if (error instanceof EdunoApiError) {
      return NextResponse.json(
        {
          error: "Erro na matrícula",
          messages: mapEdunoErrors(error.messages),
        },
        { status: 422 },
      );
    }

    console.error("POST /api/matricula error:", error);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente ou entre em contato pelo WhatsApp." },
      { status: 500 },
    );
  }
}
