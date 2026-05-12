"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { nanoid } from "nanoid";
import type { FormFieldConfig } from "@/lib/lp/types";
import { FieldEditorRow } from "./field-editor-row";

type Props = {
  fields: FormFieldConfig[];
  onChange: (fields: FormFieldConfig[]) => void;
};

export function FieldBuilder({ fields, onChange }: Props) {
  function addField() {
    const order = fields.length;
    onChange([
      ...fields,
      {
        id: nanoid(8),
        name: "",
        label: "",
        type: "text",
        placeholder: "",
        required: false,
        order,
      },
    ]);
  }

  function updateField(index: number, updated: FormFieldConfig) {
    const next = [...fields];
    next[index] = updated;
    onChange(next);
  }

  function removeField(index: number) {
    const next = fields.filter((_, i) => i !== index);
    onChange(next.map((f, i) => ({ ...f, order: i })));
  }

  function moveField(index: number, direction: "up" | "down") {
    const next = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next.map((f, i) => ({ ...f, order: i })));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Campos do Formulário</h3>
        <Button type="button" variant="outline" size="sm" onClick={addField}>
          <Plus className="size-4" />
          Adicionar campo
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-muted-foreground rounded-lg border border-dashed p-6 text-center text-sm">
          Nenhum campo adicionado. Clique em &quot;Adicionar campo&quot; para
          começar.
        </p>
      )}

      {fields.map((field, index) => (
        <FieldEditorRow
          key={field.id}
          field={field}
          onChange={(updated) => updateField(index, updated)}
          onRemove={() => removeField(index)}
          onMoveUp={() => moveField(index, "up")}
          onMoveDown={() => moveField(index, "down")}
          isFirst={index === 0}
          isLast={index === fields.length - 1}
        />
      ))}
    </div>
  );
}
