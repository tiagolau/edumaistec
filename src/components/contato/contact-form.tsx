"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { maskPhone } from "@/lib/masks";
import type { ContactFormData } from "@/lib/validators/contact";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function ContactForm() {
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const phoneValue = watch("phone");

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState("submitting");

    try {
      const res = await fetch("/api/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        setSubmitState("error");
        return;
      }

      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
  };

  if (submitState === "success") {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
          <Send className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Mensagem enviada!
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Recebemos sua mensagem e retornaremos em breve.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setSubmitState("idle");
            reset();
          }}
        >
          Enviar outra mensagem
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {submitState === "error" && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Erro ao enviar mensagem. Tente novamente ou entre em contato pelo
          WhatsApp.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Nome completo *
          </label>
          <Input
            id="name"
            {...register("name", { required: "Nome é obrigatório" })}
            placeholder="Seu nome"
            className="h-11"
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            E-mail *
          </label>
          <Input
            id="email"
            type="email"
            {...register("email", {
              required: "Email é obrigatório",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Email inválido",
              },
            })}
            placeholder="seu@email.com"
            className="h-11"
          />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Telefone
        </label>
        <Input
          id="phone"
          value={phoneValue}
          onChange={(e) => setValue("phone", maskPhone(e.target.value))}
          placeholder="(00) 00000-0000"
          className="h-11"
        />
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Assunto *
        </label>
        <Input
          id="subject"
          {...register("subject", { required: "Assunto é obrigatório" })}
          placeholder="Sobre o que deseja falar?"
          className="h-11"
        />
        <FieldError message={errors.subject?.message} />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Mensagem *
        </label>
        <textarea
          id="message"
          {...register("message", {
            required: "Mensagem é obrigatória",
            minLength: {
              value: 10,
              message: "Mensagem deve ter pelo menos 10 caracteres",
            },
          })}
          rows={4}
          placeholder="Escreva sua mensagem..."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <FieldError message={errors.message?.message} />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitState === "submitting"}
        className="w-full bg-primary text-primary-foreground hover:bg-primary-light text-base"
      >
        {submitState === "submitting" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Enviar mensagem
          </>
        )}
      </Button>
    </form>
  );
}
