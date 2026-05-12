"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const STORAGE_KEY = "enrollment_attempt_id";
const DEBOUNCE_MS = 2000;

interface TrackingData {
  name: string;
  email: string;
  phone: string;
}

export function useEnrollmentTracking() {
  const [attemptId, setAttemptId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDataRef = useRef<string>("");

  // Limpa o attemptId salvo
  const reset = useCallback(() => {
    setAttemptId(null);
    localStorage.removeItem(STORAGE_KEY);
    lastDataRef.current = "";
  }, []);

  // Cria ou atualiza tentativa quando dados pessoais estao preenchidos
  const trackStart = useCallback(
    (data: TrackingData) => {
      const key = `${data.name}|${data.email}|${data.phone}`;
      if (key === lastDataRef.current) return;

      // Validacao minima
      if (
        data.name.trim().length < 3 ||
        !data.email.includes("@") ||
        data.phone.replace(/\D/g, "").length < 10
      )
        return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(async () => {
        lastDataRef.current = key;
        try {
          const res = await fetch("/api/enrollment-attempt", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.name.trim(),
              email: data.email.trim().toLowerCase(),
              phone: data.phone.trim(),
            }),
          });
          if (res.ok) {
            const json = await res.json();
            setAttemptId(json.id);
            localStorage.setItem(STORAGE_KEY, json.id);
          }
        } catch {
          // Silencioso — tracking nao deve bloquear UX
        }
      }, DEBOUNCE_MS);
    },
    [],
  );

  const trackCourseSelected = useCallback(
    async (courseId: number, courseTitle: string) => {
      const id = attemptId || localStorage.getItem(STORAGE_KEY);
      if (!id) return;
      try {
        await fetch(`/api/enrollment-attempt/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "COURSE_SELECTED",
            mainCourseId: courseId,
            mainCourseTitle: courseTitle,
          }),
        });
      } catch {
        // Silencioso
      }
    },
    [attemptId],
  );

  const trackProposalGenerated = useCallback(
    async (proposalLink: string, extraCourseIds: number[], totalCourses: number) => {
      const id = attemptId || localStorage.getItem(STORAGE_KEY);
      if (!id) return;
      try {
        await fetch(`/api/enrollment-attempt/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "PROPOSAL_GENERATED",
            proposalLink,
            extraCourseIds,
            totalCourses,
          }),
        });
        // Limpa localStorage apos proposta gerada (nao e mais abandono)
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Silencioso
      }
    },
    [attemptId],
  );

  // Limpa debounce ao desmontar
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return { attemptId, trackStart, trackCourseSelected, trackProposalGenerated, reset };
}
