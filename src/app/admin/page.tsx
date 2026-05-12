"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LpAdminShell } from "@/components/lp/admin/lp-admin-shell";

function AdminContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-lg font-semibold">Token necessário</h1>
          <p className="text-muted-foreground text-sm">
            Acesse esta página usando o link fornecido com seu token de acesso.
          </p>
        </div>
      </div>
    );
  }

  return <LpAdminShell token={token} />;
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
