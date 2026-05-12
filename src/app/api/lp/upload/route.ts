import { NextRequest, NextResponse } from "next/server";
import {
  getTokenFromRequest,
  validateWorkspaceToken,
  unauthorizedResponse,
} from "@/lib/lp/auth";
import { uploadBanner } from "@/lib/supabase/storage";
import { nanoid } from "nanoid";

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  const workspace = await validateWorkspaceToken(token);
  if (!workspace) return unauthorizedResponse();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Dados do formulário inválidos" },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { error: "Nenhum arquivo enviado" },
      { status: 400 },
    );
  }

  try {
    const result = await uploadBanner(file, workspace.id, nanoid(8));
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro ao fazer upload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
