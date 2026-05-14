import { ShieldCheck } from "lucide-react";
import { LeadCaptureForm } from "./lead-capture-form";

export function VslHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0d0404] via-primary-dark to-[#0d0404]">
      {/* Atmospheric background */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/[0.08] blur-3xl" />
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/[0.04]" />
        <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-primary-light/[0.03]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-6 sm:gap-10 lg:grid-cols-[1fr_460px] lg:items-start lg:gap-14">
          {/* Header — badge + headline + supporting copy */}
          <div className="order-1 text-center lg:order-none lg:col-start-1 lg:row-start-1 lg:pt-4 lg:text-left">
            {/* Badge */}
            <div className="mb-4 flex justify-center sm:mb-6 lg:mb-8 lg:justify-start animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] border border-white/[0.08] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm sm:px-5 sm:py-2 sm:text-sm">
                <ShieldCheck className="h-4 w-4 text-accent/80" />
                Cadastrado no SISTEC/MEC — Validade Nacional
              </div>
            </div>

            {/* Headline */}
            <div className="animate-fade-up">
              <h1 className="text-[1.65rem] font-extrabold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.5rem] xl:leading-[1.08]">
                Você trabalha na área
                <br className="hidden sm:block" />
                <span className="text-white/60"> mas </span>
                <span className="relative">
                  não tem diploma
                  <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-accent/0 via-accent to-accent/0" />
                </span>
                <span className="text-white/60">?</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm text-white/55 leading-relaxed sm:mt-5 sm:text-lg mx-auto lg:mx-0 hidden sm:block">
                Descubra como profissionais com experiência estão obtendo seu
                diploma técnico — 100% online, com validade nacional — sem
                precisar cursar anos de aulas sobre o que já dominam na prática.
              </p>
            </div>
          </div>

          {/* Form — sobe para a primeira dobra no mobile */}
          <div className="order-2 animate-fade-up [animation-delay:200ms] lg:order-none lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-20">
            <LeadCaptureForm />
          </div>

          {/* Tail — parágrafo curto (mobile) + stats */}
          <div className="order-3 lg:order-none lg:col-start-1 lg:row-start-2">
            {/* Parágrafo descritivo — só mobile (no desktop ele já apareceu acima do form) */}
            <p className="mx-auto max-w-xl text-center text-sm leading-relaxed text-white/55 sm:hidden">
              Descubra como profissionais com experiência estão obtendo seu
              diploma técnico — 100% online, com validade nacional.
            </p>

            {/* Stat bars */}
            <div className="mt-6 flex flex-col items-center gap-3 sm:mt-10 lg:items-start animate-fade-in [animation-delay:400ms]">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-full bg-white/[0.04] border border-white/[0.06] px-8 py-3 backdrop-blur-sm">
                <Stat value="2.500+" label="profissionais formados" />
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <Stat value="60+" label="cursos técnicos" />
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <Stat value="94%" label="empregabilidade" />
              </div>

              {/* Destaque de preço */}
              <div className="inline-flex items-center gap-3 rounded-full border border-accent/40 bg-accent/15 px-6 py-3 shadow-lg shadow-accent/10 backdrop-blur-sm">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent/90">
                  A partir de
                </span>
                <span className="text-xl font-extrabold leading-none tracking-tight text-accent sm:text-2xl">
                  12x R$ 89,00
                </span>
                <span className="text-xs font-medium text-white/70">
                  no cartão de crédito
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-bold text-white">{value}</span>
      <span className="text-white/40">{label}</span>
    </div>
  );
}
