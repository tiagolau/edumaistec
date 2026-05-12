import { Quote, Star } from "lucide-react";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionTitle } from "@/components/shared/section-title";

const testimonials = [
  {
    name: "Carlos R.",
    role: "Técnico em Segurança do Trabalho",
    text: "Trabalhava há 4 anos na área sem diploma. Com a certificação por competência consegui formalizar minha profissão e fui promovido a supervisor em menos de 3 meses.",
    highlight: "Promoção em 3 meses",
  },
  {
    name: "Fernanda S.",
    role: "Técnica em Enfermagem",
    text: "Precisava do diploma para prestar concurso público. Concluí o curso em 4 meses estudando nos finais de semana. Passei no concurso e hoje trabalho no Hospital Municipal.",
    highlight: "Aprovada em concurso público",
  },
  {
    name: "Ricardo M.",
    role: "Técnico em Eletrotécnica",
    text: "Já atuava como eletricista industrial há 6 anos. O diploma me permitiu me registrar no CFT e agora posso assinar laudos. Meu faturamento como autônomo triplicou.",
    highlight: "Registro no CFT",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-20 bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Quem já formalizou sua carreira"
            subtitle="Profissionais que transformaram anos de experiência em diploma técnico com validade nacional."
          />
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <AnimatedSection key={idx} animation="fade-up" delay={idx * 120}>
              <div className="flex flex-col rounded-xl border border-border bg-card p-6 h-full">
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Quote */}
                <div className="relative flex-1 mb-4">
                  <Quote className="absolute -top-1 -left-1 h-6 w-6 text-primary/10" />
                  <p className="text-sm leading-relaxed text-muted-foreground pl-4">
                    {t.text}
                  </p>
                </div>

                {/* Highlight badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                    {t.highlight}
                  </span>
                </div>

                {/* Author */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
