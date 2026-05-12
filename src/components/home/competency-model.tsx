import {
  MessageCircle,
  FileCheck,
  ClipboardCheck,
  Award,
} from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionTitle } from "@/components/shared/section-title";

const steps = [
  {
    icon: MessageCircle,
    number: "01",
    title: "Converse com um atendente",
    description:
      "Fale com nossa equipe pelo WhatsApp para entender o processo, tirar dúvidas e iniciar sua jornada rumo ao diploma.",
  },
  {
    icon: FileCheck,
    number: "02",
    title: "Comprove sua experiência",
    description:
      "Tenha pelo menos 1 ano de experiência profissional comprovada na área do curso, com Ensino Médio completo.",
  },
  {
    icon: ClipboardCheck,
    number: "03",
    title: "Realize as avaliações",
    description:
      "Demonstre suas competências por meio de provas teóricas online. Aproveitamento mínimo de 70%.",
  },
  {
    icon: Award,
    number: "04",
    title: "Receba seu diploma",
    description:
      "Registrado no SISTEC/MEC com código de autenticação para verificação nacional.",
  },
];

export function CompetencyModel() {
  return (
    <section className="py-16 sm:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Como funciona a Certificação por Competência"
            subtitle="Ideal para profissionais que já atuam na área e querem formalizar sua experiência com um diploma técnico reconhecido nacionalmente."
          />
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
              <div className="relative rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md h-full">
                {/* Number badge */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-2xl font-bold text-primary/20">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Nota legal */}
        <AnimatedSection animation="fade-up" delay={500}>
          <p className="mt-8 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            Base legal: Art. 41 da Lei 9.394/96 (LDB) e Resolução CNE/CP n.
            1/2021. O diploma não menciona o método de certificação e tem a
            mesma validade de um curso técnico regular.
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
