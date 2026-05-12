"use client";

import { useState } from "react";
import type { EnrollmentFormData } from "@/lib/validators/enrollment";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function useEnrollmentSubmit() {
  const [state, setState] = useState<SubmitState>("idle");
  const [contratacao, setContratacao] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function submit(data: EnrollmentFormData) {
    setState("submitting");
    setErrors([]);

    try {
      const res = await fetch("/api/matricula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setState("error");
        if (json.details) {
          const fieldErrors = Object.values(json.details).flat() as string[];
          setErrors(fieldErrors.length > 0 ? fieldErrors : [json.error || "Erro desconhecido."]);
        } else {
          setErrors(
            json.messages || [json.error || "Erro desconhecido. Tente novamente."],
          );
        }
        return;
      }

      setContratacao(json.contratacao);
      setState("success");
    } catch {
      setState("error");
      setErrors([
        "Erro de conexão. Verifique sua internet e tente novamente.",
      ]);
    }
  }

  function retry() {
    setState("idle");
    setErrors([]);
  }

  return { state, contratacao, errors, submit, retry };
}
