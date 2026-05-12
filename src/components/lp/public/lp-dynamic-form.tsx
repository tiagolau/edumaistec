"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { FormFieldConfig } from "@/lib/lp/types";
import { maskPhone } from "@/lib/masks";

type Props = {
  landingPageId: string;
  formFields: FormFieldConfig[];
};

export function LpDynamicForm({ landingPageId, formFields }: Props) {
  const sorted = [...formFields].sort((a, b) => a.order - b.order);

  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const initial: Record<string, string | boolean> = {};
    for (const field of sorted) {
      initial[field.name] = field.type === "checkbox" ? false : "";
    }
    return initial;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function updateValue(name: string, value: string | boolean) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of sorted) {
      const value = values[field.name];
      if (field.required) {
        if (field.type === "checkbox" && value !== true) {
          newErrors[field.name] = `${field.label} é obrigatório`;
        } else if (field.type !== "checkbox" && (!value || value === "")) {
          newErrors[field.name] = `${field.label} é obrigatório`;
        }
      }
      if (field.type === "email" && value && typeof value === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = "E-mail inválido";
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/lp/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landingPageId, data: values }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.details) {
          setErrors(data.details);
        }
        return;
      }

      const { redirectUrl } = await res.json();
      window.location.href = redirectUrl;
    } catch {
      setErrors({ _form: "Erro de conexão. Tente novamente." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {errors._form && (
        <p className="text-sm text-red-500">{errors._form}</p>
      )}

      {sorted.map((field) => (
        <div key={field.id}>
          {field.type === "checkbox" ? (
            <div className="flex items-center gap-2">
              <Checkbox
                id={field.id}
                checked={values[field.name] === true}
                onCheckedChange={(checked) =>
                  updateValue(field.name, checked === true)
                }
              />
              <Label htmlFor={field.id} className="text-sm">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </Label>
            </div>
          ) : field.type === "select" ? (
            <div>
              <Label htmlFor={field.id} className="mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </Label>
              <Select
                value={values[field.name] as string}
                onValueChange={(value) => updateValue(field.name, value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={field.placeholder || "Selecione..."} />
                </SelectTrigger>
                <SelectContent>
                  {(field.options || []).map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div>
              <Label htmlFor={field.id} className="mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </Label>
              <Input
                id={field.id}
                type={field.type === "email" ? "email" : "text"}
                value={values[field.name] as string}
                onChange={(e) => {
                  let val = e.target.value;
                  if (field.type === "phone") {
                    val = maskPhone(val);
                  }
                  updateValue(field.name, val);
                }}
                placeholder={field.placeholder}
              />
            </div>
          )}
          {errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}

      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting && <Loader2 className="animate-spin" />}
        Enviar
      </Button>
    </form>
  );
}
