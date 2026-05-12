"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  BookOpen,
  X,
  Copy,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Course, Category, CourseArea } from "@/types/course";

interface SelectedCourse {
  id: number;
  title: string;
  installmentValue: number;
}

export function ProposalForm() {
  // Data
  const [courses, setCourses] = useState<Course[]>([]);
  const [areas, setAreas] = useState<(Category | CourseArea)[]>([]);
  const [loading, setLoading] = useState(true);

  // Form
  const [clientName, setClientName] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<SelectedCourse[]>([]);
  const [installments, setInstallments] = useState(12);
  const [firstDueDate, setFirstDueDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"B" | "C">("B");
  const [message, setMessage] = useState("");

  // Course search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [proposalLink, setProposalLink] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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

  const filteredCourses = useMemo(() => {
    let result = courses.filter((c) => c.active);
    if (selectedArea) {
      result = result.filter((c) => c.categorySlug === selectedArea);
    }
    if (searchTerm.length >= 2) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(term));
    }
    return result;
  }, [courses, selectedArea, searchTerm]);

  function addCourse(course: Course) {
    const numId = typeof course.id === "number" ? course.id : Number(course.id);
    if (selectedCourses.some((sc) => sc.id === numId)) return;

    const installmentValue = course.pricing?.promoInstallmentValue ?? course.price;

    setSelectedCourses((prev) => [
      ...prev,
      { id: numId, title: course.name, installmentValue },
    ]);
  }

  function removeCourse(courseId: number) {
    setSelectedCourses((prev) => prev.filter((c) => c.id !== courseId));
  }

  function updateInstallmentValue(courseId: number, value: number) {
    setSelectedCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, installmentValue: value } : c,
      ),
    );
  }

  async function handleSubmit() {
    setError("");
    setProposalLink("");

    if (!clientName.trim()) {
      setError("Informe o nome do cliente.");
      return;
    }
    if (selectedCourses.length === 0) {
      setError("Selecione pelo menos um curso.");
      return;
    }
    if (!firstDueDate) {
      setError("Informe a data do primeiro vencimento.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/proposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          installments,
          firstDueDate,
          courses: selectedCourses.map((c) => ({
            id: c.id,
            installmentValue: c.installmentValue,
          })),
          paymentMethod,
          message: message || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.messages?.[0] || data.error || "Erro ao gerar proposta.");
        return;
      }

      setProposalLink(data.link);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }

  async function copyLink() {
    await navigator.clipboard.writeText(proposalLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getAreaLabel(area: Category | CourseArea): string {
    return "name" in area ? area.name : area.title;
  }

  // Success state
  if (proposalLink) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Proposta gerada com sucesso!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Envie o link abaixo para o aluno:
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background-alt p-3">
          <input
            readOnly
            value={proposalLink}
            className="flex-1 bg-transparent text-sm text-foreground outline-none truncate"
          />
          <Button size="sm" variant="outline" onClick={copyLink}>
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent-dark">
            <a href={proposalLink} target="_blank" rel="noopener noreferrer">
              Abrir proposta <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setProposalLink("");
              setSelectedCourses([]);
              setClientName("");
              setMessage("");
            }}
          >
            Gerar nova proposta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Checklist de qualificação */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-800 mb-3">
          Checklist de qualificação do aluno
        </p>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-amber-900 cursor-pointer">
            <input type="checkbox" className="rounded border-amber-300" />
            Aluno confirmou Ensino Médio completo
          </label>
          <label className="flex items-center gap-2 text-sm text-amber-900 cursor-pointer">
            <input type="checkbox" className="rounded border-amber-300" />
            Aluno tem 1+ ano de experiência comprovada na área
          </label>
        </div>
        <p className="mt-2 text-xs text-amber-700">
          Certifique-se de que o aluno atende os pré-requisitos antes de gerar a proposta.
        </p>
      </div>

      {/* Client name */}
      <div>
        <Label htmlFor="clientName">
          Nome do aluno <span className="text-red-500">*</span>
        </Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Nome completo do aluno"
          className="mt-1.5"
          maxLength={80}
        />
      </div>

      {/* Selected courses */}
      {selectedCourses.length > 0 && (
        <div>
          <Label className="mb-2 block">
            Cursos selecionados ({selectedCourses.length})
          </Label>
          <div className="space-y-2">
            {selectedCourses.map((sc) => (
              <div
                key={sc.id}
                className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3"
              >
                <BookOpen className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground truncate flex-1">
                  {sc.title}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <Label className="text-xs text-muted-foreground sr-only">
                    Valor parcela
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    value={sc.installmentValue || ""}
                    onChange={(e) =>
                      updateInstallmentValue(sc.id, Number(e.target.value))
                    }
                    className="w-24 h-8 text-xs text-right"
                    placeholder="R$ 0,00"
                  />
                  <button
                    type="button"
                    onClick={() => removeCourse(sc.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Course search */}
      <div className="space-y-3">
        <Label>
          Adicionar curso <span className="text-red-500">*</span>
        </Label>
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

        <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-border p-2">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Carregando cursos...
            </p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Nenhum curso encontrado
            </p>
          ) : (
            filteredCourses.slice(0, 50).map((course) => {
              const numId =
                typeof course.id === "number"
                  ? course.id
                  : Number(course.id);
              const isSelected = selectedCourses.some(
                (sc) => sc.id === numId,
              );
              return (
                <button
                  key={course.id}
                  type="button"
                  onClick={() => !isSelected && addCourse(course)}
                  disabled={isSelected}
                  className={`w-full text-left rounded px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? "bg-primary/5 opacity-60 cursor-default"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {course.name}
                  {isSelected && (
                    <span className="ml-2 text-xs text-success">
                      Selecionado
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Payment details */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="installments">Parcelas</Label>
          <Input
            id="installments"
            type="number"
            min={1}
            max={24}
            value={installments}
            onChange={(e) => setInstallments(Number(e.target.value))}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="firstDueDate">
            1º vencimento <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstDueDate"
            type="date"
            value={firstDueDate}
            onChange={(e) => setFirstDueDate(e.target.value)}
            className="mt-1.5"
          />
        </div>
        <div>
          <Label htmlFor="paymentMethod">Pagamento</Label>
          <select
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as "B" | "C")}
            className="mt-1.5 flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="B">Boleto</option>
            <option value="C">Cartão</option>
          </select>
        </div>
      </div>

      {/* Optional message */}
      <div>
        <Label htmlFor="message">Mensagem (opcional)</Label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Mensagem personalizada para o aluno..."
          maxLength={500}
          rows={3}
          className="mt-1.5 flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
        />
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-accent text-accent-foreground hover:bg-accent-dark text-base"
        size="lg"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Gerando proposta...
          </>
        ) : (
          "Gerar Proposta"
        )}
      </Button>
    </div>
  );
}
