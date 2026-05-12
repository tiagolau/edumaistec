"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";

type Props = {
  token: string;
  bannerUrl: string | null;
  onUploaded: (url: string, path: string) => void;
  onRemoved: () => void;
};

export function BannerUpload({ token, bannerUrl, onUploaded, onRemoved }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/lp/upload", {
        method: "POST",
        headers: { "x-workspace-token": token },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erro ao fazer upload");
        return;
      }

      const { url, path } = await res.json();
      onUploaded(url, path);
    } catch {
      alert("Erro ao fazer upload do banner");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  if (bannerUrl) {
    return (
      <div className="relative overflow-hidden rounded-lg border">
        <Image
          src={bannerUrl}
          alt="Banner"
          width={800}
          height={400}
          className="h-48 w-full object-cover"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon-xs"
          className="absolute top-2 right-2"
          onClick={onRemoved}
        >
          <X />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 transition-colors ${
        dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {uploading ? (
        <Loader2 className="text-muted-foreground size-8 animate-spin" />
      ) : (
        <Upload className="text-muted-foreground size-8" />
      )}
      <p className="text-muted-foreground text-sm">
        {uploading
          ? "Enviando..."
          : "Arraste uma imagem ou clique para selecionar"}
      </p>
      <p className="text-muted-foreground text-xs">
        JPEG, PNG ou WebP. Máximo 5MB.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        Selecionar arquivo
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
