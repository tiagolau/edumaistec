"use client";

import { useFormContext } from "react-hook-form";
import { BookOpen, User, MapPin, GraduationCap, CreditCard, Pencil, Briefcase } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { EnrollmentFormData } from "@/lib/validators/enrollment";

interface StepReviewProps {
  onGoToStep: (step: number) => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  stepIndex,
  onEdit,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  stepIndex: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <button
        type="button"
        onClick={() => onEdit(stepIndex)}
        className="flex items-center gap-1 text-xs text-primary hover:underline"
      >
        <Pencil className="h-3 w-3" />
        Editar
      </button>
    </div>
  );
}

const EDUCATION_LABELS: Record<string, string> = {
  medio_completo: "Ensino Médio completo",
  superior_cursando: "Ensino Superior (cursando)",
  superior_completo: "Ensino Superior (completo)",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  "1_2": "1 a 2 anos",
  "2_5": "2 a 5 anos",
  "5_mais": "Mais de 5 anos",
};

const PAYMENT_LABELS: Record<string, string> = {
  B: "Boleto Bancário",
  C: "Cartão de Crédito",
  X: "PIX",
};

const MARITAL_LABELS: Record<string, string> = {
  S: "Solteiro(a)",
  C: "Casado(a)",
  P: "Separado(a)",
  D: "Divorciado(a)",
  V: "Viúvo(a)",
  O: "Outro",
};

export function StepReview({ onGoToStep }: StepReviewProps) {
  const { watch } = useFormContext<EnrollmentFormData>();
  const data = watch();

  const totalInstallmentValue = (data.courses || []).reduce(
    (sum, c) => sum + c.installmentValue,
    0,
  );

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Revise todos os dados antes de confirmar sua matrícula.
      </p>

      {/* Dados Pessoais */}
      <div>
        <SectionHeader
          icon={User}
          title="Dados Pessoais"
          stepIndex={1}
          onEdit={onGoToStep}
        />
        <div className="rounded-lg bg-background-alt p-4">
          <InfoRow label="Nome" value={data.fullName} />
          <InfoRow label="CPF" value={data.cpf} />
          <InfoRow label="E-mail" value={data.email} />
          <InfoRow label="Telefone" value={data.phone} />
          {data.birthDate && (
            <InfoRow label="Nascimento" value={data.birthDate} />
          )}
          {data.sex && (
            <InfoRow
              label="Sexo"
              value={data.sex === "M" ? "Masculino" : "Feminino"}
            />
          )}
          {data.maritalStatus && (
            <InfoRow
              label="Estado civil"
              value={MARITAL_LABELS[data.maritalStatus] || ""}
            />
          )}
        </div>
      </div>

      <Separator />

      {/* Endereço */}
      <div>
        <SectionHeader
          icon={MapPin}
          title="Endereço"
          stepIndex={2}
          onEdit={onGoToStep}
        />
        <div className="rounded-lg bg-background-alt p-4">
          <InfoRow label="CEP" value={data.cep} />
          <InfoRow
            label="Logradouro"
            value={
              data.street
                ? `${data.street}${data.number ? `, ${data.number}` : ""}${data.complement ? ` — ${data.complement}` : ""}`
                : ""
            }
          />
          <InfoRow label="Bairro" value={data.neighborhood} />
          <InfoRow
            label="Cidade/UF"
            value={
              data.city && data.state
                ? `${data.city} — ${data.state}`
                : ""
            }
          />
        </div>
      </div>

      <Separator />

      {/* Qualificação */}
      <div>
        <SectionHeader
          icon={Briefcase}
          title="Qualificação"
          stepIndex={0}
          onEdit={onGoToStep}
        />
        <div className="rounded-lg bg-background-alt p-4">
          <InfoRow
            label="Escolaridade"
            value={
              EDUCATION_LABELS[data.educationLevel as string] || data.educationLevel || ""
            }
          />
          <InfoRow
            label="Experiência"
            value={
              EXPERIENCE_LABELS[data.experienceYears as string] || data.experienceYears || ""
            }
          />
          {data.experienceArea && (
            <InfoRow label="Área de atuação" value={data.experienceArea} />
          )}
        </div>
      </div>

      <Separator />

      {/* Cursos */}
      <div>
        <SectionHeader
          icon={BookOpen}
          title="Curso(s)"
          stepIndex={3}

          onEdit={onGoToStep}
        />
        <div className="space-y-2">
          {(data.courses || []).map((c) => (
            <div
              key={c.id}
              className="rounded-lg bg-primary/5 p-4 flex justify-between items-center"
            >
              <span className="text-sm font-medium text-foreground">
                {c.title}
              </span>
              <span className="text-sm font-bold text-primary shrink-0 ml-2">
                R$ {c.installmentValue.toFixed(2).replace(".", ",")}/mês
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Pagamento */}
      <div>
        <SectionHeader
          icon={CreditCard}
          title="Pagamento"
          stepIndex={4}

          onEdit={onGoToStep}
        />
        <div className="rounded-lg bg-background-alt p-4">
          <InfoRow
            label="Forma de pagamento"
            value={
              data.paymentMethod
                ? PAYMENT_LABELS[data.paymentMethod]
                : ""
            }
          />
          <InfoRow
            label="Parcelas"
            value={`${data.installments}x`}
          />
          <InfoRow
            label="Vencimento 1ª parcela"
            value={data.firstDueDate}
          />
          <div className="border-t border-border mt-2 pt-2">
            <InfoRow
              label="Valor total mensal"
              value={`R$ ${(totalInstallmentValue / (data.installments || 1)).toFixed(2).replace(".", ",")}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
