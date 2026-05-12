"use client";

import { useFormContext } from "react-hook-form";
import { GraduationCap, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EnrollmentFormData } from "@/lib/validators/enrollment";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function StepEducation() {
  const {
    register,
    formState: { errors },
  } = useFormContext<EnrollmentFormData>();

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 mb-2">
        <GraduationCap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          A certificação por competência exige Ensino Médio completo e
          experiência profissional comprovada na área do curso.
        </p>
      </div>

      {/* Escolaridade */}
      <div>
        <Label htmlFor="educationLevel">
          Escolaridade <span className="text-red-500">*</span>
        </Label>
        <select
          id="educationLevel"
          {...register("educationLevel")}
          className="mt-1.5 flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Selecione</option>
          <option value="medio_completo">Ensino Médio completo</option>
          <option value="superior_cursando">
            Ensino Superior (cursando)
          </option>
          <option value="superior_completo">
            Ensino Superior (completo)
          </option>
        </select>
        <FieldError message={errors.educationLevel?.message as string} />
      </div>

      {/* Experiência */}
      <div>
        <Label htmlFor="experienceYears" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Tempo de experiência na área <span className="text-red-500">*</span>
        </Label>
        <select
          id="experienceYears"
          {...register("experienceYears")}
          className="mt-1.5 flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Selecione</option>
          <option value="1_2">1 a 2 anos</option>
          <option value="2_5">2 a 5 anos</option>
          <option value="5_mais">Mais de 5 anos</option>
        </select>
        <FieldError message={errors.experienceYears?.message as string} />
      </div>

      {/* Área de atuação */}
      <div>
        <Label htmlFor="experienceArea">
          Área de atuação profissional <span className="text-red-500">*</span>
        </Label>
        <Input
          id="experienceArea"
          {...register("experienceArea")}
          placeholder="Ex: Enfermagem em UTI, Eletricista industrial, Administração financeira..."
          className="mt-1.5"
          maxLength={200}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Descreva brevemente sua área de atuação profissional.
        </p>
        <FieldError message={errors.experienceArea?.message as string} />
      </div>
    </div>
  );
}
