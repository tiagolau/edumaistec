import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators/contact";

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

  const result = contactSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      {
        error: "Dados inválidos",
        details: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Log do contato (futuramente: enviar email via Resend)
  console.log(
    JSON.stringify({
      type: "contact_form_submission",
      data: result.data,
      timestamp: new Date().toISOString(),
    }),
  );

  // TODO: Integrar com Resend para envio de email
  // await resend.emails.send({
  //   from: 'noreply@edumaistec.com.br',
  //   to: 'contato@edumaistec.com.br',
  //   subject: `Contato: ${result.data.subject}`,
  //   text: result.data.message,
  // });

  return NextResponse.json({ success: true });
}
