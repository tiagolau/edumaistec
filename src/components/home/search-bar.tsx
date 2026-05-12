"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/cursos?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/cursos");
    }
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full overflow-hidden rounded-xl bg-white shadow-lg"
    >
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Busque seu curso técnico..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 border-0 pl-12 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 sm:h-14 sm:text-lg"
        />
      </div>
      <Button
        type="submit"
        className="m-1.5 h-auto rounded-lg bg-accent px-6 text-accent-foreground hover:bg-accent-dark sm:px-8"
      >
        Buscar
      </Button>
    </form>
  );
}
