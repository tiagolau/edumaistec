import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  CreditCard,
  Zap,
  FileText,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MecBadge } from "@/components/shared/mec-badge";
import { CourseHowItWorks } from "@/components/cursos/course-how-it-works";
import { getCourseBySlug } from "@/lib/services/courses";
import { INSTITUTION } from "@/lib/constants";
import { formatCurrency } from "@/lib/pricing";

export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Curso não encontrado" };

  return {
    title: course.name,
    description: course.description || `Curso técnico ${course.name} - ${INSTITUTION.name}`,
    openGraph: {
      title: `${course.name} | ${INSTITUTION.name}`,
      description: course.description || `Curso técnico ${course.name}`,
    },
  };
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) notFound();

  const categoryName = course.area?.title || course.categorySlug;
  const categorySlug = course.area?.slug || course.categorySlug;
  const { pricing } = course;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description || course.name,
    provider: {
      "@type": "EducationalOrganization",
      name: INSTITUTION.name,
      url: `https://${INSTITUTION.domain}`,
    },
    educationalCredentialAwarded: "Curso Técnico de Nível Médio",
    ...(course.durationMonths
      ? { timeRequired: `P${course.durationMonths}M` }
      : {}),
    ...(course.workload ? { numberOfCredits: course.workload } : {}),
    occupationalCredentialAwarded: "Habilitação Técnica Profissional",
    offers: {
      "@type": "Offer",
      price: pricing.pixTotal,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://${INSTITUTION.domain}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Cursos",
        item: `https://${INSTITUTION.domain}/cursos`,
      },
      ...(categoryName
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: categoryName,
              item: `https://${INSTITUTION.domain}/cursos?categoria=${categorySlug}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: course.name,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: course.name,
            },
          ]),
    ],
  };

  const needs2Years =
    course.slug.includes("enfermagem") || course.slug.includes("saude-bucal");
  const needsCoren = course.slug.includes("enfermagem");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-background-alt border-b border-border">
          <div className="mx-auto flex max-w-7xl items-center gap-1.5 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link
              href="/cursos"
              className="hover:text-primary transition-colors"
            >
              Cursos
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {categoryName && (
              <>
                <Link
                  href={`/cursos?categoria=${categorySlug}`}
                  className="hover:text-primary transition-colors"
                >
                  {categoryName}
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
              </>
            )}
            <span className="truncate font-medium text-foreground">
              {course.name}
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Link
                href="/cursos"
                className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para cursos
              </Link>

              <Badge variant="secondary" className="mb-3 text-primary">
                {categoryName}
              </Badge>

              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {course.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <MecBadge />
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </span>
                  )}
                  {course.workload > 0 && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.workload}h
                    </span>
                  )}
                  <Badge variant="outline">{course.modality}</Badge>
                </div>
              </div>

              <Separator className="my-6" />

              {/* About */}
              {course.description && (
                <section className="mb-8">
                  <h2 className="mb-3 text-xl font-semibold text-foreground">
                    Sobre o curso
                  </h2>
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {course.description}
                  </p>
                </section>
              )}

              {/* How it works */}
              <CourseHowItWorks />

              {/* Curriculum */}
              {course.curriculum.length > 0 && (
                <section className="mb-8">
                  <h2 className="mb-4 text-xl font-semibold text-foreground">
                    Grade Curricular
                  </h2>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {course.curriculum.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 rounded-lg border border-border p-3"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Target audience */}
              {course.targetAudience && (
                <section className="mb-8">
                  <h2 className="mb-3 text-xl font-semibold text-foreground">
                    Público-alvo
                  </h2>
                  <div className="flex items-start gap-2 rounded-lg bg-background-alt p-4">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {course.targetAudience}
                    </p>
                  </div>
                </section>
              )}

              {/* Prerequisites — banner fixo de certificação por competência */}
              <section className="mb-8">
                <h2 className="mb-3 text-xl font-semibold text-foreground">
                  Pré-requisitos
                </h2>
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
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
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {needs2Years
                          ? "Mínimo de 2 anos de experiência na área"
                          : "Mínimo de 1 ano de experiência na área"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Certificação por competência exige experiência profissional comprovada
                      </p>
                      {needsCoren && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Obs.: alguns estados exigem COREN ativo há mais de 2 anos como auxiliar de enfermagem
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        Documentos necessários
                      </p>
                      <p className="text-xs text-muted-foreground">
                        RG, CPF, comprovante de residência e declaração de experiência profissional
                      </p>
                    </div>
                  </div>
                </div>
                {course.prerequisites && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {course.prerequisites}
                  </p>
                )}
              </section>

              {/* TCC requirement */}
              {course.tccRequired && (
                <section className="mb-8">
                  <h2 className="mb-3 text-xl font-semibold text-foreground">
                    TCC (Trabalho de Conclusão de Curso)
                  </h2>
                  <div className="flex items-start gap-2 rounded-lg bg-background-alt p-4">
                    <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm text-muted-foreground">
                      {course.tccRequired}
                    </p>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar — Pricing/CTA card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground">
                  Investimento
                </h3>

                {/* Preço original tachado */}
                <p className="mt-4 text-sm text-muted-foreground line-through">
                  De: {pricing.originalInstallments}x R${" "}
                  {formatCurrency(pricing.originalInstallmentValue)}
                </p>

                {/* Preço promocional */}
                <p className="mt-1 text-xs text-muted-foreground">Por</p>
                <p className="text-3xl font-bold text-primary">
                  {pricing.promoInstallments}x R${" "}
                  {formatCurrency(pricing.promoInstallmentValue)}
                </p>
                <p className="text-sm text-muted-foreground">
                  sem juros no cartão
                </p>

                <Separator className="my-4" />

                {/* Outras condições */}
                <p className="text-xs font-semibold text-foreground mb-2">
                  Outras condições
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-accent shrink-0" />
                    <span>
                      <span className="font-semibold text-foreground">
                        R$ {formatCurrency(pricing.pixTotal)}
                      </span>{" "}
                      no Pix
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CreditCard className="h-4 w-4 text-accent shrink-0" />
                    <span>
                      <span className="font-semibold text-foreground">
                        {pricing.promoInstallments}x R${" "}
                        {formatCurrency(pricing.promoInstallmentValue)}
                      </span>{" "}
                      no Cartão
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 text-accent shrink-0" />
                    <span>
                      <span className="font-semibold text-foreground">
                        {pricing.boletoInstallments}x R${" "}
                        {formatCurrency(pricing.boletoInstallmentValue)}
                      </span>{" "}
                      no Boleto
                    </span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent-dark text-base"
                  asChild
                >
                  <Link href={`/matricula?curso=${course.slug}`}>
                    Matricule-se agora
                  </Link>
                </Button>

                {/* Info list */}
                <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Diploma gratuito
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Acesso imediato após pagamento
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    100% online — estude quando quiser
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success" />
                    Cadastrado no SISTEC/MEC
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
