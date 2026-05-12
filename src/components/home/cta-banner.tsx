import Link from "next/link";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTITUTION } from "@/lib/constants";
import { AnimatedSection } from "@/components/shared/animated-section";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-primary-dark py-16 sm:py-20">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-accent/[0.07]" />
        <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-accent/[0.04]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary-light/[0.06]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <AnimatedSection>
          {/* Urgency badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-sm font-semibold text-white">
            <Sparkles className="h-4 w-4" />
            Matrículas abertas
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Você já trabalha na área e quer formalizar sua profissão?
          </h2>

          <p className="mt-4 text-base text-white/75 sm:text-lg max-w-2xl mx-auto">
            Se você tem Ensino Médio completo e experiência profissional,
            pode transformar seus anos de prática em um{" "}
            <strong className="text-white font-semibold">
              diploma técnico com validade nacional
            </strong>
            . Mensalidade a partir de{" "}
            <strong className="text-white font-semibold">
              12x de R$ 89,00
            </strong>{" "}
            sem juros.
          </p>

          {/* Social proof */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-white/50">
            <Users className="h-4 w-4" />
            <span>Junte-se aos profissionais que já formalizaram sua carreira pela {INSTITUTION.name}</span>
          </div>

          {/* CTAs */}
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent-dark px-8 text-base"
              asChild
            >
              <Link href="/cursos">
                Ver cursos disponíveis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
