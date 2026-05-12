import { getSupabaseClient } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";
import type { LpWorkspaceRow } from "@/lib/lp/types";

export async function validateWorkspaceToken(token: string | null) {
  if (!token) {
    return null;
  }
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("lp_workspaces")
      .select("*")
      .eq("token", token)
      .eq("active", true)
      .single<LpWorkspaceRow>();

    if (error || !data) return null;
    return data;
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  return request.headers.get("x-workspace-token");
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: "Token inválido ou ausente" },
    { status: 401 },
  );
}
