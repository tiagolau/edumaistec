"use client";

import { useFormContext } from "react-hook-form";
import { CreditCard, FileText, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EnrollmentFormData } from "@/lib/validators/enrollment";

const PAYMENT_METHODS = [
  {
    value: "X" as const,
    label: "PIX",
    icon: Zap,
    description: "Pagamento instantâneo",
  },
  {
    value: "C" as const,
    label: "Cartão de Crédito",
    icon: CreditCard,
    description: "Até 12x",
  },
  {
    value: "B" as const,
    label: "Boleto Bancário",
    icon: FileText,
    description: "Vencimento em 3 dias úteis",
  },
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function StepPayment() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<EnrollmentFormData>();

  const paymentMethod = watch("paymentMethod");
  const installments = watch("installments");
  const selectedCourses = watch("courses") || [];

  const totalInstallmentValue = selectedCourses.reduce(
    (sum, c) => sum + c.installmentValue,
    0,
  );

  const maxInstallments =
    paymentMethod === "X" ? 1 : paymentMethod === "C" ? 12 : 18;

  return (
    <div className="space-y-6">
      {/* Forma de pagamento */}
      <div>
        <Label className="text-sm font-medium mb-3 block">
          Forma de pagamento *
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;
            const isSelected = paymentMethod === method.value;

            return (
              <button
                key={method.value}
                type="button"
                onClick={() => {
                  setValue("paymentMethod", method.value, {
                    shouldValidate: true,
                  });
                  if (method.value === "X") {
                    setValue("installments", 1);
                  }
                }}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/30 text-muted-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-semibold">{method.label}</span>
                <span className="text-xs">{method.description}</span>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.paymentMethod?.message as string} />
      </div>

      {/* Parcelas */}
      {paymentMethod !== "X" && (
        <div>
          <Label htmlFor="installments">Número de parcelas *</Label>
          <select
            id="installments"
            value={installments}
            onChange={(e) =>
              setValue("installments", Number(e.target.value), {
                shouldValidate: true,
              })
            }
            className="mt-1.5 flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {Array.from({ length: maxInstallments }, (_, i) => i + 1).map(
              (n) => (
                <option key={n} value={n}>
                  {n}x de R${" "}
                  {(totalInstallmentValue / n).toFixed(2).replace(".", ",")}
                </option>
              ),
            )}
          </select>
          <FieldError message={errors.installments?.message as string} />
        </div>
      )}

      {/* Vencimento */}
      <div>
        <Label htmlFor="firstDueDate">
          Data de vencimento da 1ª parcela *
        </Label>
        <Input
          id="firstDueDate"
          type="date"
          {...register("firstDueDate")}
          className="mt-1.5"
          min={new Date().toISOString().split("T")[0]}
        />
        <FieldError message={errors.firstDueDate?.message as string} />
      </div>

      {/* Resumo financeiro */}
      {selectedCourses.length > 0 && (
        <div className="rounded-xl border border-border bg-background-alt p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Resumo financeiro
          </h3>
          <div className="space-y-2">
            {selectedCourses.map((c) => (
              <div
                key={c.id}
                className="flex justify-between text-sm"
              >
                <span className="text-muted-foreground truncate mr-2">
                  {c.title}
                </span>
                <span className="font-medium text-foreground shrink-0">
                  R$ {c.installmentValue.toFixed(2).replace(".", ",")}
                  /mês
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2 mt-2 flex justify-between">
              <span className="text-sm font-semibold text-foreground">
                Total{" "}
                {paymentMethod === "X"
                  ? "(à vista)"
                  : `(${installments}x)`}
              </span>
              <span className="text-lg font-bold text-primary">
                {paymentMethod === "X"
                  ? `R$ ${totalInstallmentValue.toFixed(2).replace(".", ",")}`
                  : `${installments}x R$ ${(totalInstallmentValue / installments).toFixed(2).replace(".", ",")}`}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
