"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { maskCEP } from "@/lib/masks";
import type { EnrollmentFormData } from "@/lib/validators/enrollment";

const UF_OPTIONS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

export function StepAddress() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<EnrollmentFormData>();

  const [loading, setLoading] = useState(false);
  const cepValue = watch("cep");

  const handleCepBlur = async () => {
    const cep = (cepValue || "").replace(/\D/g, "");
    if (cep.length !== 8) return;

    setLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const json = await res.json();
      if (!json.erro) {
        setValue("street", json.logradouro || "", { shouldValidate: true });
        setValue("neighborhood", json.bairro || "", { shouldValidate: true });
        setValue("city", json.localidade || "", { shouldValidate: true });
        setValue("state", json.uf || "", { shouldValidate: true });
      }
    } catch {
      // User can fill manually
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="cep">CEP *</Label>
          <Input
            id="cep"
            value={cepValue}
            onChange={(e) => setValue("cep", maskCEP(e.target.value))}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            className="mt-1.5"
          />
          <FieldError message={errors.cep?.message as string} />
          {loading && (
            <p className="mt-1 text-xs text-muted-foreground">
              Buscando endereço...
            </p>
          )}
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="street">Logradouro *</Label>
          <Input
            id="street"
            {...register("street")}
            placeholder="Nome da rua"
            className="mt-1.5"
          />
          <FieldError message={errors.street?.message as string} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="number">Número *</Label>
          <Input
            id="number"
            {...register("number")}
            placeholder="Nº"
            className="mt-1.5"
          />
          <FieldError message={errors.number?.message as string} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            {...register("complement")}
            placeholder="Apto, bloco, sala (opcional)"
            className="mt-1.5"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor="neighborhood">Bairro *</Label>
          <Input
            id="neighborhood"
            {...register("neighborhood")}
            placeholder="Bairro"
            className="mt-1.5"
          />
          <FieldError message={errors.neighborhood?.message as string} />
        </div>
        <div>
          <Label htmlFor="city">Cidade *</Label>
          <Input
            id="city"
            {...register("city")}
            placeholder="Cidade"
            className="mt-1.5"
          />
          <FieldError message={errors.city?.message as string} />
        </div>
        <div>
          <Label htmlFor="state">UF *</Label>
          <select
            id="state"
            {...register("state")}
            className="mt-1.5 flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">UF</option>
            {UF_OPTIONS.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
          <FieldError message={errors.state?.message as string} />
        </div>
      </div>
    </div>
  );
}
