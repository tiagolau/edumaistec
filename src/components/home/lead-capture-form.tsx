"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowRight, CheckCircle2, Loader2, Lock, ShieldCheck } from "lucide-react";
import { TECHNICAL_AREAS, type LeadFormData } from "@/lib/validators/lead";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

type FormState = "idle" | "submitting" | "success" | "error";

type FormValues = {
  nome: string;
  email: string;
  ddd: string;
  telefone: string;
  areaTecnica: string;
  experienciaMinima: "" | "sim" | "nao";
  ensinoMedio: "" | "sim" | "nao";
};

const FIELD_BASE =
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition";
const LABEL_BASE =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-white/60";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-300">{message}</p>;
}

function onlyDigits(v: string, max?: number) {
  const d = v.replace(/\D/g, "");
  return max ? d.slice(0, max) : d;
}

export function LeadCaptureForm() {
  const [state, setState] = useState<FormState>("idle");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nome: "",
      email: "",
      ddd: "",
      telefone: "",
      areaTecnica: "",
      experienciaMinima: "",
      ensinoMedio: "",
    },
  });

  const onSubmit = async (raw: FormValues) => {
    setState("submitting");

    const payload: LeadFormData = {
      nome: raw.nome.trim(),
      email: raw.email.trim(),
      ddd: raw.ddd.trim(),
      telefone: raw.telefone.trim(),
      areaTecnica: raw.areaTecnica as LeadFormData["areaTecnica"],
      experienciaMinima: raw.experienciaMinima === "sim",
      ensinoMedio: raw.ensinoMedio === "sim",
      privacidade: true, // consentimento implícito (texto abaixo do botão)
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setState("error");
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { id?: string };
      const eventID = body.id;

      // Meta Pixel — evento Lead (deduplicado com o CAPI server-side via eventID)
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq(
          "track",
          "Lead",
          {
            content_name: payload.areaTecnica,
            content_category: "certificacao-por-competencia",
          },
          eventID ? { eventID } : undefined,
        );
      }

      // GTM dataLayer — disponibiliza pra qualquer tag (Google Ads, GA4, etc)
      if (typeof window !== "undefined" && Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: "lead_submission",
          lead_id: eventID,
          area_tecnica: payload.areaTecnica,
        });
      }

      setState("success");
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center backdrop-blur-md sm:p-10">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-extrabold text-white">Análise solicitada!</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm text-white/70">
          Recebemos seus dados. Nossa equipe entrará em contato pelo WhatsApp
          para iniciar sua análise gratuita.
        </p>
        <button
          type="button"
          onClick={() => {
            reset();
            setState("idle");
          }}
          className="mt-6 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-white"
        >
          Enviar outra resposta
        </button>
      </div>
    );
  }

  return (
    <form
      id="form-lead"
      onSubmit={handleSubmit(onSubmit)}
      className="relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md sm:p-7"
      noValidate
    >
      <div className="mb-5 text-center">
        <h3 className="text-xl font-extrabold text-white sm:text-2xl">
          Solicite sua análise gratuita
        </h3>
        <p className="mt-1.5 text-sm text-white/60">
          Em até 24h um consultor avalia se você se qualifica para a
          certificação.
        </p>
      </div>

      {state === "error" && (
        <div className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">
          Erro ao enviar. Tente novamente ou fale com a gente pelo WhatsApp.
        </div>
      )}

      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label htmlFor="lead-nome" className={LABEL_BASE}>
            Nome completo
          </label>
          <input
            id="lead-nome"
            type="text"
            autoComplete="name"
            placeholder="Como você se chama?"
            className={FIELD_BASE}
            aria-invalid={!!errors.nome}
            {...register("nome", {
              required: "Informe seu nome",
              minLength: { value: 2, message: "Nome muito curto" },
            })}
          />
          <FieldError message={errors.nome?.message} />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="lead-email" className={LABEL_BASE}>
            E-mail
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            placeholder="voce@email.com"
            className={FIELD_BASE}
            aria-invalid={!!errors.email}
            {...register("email", {
              required: "Informe seu e-mail",
              pattern: { value: /.+@.+\..+/, message: "E-mail inválido" },
            })}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* DDD + Telefone */}
        <div className="grid grid-cols-[80px_1fr] gap-3">
          <div>
            <label htmlFor="lead-ddd" className={LABEL_BASE}>
              DDD
            </label>
            <input
              id="lead-ddd"
              inputMode="numeric"
              maxLength={2}
              placeholder="00"
              className={FIELD_BASE + " text-center"}
              aria-invalid={!!errors.ddd}
              {...register("ddd", {
                required: "DDD",
                pattern: { value: /^\d{2}$/, message: "2 dígitos" },
                onChange: (e) => {
                  e.target.value = onlyDigits(e.target.value, 2);
                },
              })}
            />
            <FieldError message={errors.ddd?.message} />
          </div>
          <div>
            <label htmlFor="lead-telefone" className={LABEL_BASE}>
              Telefone (WhatsApp)
            </label>
            <input
              id="lead-telefone"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="00000-0000"
              className={FIELD_BASE}
              aria-invalid={!!errors.telefone}
              {...register("telefone", {
                required: "Informe seu telefone",
                minLength: { value: 8, message: "Telefone inválido" },
                onChange: (e) => {
                  e.target.value = onlyDigits(e.target.value, 9);
                },
              })}
            />
            <FieldError message={errors.telefone?.message} />
          </div>
        </div>

        {/* Área técnica */}
        <div>
          <label htmlFor="lead-area" className={LABEL_BASE}>
            Selecione sua área técnica
          </label>
          <select
            id="lead-area"
            className={FIELD_BASE}
            defaultValue=""
            aria-invalid={!!errors.areaTecnica}
            {...register("areaTecnica", { required: "Escolha uma área" })}
          >
            <option value="" disabled className="bg-primary-dark">
              Selecione uma opção
            </option>
            {TECHNICAL_AREAS.map((a) => (
              <option key={a} value={a} className="bg-primary-dark">
                {a}
              </option>
            ))}
          </select>
          <FieldError message={errors.areaTecnica?.message} />
        </div>

        {/* Radios qualificadores */}
        <fieldset className="space-y-3">
          <legend className={LABEL_BASE}>
            Você tem ao menos 1 ano de experiência na área?
          </legend>
          <Controller
            control={control}
            name="experienciaMinima"
            rules={{ required: "Selecione uma opção" }}
            render={({ field }) => (
              <div className="flex gap-2">
                {(["sim", "nao"] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => field.onChange(opt)}
                    className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                      field.value === opt
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/30"
                    }`}
                  >
                    {opt === "sim" ? "Sim" : "Não"}
                  </button>
                ))}
              </div>
            )}
          />
          <FieldError message={errors.experienciaMinima?.message} />
        </fieldset>

        <fieldset className="space-y-3">
          <legend className={LABEL_BASE}>
            Você tem Ensino Médio completo?
          </legend>
          <Controller
            control={control}
            name="ensinoMedio"
            rules={{ required: "Selecione uma opção" }}
            render={({ field }) => (
              <div className="flex gap-2">
                {(["sim", "nao"] as const).map((opt) => (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => field.onChange(opt)}
                    className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                      field.value === opt
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/30"
                    }`}
                  >
                    {opt === "sim" ? "Sim" : "Não"}
                  </button>
                ))}
              </div>
            )}
          />
          <FieldError message={errors.ensinoMedio?.message} />
        </fieldset>

        {/* Submit */}
        <button
          type="submit"
          disabled={state === "submitting"}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 text-sm font-extrabold uppercase tracking-wide text-accent-foreground transition hover:brightness-110 disabled:opacity-70"
        >
          {state === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Enviando...
            </>
          ) : (
            <>
              Enviar mensagem
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>

        <p className="pt-1 text-center text-[11px] leading-relaxed text-white/40">
          Ao enviar, você concorda com a{" "}
          <Link
            href="/politica-de-privacidade"
            className="text-white/60 underline underline-offset-2 hover:text-white/90"
            target="_blank"
          >
            Política de Privacidade
          </Link>
          .
        </p>

        <div className="flex items-center justify-center gap-5 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/35">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" /> Dados protegidos
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> SISTEC oficial
          </span>
        </div>
      </div>
    </form>
  );
}
