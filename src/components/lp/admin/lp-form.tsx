"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { FieldBuilder } from "./field-builder";
import { BannerUpload } from "./banner-upload";
import type { FormFieldConfig } from "@/lib/lp/types";

type LpData = {
  id?: string;
  title: string;
  slug: string;
  redirectUrl: string;
  webhookUrl: string;
  bannerUrl: string | null;
  bannerPath: string | null;
  formFields: FormFieldConfig[];
};

type Props = {
  token: string;
  initialData?: LpData;
  onSaved: () => void;
  onCancel: () => void;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LpForm({ token, initialData, onSaved, onCancel }: Props) {
  const isEditing = !!initialData?.id;

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [redirectUrl, setRedirectUrl] = useState(initialData?.redirectUrl || "");
  const [webhookUrl, setWebhookUrl] = useState(initialData?.webhookUrl || "");
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || null);
  const [bannerPath, setBannerPath] = useState(initialData?.bannerPath || null);
  const [formFields, setFormFields] = useState<FormFieldConfig[]>(
    initialData?.formFields || [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const body = {
      title,
      slug,
      redirectUrl,
      webhookUrl: webhookUrl || undefined,
      bannerUrl: bannerUrl || undefined,
      bannerPath: bannerPath || undefined,
      formFields,
    };

    try {
      const url = isEditing ? `/api/lp/${initialData.id}` : "/api/lp";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-workspace-token": token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao salvar");
        return;
      }

      onSaved();
    } catch {
      setError("Erro de conexão");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft />
        </Button>
        <h2 className="text-lg font-semibold">
          {isEditing ? "Editar Landing Page" : "Nova Landing Page"}
        </h2>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <BannerUpload
            token={token}
            bannerUrl={bannerUrl}
            onUploaded={(url, path) => {
              setBannerUrl(url);
              setBannerPath(path);
            }}
            onRemoved={() => {
              setBannerUrl(null);
              setBannerPath(null);
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title" className="mb-1.5">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!isEditing) {
                    setSlug(slugify(e.target.value));
                  }
                }}
                placeholder="Ex: Promoção Verão 2026"
                required
              />
            </div>
            <div>
              <Label htmlFor="slug" className="mb-1.5">
                Slug (URL)
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: promocao-verao-2026"
                required
              />
              {slug && (
                <p className="text-muted-foreground mt-1 text-xs">
                  URL: /lp/{slug}
                </p>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="redirectUrl" className="mb-1.5">
              URL de Redirect (após envio)
            </Label>
            <Input
              id="redirectUrl"
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://exemplo.com/obrigado"
              required
            />
          </div>
          <div>
            <Label htmlFor="webhookUrl" className="mb-1.5">
              URL de Webhook (opcional)
            </Label>
            <Input
              id="webhookUrl"
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.exemplo.com/lead"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              Um POST com os dados do formulário será enviado para esta URL.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campos do Formulário</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldBuilder fields={formFields} onChange={setFormFields} />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {isEditing ? "Salvar alterações" : "Criar Landing Page"}
        </Button>
      </div>
    </form>
  );
}
