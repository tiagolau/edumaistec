"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { FormFieldConfig } from "@/lib/lp/types";

type Submission = {
  id: string;
  data: Record<string, unknown>;
  ip: string | null;
  createdAt: string;
};

type Props = {
  token: string;
  lpId: string;
  lpTitle: string;
  formFields: FormFieldConfig[];
  onBack: () => void;
};

export function SubmissionsTable({
  token,
  lpId,
  lpTitle,
  formFields,
  onBack,
}: Props) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/lp/${lpId}/submissions?page=${page}&limit=20`, {
        headers: { "x-workspace-token": token },
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } finally {
      setLoading(false);
    }
  }, [lpId, page, token]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const columns = formFields.sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Submissions</h2>
          <p className="text-muted-foreground text-sm">
            {lpTitle} — {total} envio{total !== 1 && "s"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados recebidos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Carregando...
            </p>
          ) : submissions.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center text-sm">
              Nenhuma submission recebida ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        className="px-3 py-2 text-left font-medium"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-left font-medium">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="border-b last:border-0">
                      {columns.map((col) => (
                        <td key={col.id} className="px-3 py-2">
                          {String(
                            (sub.data as Record<string, unknown>)[col.name] ??
                              "-",
                          )}
                        </td>
                      ))}
                      <td className="text-muted-foreground px-3 py-2 text-xs">
                        {new Date(sub.createdAt).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-muted-foreground text-sm">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
