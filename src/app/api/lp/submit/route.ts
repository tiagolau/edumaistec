import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/client";
import { submissionSchema } from "@/lib/lp/validators";
import { dispatchWebhook } from "@/lib/lp/webhook";
import type { FormFieldConfig, LandingPageRow } from "@/lib/lp/types";
import { generateId } from "@/lib/lp/id";

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Corpo da requisição inválido" },
        { status: 400 },
      );
    }

    const result = submissionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { landingPageId, data } = result.data;

    const supabase = getSupabaseClient();

    const { data: landingPage, error: lpError } = await supabase
      .from("landing_pages")
      .select("*")
      .eq("id", landingPageId)
      .eq("active", true)
      .single<LandingPageRow>();

    if (lpError || !landingPage) {
      return NextResponse.json(
        { error: "Landing page não encontrada ou inativa" },
        { status: 404 },
      );
    }

    // Validate required fields
    const fields = landingPage.form_fields as FormFieldConfig[];
    const errors: Record<string, string> = {};

    for (const field of fields) {
      const value = data[field.name];
      if (field.required && (value === undefined || value === null || value === "")) {
        errors[field.name] = `${field.label} é obrigatório`;
      }
      if (field.type === "email" && value && typeof value === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field.name] = "E-mail inválido";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: "Dados inválidos", details: errors },
        { status: 400 },
      );
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const userAgent = request.headers.get("user-agent") || null;

    const { error: insertError } = await supabase
      .from("lp_submissions")
      .insert({
        id: generateId(),
        landing_page_id: landingPageId,
        data,
        ip,
        user_agent: userAgent,
      });

    if (insertError) {
      console.error("POST /api/lp/submit insert error:", insertError);
      return NextResponse.json(
        { error: "Erro interno do servidor" },
        { status: 500 },
      );
    }

    // Dispatch webhook após enviar a response (não bloqueia o redirect)
    if (landingPage.webhook_url) {
      const webhookUrl = landingPage.webhook_url;
      const webhookData = data as Record<string, unknown>;
      after(async () => {
        await dispatchWebhook(webhookUrl, webhookData);
      });
    }

    // Mapa de tipos de campo para limpar valores (ex: phone → só dígitos)
    const fieldTypeMap = new Map<string, string>();
    for (const field of fields) {
      fieldTypeMap.set(field.name, field.type);
    }

    // Anexar campos do formulário como query params na URL de redirect
    const redirectUrl = new URL(landingPage.redirect_url);
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null && value !== "") {
        let cleanValue = String(value);
        // Campos de telefone: remover máscara, enviar só dígitos
        if (fieldTypeMap.get(key) === "phone") {
          cleanValue = cleanValue.replace(/\D/g, "");
        }
        redirectUrl.searchParams.set(key, cleanValue);
      }
    }

    return NextResponse.json({
      success: true,
      redirectUrl: redirectUrl.toString(),
    });
  } catch (error) {
    console.error("POST /api/lp/submit error:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
