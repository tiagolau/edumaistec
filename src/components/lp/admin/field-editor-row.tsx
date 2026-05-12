"use client";

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
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { FormFieldConfig, FormFieldType } from "@/lib/lp/types";

type Props = {
  field: FormFieldConfig;
  onChange: (updated: FormFieldConfig) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
};

const FIELD_TYPES: { value: FormFieldType; label: string }[] = [
  { value: "text", label: "Texto" },
  { value: "email", label: "E-mail" },
  { value: "phone", label: "Telefone" },
  { value: "select", label: "Lista" },
  { value: "checkbox", label: "Checkbox" },
];

export function FieldEditorRow({
  field,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: Props) {
  function update(partial: Partial<FormFieldConfig>) {
    onChange({ ...field, ...partial });
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <Label className="mb-1.5 text-xs">Label</Label>
            <Input
              value={field.label}
              onChange={(e) =>
                update({
                  label: e.target.value,
                  name: slugify(e.target.value),
                })
              }
              placeholder="Ex: Nome completo"
            />
          </div>
          <div>
            <Label className="mb-1.5 text-xs">Nome (chave)</Label>
            <Input
              value={field.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Ex: nome_completo"
            />
          </div>
          <div>
            <Label className="mb-1.5 text-xs">Tipo</Label>
            <Select
              value={field.type}
              onValueChange={(value: FormFieldType) => update({ type: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-1 pt-5">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onMoveUp}
            disabled={isFirst}
          >
            <ChevronUp />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onMoveDown}
            disabled={isLast}
          >
            <ChevronDown />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={onRemove}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {field.type !== "checkbox" && (
          <div>
            <Label className="mb-1.5 text-xs">Placeholder</Label>
            <Input
              value={field.placeholder || ""}
              onChange={(e) => update({ placeholder: e.target.value })}
              placeholder="Texto de exemplo"
            />
          </div>
        )}
        <div className="flex items-center gap-2 pt-5">
          <Checkbox
            id={`required-${field.id}`}
            checked={field.required}
            onCheckedChange={(checked) =>
              update({ required: checked === true })
            }
          />
          <Label htmlFor={`required-${field.id}`} className="text-xs">
            Campo obrigatório
          </Label>
        </div>
      </div>

      {field.type === "select" && (
        <div>
          <Label className="mb-1.5 text-xs">
            Opções (uma por linha)
          </Label>
          <textarea
            className="border-input min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm"
            value={(field.options || []).join("\n")}
            onChange={(e) =>
              update({
                options: e.target.value
                  .split("\n")
                  .filter((o) => o.trim() !== ""),
              })
            }
            placeholder={"Opção 1\nOpção 2\nOpção 3"}
          />
        </div>
      )}
    </div>
  );
}
