"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  X,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  XCircle,
} from "lucide-react";
import { INSTITUTION } from "@/lib/constants";

type Step = "idle" | "education" | "experience" | "qualified" | "not_qualified";

export function ExitIntentPopup() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<Step>("idle");

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 5 && !sessionStorage.getItem("exit-popup-shown")) {
      setShow(true);
      setStep("education");
      sessionStorage.setItem("exit-popup-shown", "true");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      document.addEventListener("mouseout", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, [handleMouseLeave]);

  if (!show) return null;

  const handleEducation = (hasCompleted: boolean) => {
    if (hasCompleted) {
      setStep("experience");
    } else {
      setStep("not_qualified");
    }
  };

  const handleExperience = (hasExperience: boolean) => {
    if (hasExperience) {
      setStep("qualified");
    } else {
      setStep("not_qualified");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <button
        onClick={() => setShow(false)}
        className="absolute right-4 top-4 rounded-full bg-white p-2.5 text-foreground shadow-lg transition-transform hover:scale-110 sm:right-6 sm:top-6"
        aria-label="Fechar"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="mx-4 w-full max-w-lg animate-scale-in overflow-hidden rounded-2xl shadow-2xl">
        <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light px-6 py-10 text-center sm:px-10 sm:py-12">

          {/* Step: Educação */}
          {step === "education" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Descubra se você pode obter seu diploma técnico
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                Responda 2 perguntas rápidas e veja se você se qualifica para a
                certificação por competência.
              </p>
              <p className="mt-8 text-sm font-semibold text-white/90">
                Você já concluiu o Ensino Médio?
              </p>
              <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => handleEducation(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-accent-dark hover:scale-105"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Sim, já concluí
                </button>
                <button
                  onClick={() => handleEducation(false)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-transparent px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Ainda não
                </button>
              </div>
            </>
          )}

          {/* Step: Experiência */}
          {step === "experience" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Ótimo! Agora sobre sua experiência...
              </h2>
              <p className="mt-8 text-sm font-semibold text-white/90">
                Você tem pelo menos 1 ano de experiência profissional na área em
                que deseja se certificar?
              </p>
              <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={() => handleExperience(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-accent-dark hover:scale-105"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Sim, tenho experiência
                </button>
                <button
                  onClick={() => handleExperience(false)}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 bg-transparent px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
                >
                  Menos de 1 ano
                </button>
              </div>
            </>
          )}

          {/* Step: Qualificado */}
          {step === "qualified" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Parabéns! Você se qualifica!
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                Com Ensino Médio completo e experiência na área, você pode obter
                seu diploma técnico com validade nacional pela {INSTITUTION.name}.
              </p>

              <div className="mt-6 inline-flex flex-col gap-2 rounded-xl bg-white/10 px-6 py-4 text-left backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span>100% online — estude no seu ritmo</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span>Diploma registrado no SISTEC/MEC</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                  <span>A partir de 12x de R$ 83,34 sem juros</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col items-center gap-3">
                <Link
                  href="/cursos"
                  onClick={() => setShow(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-accent-dark hover:scale-105"
                >
                  Ver cursos disponíveis
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          )}

          {/* Step: Não qualificado */}
          {step === "not_qualified" && (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/20">
                <XCircle className="h-8 w-8 text-amber-300" />
              </div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Ainda não, mas podemos ajudar!
              </h2>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                A certificação por competência exige Ensino Médio completo e
                pelo menos 1 ano de experiência. Mas um consultor pode orientar
                qual o melhor caminho para você.
              </p>

              <div className="mt-6 flex flex-col items-center gap-3">
                <Link
                  href="/cursos"
                  onClick={() => setShow(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-accent-dark hover:scale-105"
                >
                  Ver cursos disponíveis
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setShow(false)}
                  className="text-sm text-white/60 hover:text-white/80 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
