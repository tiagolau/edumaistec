"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  ExternalLink,
  Search,
  Clock,
  BookOpen,
  X,
  Award,
  ShoppingCart,
  GraduationCap,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProposalCheckout } from "@/hooks/use-proposal-checkout";
import {
  PRICING,
  formatCurrency,
  getInstallmentForPosition,
  calculateBundleMonthly,
  calculateBundleSavings,
} from "@/lib/pricing";
import { OrderBump } from "@/components/matricula/order-bump";
import { useEnrollmentTracking } from "@/hooks/use-enrollment-tracking";
import { INSTITUTION } from "@/lib/constants";
import type { Course, Category, CourseArea } from "@/types/course";

type EducationLevel = "" | "medio_incompleto" | "medio_completo" | "superior";
type ExperienceRange = "" | "menos_1" | "1_2" | "2_5" | "5_mais";

interface SelectedCourse {
  id: number;
  title: string;
  categorySlug: string;
}

function getAreaLabel(area: Category | CourseArea): string {
  return "name" in area ? area.name : area.title;
}

export function EnrollmentForm() {
  const searchParams = useSearchParams();
  const preselectedRef = useRef(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Qualificacao
  const [qualified, setQualified] = useState(false);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("");
  const [experienceRange, setExperienceRange] = useState<ExperienceRange>("");

  const isEducationBlocked = educationLevel === "medio_incompleto";
  const isExperienceBlocked = experienceRange === "menos_1";
  const isBlocked = isEducationBlocked || isExperienceBlocked;
  const canQualify =
    educationLevel !== "" &&
    !isEducationBlocked &&
    experienceRange !== "" &&
    !isExperienceBlocked;

  // Curso principal
  const [mainCourse, setMainCourse] = useState<SelectedCourse | null>(null);
  // Cursos extras (order bump)
  const [extraCourses, setExtraCourses] = useState<SelectedCourse[]>([]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [areas, setAreas] = useState<(Category | CourseArea)[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  const {
    state: submitState,
    link,
    errors: submitErrors,
    submit,
    retry,
  } = useProposalCheckout();

  const {
    trackStart,
    trackCourseSelected,
    trackProposalGenerated,
    reset: resetTracking,
  } = useEnrollmentTracking();

  // Buscar cursos e areas
  useEffect(() => {
    async function fetchData() {
      try {
        const [coursesRes, areasRes] = await Promise.all([
          fetch("/api/cursos"),
          fetch("/api/areas"),
        ]);
        if (coursesRes.ok) {
          const data = await coursesRes.json();
          setCourses(data.data || []);
        }
        if (areasRes.ok) {
          const data = await areasRes.json();
          setAreas(data.data || []);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Pre-selecionar curso vindo da URL (?curso=slug)
  useEffect(() => {
    if (preselectedRef.current || courses.length === 0) return;
    const cursoSlug = searchParams.get("curso");
    if (!cursoSlug) return;

    const course = courses.find((c) => c.active && c.slug === cursoSlug);
    if (!course) return;

    const numId =
      typeof course.id === "number" ? course.id : Number(course.id);
    setMainCourse({
      id: numId,
      title: course.name,
      categorySlug: course.categorySlug,
    });
    preselectedRef.current = true;
  }, [courses, searchParams]);

  // Tracking: dados pessoais preenchidos
  useEffect(() => {
    trackStart({ name, email, phone });
  }, [name, email, phone, trackStart]);

  // Tracking: curso principal selecionado
  useEffect(() => {
    if (mainCourse) {
      trackCourseSelected(mainCourse.id, mainCourse.title);
    }
  }, [mainCourse, trackCourseSelected]);

  const activeCourses = useMemo(
    () => courses.filter((c) => c.active),
    [courses],
  );

  const filteredCourses = useMemo(() => {
    let result = activeCourses;
    if (selectedArea) {
      result = result.filter((c) => c.categorySlug === selectedArea);
    }
    if (searchTerm.length >= 2) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term));
    }
    return result;
  }, [activeCourses, selectedArea, searchTerm]);

  // Total de cursos selecionados
  const totalCourses = mainCourse ? 1 + extraCourses.length : 0;
  const monthlyTotal = calculateBundleMonthly(totalCourses);
  const monthlySavings = calculateBundleSavings(totalCourses);

  const canSubmit =
    name.trim().length >= 3 &&
    email.includes("@") &&
    phone.replace(/\D/g, "").length >= 10 &&
    mainCourse !== null;

  const handleToggleExtra = useCallback(
    (courseId: number, courseTitle: string) => {
      setExtraCourses((prev) => {
        const exists = prev.find((c) => c.id === courseId);
        if (exists) {
          return prev.filter((c) => c.id !== courseId);
        }
        const course = courses.find(
          (c) => Number(c.id) === courseId,
        );
        return [
          ...prev,
          {
            id: courseId,
            title: courseTitle,
            categorySlug: course?.categorySlug || "",
          },
        ];
      });
    },
    [courses],
  );

  const handleRemoveMain = () => {
    setMainCourse(null);
    setExtraCourses([]);
  };

  const handleRemoveExtra = (courseId: number) => {
    setExtraCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const handleSubmit = async () => {
    if (!mainCourse || !canSubmit) return;

    const allCourses = [mainCourse, ...extraCourses];
    const result = await submit({
      name: name.trim(),
      courses: allCourses.map((c, i) => ({
        id: c.id,
        installmentValue: getInstallmentForPosition(i + 1),
      })),
    });

    // Tracking: proposta gerada
    if (result?.link) {
      trackProposalGenerated(
        result.link,
        extraCourses.map((c) => c.id),
        allCourses.length,
      );
    }
  };

  // === Tela de sucesso ===
  if (submitState === "success") {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-8 text-center sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Proposta gerada com sucesso!
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-md mx-auto">
            Uma nova aba foi aberta para você concluir sua matrícula e pagamento
            diretamente na plataforma. Se não abriu, clique no botão abaixo.
          </p>

          {totalCourses > 1 && (
            <p className="mt-2 text-sm font-medium text-primary">
              {totalCourses} cursos incluídos na sua matrícula
            </p>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {link && (
              <Button
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent-dark"
                size="lg"
              >
                <a href={link} target="_blank" rel="noopener noreferrer">
                  Concluir matrícula
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                retry();
                resetTracking();
                setMainCourse(null);
                setExtraCourses([]);
                setName("");
                setEmail("");
                setPhone("");
              }}
            >
              Nova matrícula
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">
            Dúvidas? WhatsApp:{" "}
            <a
              href={INSTITUTION.contacts.whatsappLink}
              className="text-primary font-medium hover:underline"
            >
              {INSTITUTION.contacts.whatsapp}
            </a>
          </p>
        </div>

        {/* Upsell Section - cursos adicionais */}
        <UpsellAfterSuccess
          enrolledIds={[
            mainCourse?.id ?? 0,
            ...extraCourses.map((c) => c.id),
          ].filter(Boolean)}
          allCourses={courses}
          studentName={name}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error banner */}
      {submitState === "error" && submitErrors.length > 0 && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Erro ao processar matrícula
              </p>
              <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                {submitErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* === Step de Qualificacao === */}
      {!qualified && (
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-foreground mb-1">
            Verifique se você se qualifica
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            A certificação por competência exige ensino médio completo e
            experiência profissional comprovada na área do curso.
          </p>

          <div className="space-y-5">
            {/* Escolaridade */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Qual sua escolaridade? *
              </Label>
              <select
                value={educationLevel}
                onChange={(e) =>
                  setEducationLevel(e.target.value as EducationLevel)
                }
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Selecione</option>
                <option value="medio_incompleto">
                  Ensino Médio incompleto
                </option>
                <option value="medio_completo">Ensino Médio completo</option>
                <option value="superior">
                  Ensino Superior (completo ou cursando)
                </option>
              </select>
              {isEducationBlocked && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">
                      Ensino Médio completo é obrigatório
                    </p>
                    <p className="mt-1 text-amber-700">
                      Para cursos técnicos de nível médio, é necessário ter o
                      Ensino Médio completo. Um consultor pode orientá-lo sobre
                      as melhores opções.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Experiencia */}
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-primary" />
                Tempo de experiência na área do curso? *
              </Label>
              <select
                value={experienceRange}
                onChange={(e) =>
                  setExperienceRange(e.target.value as ExperienceRange)
                }
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Selecione</option>
                <option value="menos_1">Menos de 1 ano</option>
                <option value="1_2">1 a 2 anos</option>
                <option value="2_5">2 a 5 anos</option>
                <option value="5_mais">Mais de 5 anos</option>
              </select>
              {isExperienceBlocked && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">
                      Mínimo de 1 ano de experiência necessário
                    </p>
                    <p className="mt-1 text-amber-700">
                      A certificação por competência exige pelo menos 1 ano de
                      experiência profissional comprovada na área. Fale com um
                      consultor para entender suas opções.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Botoes */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {isBlocked ? (
              <Button
                className="w-full bg-primary text-primary-foreground hover:bg-primary-light text-base"
                size="lg"
                asChild
              >
                <Link href="/cursos">Ver cursos disponíveis</Link>
              </Button>
            ) : (
              <Button
                onClick={() => setQualified(true)}
                disabled={!canQualify}
                className="w-full bg-accent text-accent-foreground hover:bg-accent-dark text-base"
                size="lg"
              >
                Continuar para matrícula
              </Button>
            )}
          </div>
        </div>
      )}

      {/* === Formulario principal (so aparece apos qualificacao) === */}
      {qualified && <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-foreground mb-1">
          Seus dados
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Preencha seus dados e escolha o curso para prosseguir com a matrícula.
        </p>

        {/* Dados do aluno */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Nome completo *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              className="mt-1.5"
              maxLength={80}
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="phone">WhatsApp *</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(31) 99999-9999"
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Cursos selecionados */}
        {mainCourse && (
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">
              Cursos selecionados
              {totalCourses > 1 && (
                <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  <ShoppingCart className="h-3 w-3" />
                  {totalCourses} cursos
                </span>
              )}
            </Label>

            <div className="space-y-2">
              {/* Curso principal */}
              <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {mainCourse.title}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm text-primary font-semibold">
                    {PRICING.card.installments}x R${" "}
                    {formatCurrency(PRICING.card.installmentValue)}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveMain}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Cursos extras */}
              {extraCourses.map((course, index) => {
                const position = index + 2;
                const installment = getInstallmentForPosition(position);
                return (
                  <div
                    key={course.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-accent/20 bg-accent/5 px-4 py-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <BookOpen className="h-4 w-4 text-accent shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {course.title}
                      </span>
                      <span className="text-xs font-semibold text-white bg-accent rounded px-1.5 py-0.5 shrink-0">
                        {Math.round(
                          ((PRICING.card.installmentValue - installment) /
                            PRICING.card.installmentValue) *
                            100,
                        )}
                        % OFF
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm text-accent font-semibold">
                        {PRICING.card.installments}x R${" "}
                        {formatCurrency(installment)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExtra(course.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selecao de curso */}
        {!mainCourse && (
          <>
            <Label className="text-sm font-medium mb-2 block">
              Escolha seu curso *
            </Label>
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar curso por nome..."
                  className="pl-10"
                />
              </div>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Todas as áreas</option>
                {areas.map((area) => (
                  <option key={area.slug} value={area.slug}>
                    {getAreaLabel(area)}
                  </option>
                ))}
              </select>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1 rounded-lg border border-border p-2">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Carregando cursos...
                </p>
              ) : filteredCourses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum curso encontrado
                </p>
              ) : (
                filteredCourses.map((course) => {
                  const numId =
                    typeof course.id === "number"
                      ? course.id
                      : Number(course.id);
                  const categoryName =
                    course.area?.title || course.categorySlug;

                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() =>
                        setMainCourse({
                          id: numId,
                          title: course.name,
                          categorySlug: course.categorySlug,
                        })
                      }
                      className="w-full text-left rounded-lg p-3 transition-colors hover:bg-muted/50 border border-transparent"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {course.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {categoryName && (
                              <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
                                {categoryName}
                              </span>
                            )}
                            {course.duration && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {course.duration}
                              </span>
                            )}
                            {course.workload > 0 && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                {course.workload}h
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-bold text-primary shrink-0">
                          {PRICING.card.installments}x R${" "}
                          {formatCurrency(PRICING.card.installmentValue)}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </>
        )}

        {/* Order Bump */}
        {mainCourse && (
          <OrderBump
            mainCourse={mainCourse}
            allCourses={courses}
            selectedExtras={extraCourses.map((c) => c.id)}
            onToggleCourse={handleToggleExtra}
          />
        )}

        {/* Resumo de preco */}
        {mainCourse && (
          <div className="mt-6 rounded-xl border border-border bg-background-alt p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground line-through">
                De: {PRICING.originalInstallments}x R${" "}
                {formatCurrency(
                  totalCourses > 1
                    ? totalCourses * PRICING.originalInstallmentValue
                    : PRICING.originalInstallmentValue,
                )}
              </span>
              {monthlySavings > 0 && (
                <span className="text-xs font-semibold text-white bg-accent rounded-full px-2.5 py-1">
                  Economize R$ {formatCurrency(monthlySavings)}/mês
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Por{" "}
                {totalCourses > 1 && (
                  <span className="text-xs text-muted-foreground font-normal">
                    ({totalCourses} cursos)
                  </span>
                )}
              </span>
              <span className="text-xl font-bold text-primary">
                {PRICING.card.installments}x R$ {formatCurrency(monthlyTotal)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 text-right">
              sem juros no cartão | R${" "}
              {formatCurrency(monthlyTotal * PRICING.card.installments)} total
            </p>
          </div>
        )}

        {/* CTA */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || submitState === "submitting"}
          className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent-dark text-base"
          size="lg"
        >
          {submitState === "submitting" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : totalCourses > 1 ? (
            `Matricular em ${totalCourses} cursos`
          ) : (
            "Matricular agora"
          )}
        </Button>

        <p className="mt-3 text-xs text-center text-muted-foreground">
          Você será redirecionado para a plataforma da faculdade para concluir o
          cadastro e pagamento.
        </p>
      </div>}
    </div>
  );
}

// === Upsell inline (aparece na tela de sucesso) ===

function UpsellAfterSuccess({
  enrolledIds,
  allCourses,
  studentName,
}: {
  enrolledIds: number[];
  allCourses: Course[];
  studentName: string;
}) {
  const { state, link, submit } = useProposalCheckout();

  const suggestions = useMemo(() => {
    return allCourses
      .filter((c) => c.active && !enrolledIds.includes(Number(c.id)))
      .slice(0, 3);
  }, [allCourses, enrolledIds]);

  if (suggestions.length === 0) return null;

  if (state === "success" && link) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
        <CheckCircle2 className="h-8 w-8 text-accent mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-3">
          Nova proposta gerada!
        </p>
        <Button asChild size="sm" className="bg-accent text-accent-foreground">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Concluir matrícula do novo curso
            <ExternalLink className="ml-2 h-3 w-3" />
          </a>
        </Button>
      </div>
    );
  }

  const handleUpsell = async (course: Course) => {
    const courseId =
      typeof course.id === "number" ? course.id : Number(course.id);
    await submit({
      name: studentName,
      courses: [
        {
          id: courseId,
          installmentValue: PRICING.card.installmentValue,
        },
      ],
    });
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Que tal expandir sua formação?
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Confira outros cursos que podem complementar seus estudos.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {suggestions.map((course) => (
          <div
            key={course.id}
            className="rounded-lg border border-border p-4 flex flex-col"
          >
            <p className="text-sm font-medium text-foreground flex-1">
              {course.name}
            </p>
            <div className="mt-3">
              <p className="text-xs text-muted-foreground">
                {PRICING.card.installments}x R${" "}
                {formatCurrency(PRICING.card.installmentValue)}
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-2 w-full text-xs"
                disabled={state === "submitting"}
                onClick={() => handleUpsell(course)}
              >
                {state === "submitting" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Quero este também"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
