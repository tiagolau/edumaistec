import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  MonitorPlay,
  ClipboardCheck,
  Award,
  ShieldCheck,
  Scale,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Users,
  BookOpen,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { INSTITUTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Certificação por Competência — O que é e como funciona",
  description:
    "Entenda o que é a certificação técnica por competência, como funciona, quem pode fazer, qual a base legal e como obter seu diploma técnico com validade nacional registrado no SISTEC/MEC.",
  keywords: [
    "certificação por competência",
    "curso técnico por competência",
    "diploma técnico",
    "SISTEC",
    "MEC",
    "Art 41 LDB",
    "aproveitamento de experiência",
    "certificação profissional",
  ],
  openGraph: {
    title: `Certificação por Competência | ${INSTITUTION.name}`,
    description:
      "Transforme sua experiência profissional em diploma técnico. Entenda o modelo de certificação por competência aceito pelo MEC.",
  },
};

const processSteps = [
  {
    icon: FileCheck,
    number: "01",
    title: "Comprove sua experiência",
    description:
      "Apresente documentos que comprovem pelo menos 1 ano de atuação profissional na área: declaração de empregador, carteira de trabalho, contratos de prestação de serviço ou similares.",
  },
  {
    icon: MonitorPlay,
    number: "02",
    title: "Estude na plataforma EAD",
    description:
      "Acesse videoaulas, materiais didáticos e conteúdos de apoio para revisar e reforçar seus conhecimentos. Estude no seu próprio ritmo, 100% online.",
  },
  {
    icon: ClipboardCheck,
    number: "03",
    title: "Realize as avaliações",
    description:
      "Demonstre suas competências por meio de provas teóricas online em cada módulo. É necessário aproveitamento mínimo de 70%. Se não atingir, pode refazer o módulo.",
  },
  {
    icon: Award,
    number: "04",
    title: "Receba seu diploma",
    description:
      "Diploma idêntico ao de um curso técnico regular, emitido em formato digital com código autenticador do SISTEC para verificação de validade nacional.",
  },
];

const legalBases = [
  {
    title: "LDB — Art. 41 (Lei 9.394/96)",
    description:
      '"O conhecimento adquirido na educação profissional e tecnológica, inclusive no trabalho, poderá ser objeto de avaliação, reconhecimento e certificação para prosseguimento ou conclusão de estudos."',
  },
  {
    title: "Resolução CNE/CP n. 1/2021",
    description:
      "Diretrizes Curriculares Nacionais para a Educação Profissional e Tecnológica. Art. 47 — prevê reconhecimento de saberes e competências para fins de certificação profissional.",
  },
  {
    title: "Resolução CNE/CEB n. 4/1999",
    description:
      "Define competência profissional e organiza a educação profissional técnica de nível médio por áreas profissionais com cargas horárias mínimas.",
  },
  {
    title: "Parecer CNE/CEB 16/99",
    description:
      "A responsabilidade de avaliar, reconhecer e certificar é da escola credenciada, que deve ter processo formal planejado à luz do perfil profissional de conclusão.",
  },
];

const documents = [
  "RG (documento de identidade)",
  "CPF",
  "Comprovante de residência atualizado",
  "Certificado de conclusão do Ensino Médio",
  "Declaração de experiência profissional (emitida por empregador)",
  "Carteira de trabalho (CTPS) ou contratos que comprovem atuação na área",
];

const whoCanDo = [
  "Profissionais que já atuam na área há pelo menos 1 ano e querem formalizar com um diploma",
  "Trabalhadores que precisam do diploma para concursos públicos ou progressão de carreira",
  "Profissionais que querem se registrar em conselhos de classe (CFT, COREN, CRF, etc.)",
  "Pessoas que interromperam cursos técnicos e desejam concluir por aproveitamento",
  "Empreendedores e autônomos que precisam certificar sua atuação profissional",
];

const faqs = [
  {
    q: "O diploma menciona que foi obtido por competência?",
    a: "Não. O diploma é idêntico ao de qualquer curso técnico regular, sem nenhuma distinção ou menção ao método de certificação.",
  },
  {
    q: "Posso usar em concursos públicos?",
    a: "Sim. O diploma tem validade nacional e é aceito em qualquer concurso público que exija formação técnica, conforme os Arts. 36-D e 41 da LDB.",
  },
  {
    q: "Em quanto tempo consigo o diploma?",
    a: "Depende do seu ritmo. Como você já tem experiência, pode concluir em poucos meses. A maioria dos alunos conclui em até 6 meses.",
  },
  {
    q: "E se eu não passar na avaliação de algum módulo?",
    a: "Você pode refazer a avaliação daquele módulo específico quantas vezes precisar, sem custo adicional.",
  },
  {
    q: "Como verifico a autenticidade do diploma?",
    a: "Todo diploma recebe um código autenticador do SISTEC. Qualquer pessoa pode verificar a autenticidade em sistec.mec.gov.br/validadenacional.",
  },
  {
    q: "Aceita experiência informal ou como autônomo?",
    a: "Sim. Além de carteira de trabalho, aceitamos declarações de clientes, contratos de prestação de serviço, alvará de funcionamento e outros documentos que comprovem atuação na área.",
  },
];

export default function CertificacaoPorCompetenciaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PageHero
          title="Certificação por Competência"
          subtitle="Transforme sua experiência profissional em um diploma técnico com validade nacional, registrado no SISTEC/MEC."
        />

        {/* Intro Section (sem vídeo — desativado a pedido) */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0d0404] to-background py-16 sm:py-20">
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/[0.06] blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center">
              <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl mb-4">
                Entenda como funciona em poucos passos
              </h2>
              <p className="text-sm text-white/50 mb-8 max-w-xl mx-auto leading-relaxed sm:text-base">
                Descubra se você se qualifica para obter seu diploma técnico
                com base na sua experiência profissional.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
                {[
                  { icon: Users, label: "2.500+ formados" },
                  { icon: ShieldCheck, label: "SISTEC/MEC" },
                  { icon: BookOpen, label: "60+ cursos" },
                ].map((badge, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-white/50"
                  >
                    <badge.icon className="h-4 w-4 text-accent/70" />
                    <span>{badge.label}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* O que é */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-start gap-4 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <HelpCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                    O que é a Certificação por Competência?
                  </h2>
                </div>
              </div>
              <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  A certificação por competência é uma modalidade de formação
                  profissional prevista na legislação brasileira que{" "}
                  <strong className="text-foreground">
                    reconhece e certifica habilidades, conhecimentos e
                    experiências adquiridos na prática de trabalho
                  </strong>
                  .
                </p>
                <p>
                  Em vez de seguir toda a grade curricular de um curso técnico
                  tradicional, o profissional que já atua na área passa por um
                  processo de avaliação onde demonstra que possui as competências
                  exigidas para a habilitação técnica. Ao ser aprovado, recebe um{" "}
                  <strong className="text-foreground">
                    diploma idêntico ao de qualquer curso técnico regular
                  </strong>
                  , com a mesma validade legal.
                </p>
                <p>
                  É a forma mais rápida e objetiva de quem já tem experiência
                  conseguir seu diploma técnico sem precisar cursar anos de
                  aulas sobre o que já domina na prática.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Para quem é */}
        <section className="py-16 sm:py-20 bg-background-alt">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-start gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 shrink-0">
                  <Briefcase className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Para quem é indicado?
                </h2>
              </div>
            </AnimatedSection>
            <div className="space-y-3">
              {whoCanDo.map((item, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 80}>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-success shrink-0" />
                    <p className="text-sm text-foreground leading-relaxed">
                      {item}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            {/* Pré-requisitos destaque */}
            <AnimatedSection animation="fade-up" delay={500}>
              <div className="mt-10 rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Pré-requisitos obrigatórios
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Ensino Médio completo
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Obrigatório para cursos técnicos de nível médio
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="mt-0.5 h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Mínimo de 1 ano de experiência
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Experiência profissional comprovada na área do curso
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl mb-12">
                Como funciona o processo
              </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, idx) => (
                <AnimatedSection
                  key={idx}
                  animation="fade-up"
                  delay={idx * 120}
                >
                  <div className="relative rounded-xl border border-border bg-card p-6 h-full">
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
          </div>
        </section>

        {/* Documentos necessários */}
        <section className="py-16 sm:py-20 bg-background-alt">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-start gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Documentos necessários
                </h2>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {documents.map((doc, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 60}>
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    <span className="text-sm text-foreground">{doc}</span>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Base legal */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-start gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 shrink-0">
                  <Scale className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Base legal
                </h2>
              </div>
            </AnimatedSection>
            <div className="space-y-4">
              {legalBases.map((item, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 80}>
                  <div className="rounded-lg border border-border bg-card p-5">
                    <h3 className="text-sm font-semibold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* Validade do diploma */}
        <section className="py-16 sm:py-20 bg-background-alt">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-start gap-4 mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 shrink-0">
                  <ShieldCheck className="h-6 w-6 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Validade do diploma
                </h2>
              </div>
            </AnimatedSection>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Mesmo valor legal",
                  desc: "Idêntico ao de um curso técnico presencial ou EAD regular, sem nenhuma distinção.",
                },
                {
                  title: "Validade nacional",
                  desc: "Aceito em todo o território brasileiro, registrado no SISTEC/MEC.",
                },
                {
                  title: "Concursos públicos",
                  desc: "Válido para qualquer concurso que exija formação técnica (Arts. 36-D e 41, LDB).",
                },
                {
                  title: "Conselhos de classe",
                  desc: "Permite registro em CFT, COREN, CRF e demais conselhos profissionais.",
                },
                {
                  title: "Verificação online",
                  desc: "Código autenticador verificável em sistec.mec.gov.br/validadenacional.",
                },
                {
                  title: "Sem menção ao método",
                  desc: "O diploma não informa que foi obtido por certificação por competência.",
                },
              ].map((item, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 80}>
                  <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-success shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="fade-up" delay={500}>
              <div className="mt-6 text-center">
                <a
                  href="https://sistec.mec.gov.br/validadenacional"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Verificar autenticidade de diploma no SISTEC
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl mb-10">
                Perguntas frequentes
              </h2>
            </AnimatedSection>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <AnimatedSection key={idx} animation="fade-up" delay={idx * 60}>
                  <details className="group rounded-lg border border-border bg-card">
                    <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-medium text-foreground">
                      {faq.q}
                      <span className="ml-2 text-muted-foreground transition-transform group-open:rotate-180">
                        &#9662;
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-primary-dark py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <AnimatedSection>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Pronto para transformar sua experiência em diploma?
              </h2>
              <p className="mt-4 text-base text-white/75 max-w-lg mx-auto">
                Escolha entre mais de 60 cursos técnicos e comece hoje mesmo.
                Se tiver dúvidas, um consultor pode ajudá-lo.
              </p>
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
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
