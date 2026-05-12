import { ClipboardCheck, MonitorPlay, Award } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";

const steps = [
  {
    icon: ClipboardCheck,
    title: "Matricule-se",
    description: "Escolha seu curso e faça sua inscrição online de forma rápida e segura.",
  },
  {
    icon: MonitorPlay,
    title: "Estude Online",
    description: "Acesse a plataforma quando quiser e estude no seu próprio ritmo, 100% EAD.",
  },
  {
    icon: Award,
    title: "Receba o Diploma",
    description: "Conclua o curso e receba seu diploma registrado no SISTEC/MEC, com validade nacional.",
  },
];

export function CourseHowItWorks() {
  return (
    <section className="my-8 rounded-2xl bg-background-alt p-6 sm:p-8">
      <h2 className="mb-6 text-xl font-semibold text-foreground text-center">
        Como funciona
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {steps.map((step, idx) => (
          <AnimatedSection key={idx} animation="fade-up" delay={idx * 100}>
            <div className="text-center">
              <div className="relative mx-auto mb-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {idx + 1}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  );
}
