"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  ExternalLink,
  Copy,
  Pencil,
  Trash2,
  Eye,
  Check,
} from "lucide-react";
import type { LandingPageWithCount } from "@/lib/lp/types";

type Props = {
  token: string;
  onCreateNew: () => void;
  onEdit: (lp: LandingPageWithCount) => void;
  onViewSubmissions: (lp: LandingPageWithCount) => void;
};

export function LpList({ token, onCreateNew, onEdit, onViewSubmissions }: Props) {
  const [lps, setLps] = useState<LandingPageWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLps = useCallback(async () => {
    try {
      const res = await fetch("/api/lp", {
        headers: { "x-workspace-token": token },
      });
      if (res.ok) {
        setLps(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLps();
  }, [fetchLps]);

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta landing page?")) return;
    await fetch(`/api/lp/${id}`, {
      method: "DELETE",
      headers: { "x-workspace-token": token },
    });
    setLps((prev) => prev.filter((lp) => lp.id !== id));
  }

  function copyLink(slug: string, id: string) {
    const url = `${window.location.origin}/lp/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Minhas Landing Pages</h2>
        <Button onClick={onCreateNew}>
          <Plus className="size-4" />
          Nova LP
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground py-8 text-center text-sm">
          Carregando...
        </p>
      ) : lps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4 text-sm">
              Você ainda não criou nenhuma landing page.
            </p>
            <Button onClick={onCreateNew}>
              <Plus className="size-4" />
              Criar primeira LP
            </Button>
          </CardContent>
        </Card>
      ) : (
        lps.map((lp) => (
          <Card key={lp.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {lp.title}
                <Badge variant={lp.active ? "default" : "secondary"}>
                  {lp.active ? "Ativa" : "Inativa"}
                </Badge>
              </CardTitle>
              <CardAction>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => copyLink(lp.slug, lp.id)}
                    title="Copiar link"
                  >
                    {copiedId === lp.id ? (
                      <Check className="size-3" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    asChild
                    title="Abrir LP"
                  >
                    <a
                      href={`/lp/${lp.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="size-3" />
                    </a>
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4">
                <p className="text-muted-foreground text-sm">
                  /lp/{lp.slug}
                </p>
                <p className="text-muted-foreground text-sm">
                  {lp._count.submissions} envio
                  {lp._count.submissions !== 1 && "s"}
                </p>
                <div className="ml-auto flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewSubmissions(lp)}
                  >
                    <Eye className="size-3" />
                    Submissions
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(lp)}
                  >
                    <Pencil className="size-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(lp.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
