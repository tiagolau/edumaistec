"use client";

import { useState, useEffect, useCallback } from "react";
import { LpList } from "./lp-list";
import { LpForm } from "./lp-form";
import { SubmissionsTable } from "./submissions-table";
import type { FormFieldConfig, LandingPageWithCount } from "@/lib/lp/types";

type View =
  | { type: "list" }
  | { type: "create" }
  | { type: "edit"; lp: LandingPageWithCount & { formFields: FormFieldConfig[]; bannerPath: string | null } }
  | { type: "submissions"; lp: LandingPageWithCount & { formFields: FormFieldConfig[] } };

type Props = {
  token: string;
};

export function LpAdminShell({ token }: Props) {
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const [valid, setValid] = useState<boolean | null>(null);
  const [view, setView] = useState<View>({ type: "list" });
  const [listKey, setListKey] = useState(0);

  const validateToken = useCallback(async () => {
    try {
      const res = await fetch("/api/lp", {
        headers: { "x-workspace-token": token },
      });
      if (res.ok) {
        setValid(true);
        // Não temos endpoint pra pegar workspace info direto, mas podemos validar pelo sucesso
        setWorkspaceName("Workspace");
      } else {
        setValid(false);
      }
    } catch {
      setValid(false);
    }
  }, [token]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  if (valid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground text-sm">Validando acesso...</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-lg font-semibold">Acesso negado</h1>
          <p className="text-muted-foreground text-sm">
            O token de acesso é inválido ou expirou.
          </p>
        </div>
      </div>
    );
  }

  async function handleEdit(lp: LandingPageWithCount) {
    // Buscar dados completos da LP (com formFields e bannerPath)
    const res = await fetch(`/api/lp/${lp.id}`, {
      headers: { "x-workspace-token": token },
    });
    if (res.ok) {
      const full = await res.json();
      setView({ type: "edit", lp: full });
    }
  }

  function handleViewSubmissions(lp: LandingPageWithCount) {
    // Para submissions, precisamos dos formFields completos
    fetch(`/api/lp/${lp.id}`, {
      headers: { "x-workspace-token": token },
    })
      .then((res) => res.json())
      .then((full) => {
        setView({ type: "submissions", lp: full });
      });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Gerador de Landing Pages</h1>
        {workspaceName && (
          <p className="text-muted-foreground text-sm">{workspaceName}</p>
        )}
      </div>

      {view.type === "list" && (
        <LpList
          key={listKey}
          token={token}
          onCreateNew={() => setView({ type: "create" })}
          onEdit={handleEdit}
          onViewSubmissions={handleViewSubmissions}
        />
      )}

      {view.type === "create" && (
        <LpForm
          token={token}
          onSaved={() => {
            setListKey((k) => k + 1);
            setView({ type: "list" });
          }}
          onCancel={() => setView({ type: "list" })}
        />
      )}

      {view.type === "edit" && (
        <LpForm
          token={token}
          initialData={{
            id: view.lp.id,
            title: view.lp.title,
            slug: view.lp.slug,
            redirectUrl: view.lp.redirectUrl,
            webhookUrl: view.lp.webhookUrl || "",
            bannerUrl: view.lp.bannerUrl,
            bannerPath: view.lp.bannerPath,
            formFields: view.lp.formFields,
          }}
          onSaved={() => {
            setListKey((k) => k + 1);
            setView({ type: "list" });
          }}
          onCancel={() => setView({ type: "list" })}
        />
      )}

      {view.type === "submissions" && (
        <SubmissionsTable
          token={token}
          lpId={view.lp.id}
          lpTitle={view.lp.title}
          formFields={view.lp.formFields}
          onBack={() => setView({ type: "list" })}
        />
      )}
    </div>
  );
}
