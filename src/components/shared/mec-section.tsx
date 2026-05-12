import {
  ShieldCheck,
  Award,
  TrendingUp,
  FileCheck,
  Stamp,
} from "lucide-react";
import { INSTITUTION } from "@/lib/constants";
import { AnimatedSection } from "./animated-section";

const benefits = [
  {
    icon: Award,
    text: "Válido para concursos públicos e progressão de carreira",
  },
  {
    icon: TrendingUp,
    text: "Certificado reconhecido em todo o território nacional",
  },
  {
    icon: FileCheck,
    text: "Instituição cadastrada no SISTEC — Sistema Nacional de Informações da Educação Profissional e Tecnológica",
  },
];

export function MecSection() {
  return (
    <section className="py-16 sm:py-20 bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Content */}
          <AnimatedSection animation="slide-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-semibold text-success mb-6">
              <ShieldCheck className="h-4 w-4" />
              Cadastrado no SISTEC/MEC
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Seu certificado técnico com{" "}
              <span className="text-primary">validade nacional</span> — SISTEC/MEC
            </h2>

            <p className="mt-4 text-base text-muted-foreground leading-relaxed sm:text-lg">
              O {INSTITUTION.name} é{" "}
              <strong className="text-foreground font-medium">
                {INSTITUTION.mecPortaria}
              </strong>
              , garantindo que seu diploma técnico tenha validade nacional,
              verificável em{" "}
              <strong className="text-foreground font-medium">
                sistec.mec.gov.br
              </strong>
              , e seja aceito em concursos públicos, empresas e processos
              seletivos em todo o país.
            </p>

            <ul className="mt-8 space-y-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 mt-0.5">
                    <benefit.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm text-foreground leading-relaxed sm:text-base">
                    {benefit.text}
                  </span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Right — Certificate Mockup (CSS-only) */}
          <AnimatedSection animation="slide-right" delay={150}>
            <div className="relative mx-auto max-w-md lg:mx-0 lg:ml-auto">
              {/* Shadow backdrop */}
              <div className="absolute inset-4 -rotate-3 rounded-2xl bg-primary/8" />

              {/* Certificate card */}
              <div className="relative rounded-2xl border-2 border-primary/15 bg-white p-8 shadow-xl sm:p-10">
                {/* Top decorative bar */}
                <div className="absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-gradient-to-r from-primary via-primary-light to-accent" />

                {/* Header */}
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-7 w-7 text-primary" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    República Federativa do Brasil
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    SISTEC — MEC
                  </p>
                </div>

                {/* Divider */}
                <div className="my-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                {/* Body */}
                <div className="text-center">
                  <p className="text-lg font-bold text-primary sm:text-xl">
                    Certificado de Curso Técnico
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground italic">
                    Educação Profissional Técnica de Nível Médio
                  </p>

                  <div className="mt-5 space-y-1.5">
                    <div className="mx-auto h-2 w-3/4 rounded-full bg-muted/60" />
                    <div className="mx-auto h-2 w-2/3 rounded-full bg-muted/40" />
                    <div className="mx-auto h-2 w-1/2 rounded-full bg-muted/30" />
                  </div>
                </div>

                {/* Seal */}
                <div className="mt-8 flex items-center justify-center gap-6">
                  <div className="h-px flex-1 bg-border" />
                  <div className="relative flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-accent/40" />
                    <Stamp className="h-7 w-7 text-accent" />
                  </div>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <p className="mt-4 text-center text-[10px] text-muted-foreground">
                  {INSTITUTION.name} · CNPJ {INSTITUTION.cnpj}
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
