"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskCPF, maskPhone } from "@/lib/masks";
import type { EnrollmentFormData } from "@/lib/validators/enrollment";

const UF_OPTIONS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function StepPersonalData() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<EnrollmentFormData>();

  const cpfValue = watch("cpf");
  const phoneValue = watch("phone");

  return (
    <div className="space-y-5">
      {/* Nome */}
      <div>
        <Label htmlFor="fullName">Nome completo *</Label>
        <Input
          id="fullName"
          {...register("fullName")}
          placeholder="Seu nome completo"
          className="mt-1.5"
        />
        <FieldError message={errors.fullName?.message as string} />
      </div>

      {/* CPF + Nascimento */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={cpfValue}
            onChange={(e) => setValue("cpf", maskCPF(e.target.value))}
            placeholder="000.000.000-00"
            className="mt-1.5"
          />
          <FieldError message={errors.cpf?.message as string} />
        </div>
        <div>
          <Label htmlFor="birthDate">Data de nascimento</Label>
          <Input
            id="birthDate"
            type="date"
            {...register("birthDate")}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Telefone + Email */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Telefone / WhatsApp *</Label>
          <Input
            id="phone"
            value={phoneValue}
            onChange={(e) => setValue("phone", maskPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            className="mt-1.5"
          />
          <FieldError message={errors.phone?.message as string} />
        </div>
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="seu@email.com"
            className="mt-1.5"
          />
          <FieldError message={errors.email?.message as string} />
        </div>
      </div>

      {/* Dados adicionais */}
      <details className="rounded-lg border border-border p-4">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
          Dados adicionais (opcional)
        </summary>
        <div className="mt-4 space-y-5">
          {/* Sexo + Estado civil */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="sex">Sexo</Label>
              <select
                id="sex"
                {...register("sex")}
                className="mt-1.5 flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Selecione</option>
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <Label htmlFor="maritalStatus">Estado civil</Label>
              <select
                id="maritalStatus"
                {...register("maritalStatus")}
                className="mt-1.5 flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Selecione</option>
                <option value="S">Solteiro(a)</option>
                <option value="C">Casado(a)</option>
                <option value="P">Separado(a)</option>
                <option value="D">Divorciado(a)</option>
                <option value="V">Viúvo(a)</option>
                <option value="O">Outro</option>
              </select>
            </div>
          </div>

          {/* RG + Órgão expedidor */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="rg">RG</Label>
              <Input
                id="rg"
                {...register("rg")}
                placeholder="Nº do RG"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="rgIssuer">Órgão expedidor</Label>
              <Input
                id="rgIssuer"
                {...register("rgIssuer")}
                placeholder="Ex: SSP-MG"
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Nacionalidade */}
          <div>
            <Label htmlFor="nationality">Nacionalidade</Label>
            <Input
              id="nationality"
              {...register("nationality")}
              placeholder="brasileira"
              className="mt-1.5"
            />
          </div>

          {/* Nomes dos pais */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="motherName">Nome da mãe</Label>
              <Input
                id="motherName"
                {...register("motherName")}
                placeholder="Nome completo da mãe"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="fatherName">Nome do pai</Label>
              <Input
                id="fatherName"
                {...register("fatherName")}
                placeholder="Nome completo do pai"
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
