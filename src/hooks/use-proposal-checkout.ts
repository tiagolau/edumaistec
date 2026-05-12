"use client";

import { useState } from "react";

interface ProposalCourse {
  id: number;
  installmentValue: number;
}

interface ProposalData {
  name: string;
  courses: ProposalCourse[];
}

type SubmitState = "idle" | "submitting" | "success" | "error";

export function useProposalCheckout() {
  const [state, setState] = useState<SubmitState>("idle");
  const [link, setLink] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function submit(data: ProposalData): Promise<{ link: string } | null> {
    setState("submitting");
    setErrors([]);

    try {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 7);
      const firstDueDate = dueDate.toISOString().split("T")[0];

      const res = await fetch("/api/proposta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          installments: 12,
          firstDueDate,
          courses: data.courses.map((c) => ({
            id: c.id,
            installmentValue: c.installmentValue,
            negotiatedValue: c.installmentValue,
          })),
          paymentMethod: "C",
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setState("error");
        setErrors(
          json.messages || [json.error || "Erro ao gerar proposta. Tente novamente."],
        );
        return null;
      }

      setLink(json.link);
      setState("success");

      // Redireciona para o checkout da Eduno
      if (json.link) {
        window.open(json.link, "_blank");
      }

      return { link: json.link };
    } catch {
      setState("error");
      setErrors([
        "Erro de conexão. Verifique sua internet e tente novamente.",
      ]);
      return null;
    }
  }

  function retry() {
    setState("idle");
    setErrors([]);
    setLink(null);
  }

  return { state, link, errors, submit, retry };
}
