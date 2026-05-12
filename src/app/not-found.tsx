import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-7xl font-extrabold text-primary sm:text-9xl">
          404
        </h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground sm:text-2xl">
          Página não encontrada
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          A página que você procura não existe ou foi removida.
        </p>
        <Button className="mt-8" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para o início
          </Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
