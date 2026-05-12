import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ShieldCheck,
  Users,
  BookOpen,
  Play,
} from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { PageHero } from "@/components/shared/page-hero";
import { EnrollmentForm } from "@/components/matricula/enrollment-form";

export const metadata: Metadata = {
  title: "Matrícula",
  description:
    "Realize sua matrícula na EdumaisTec. Certificação técnica por competência 100% online, com diploma registrado no SISTEC/MEC.",
};

const trustItems = [
  { icon: ShieldCheck, text: "Diploma registrado no SISTEC/MEC" },
  { icon: Users, text: "2.500+ profissionais formados" },
  { icon: BookOpen, text: "60+ cursos técnicos disponíveis" },
];

export default function MatriculaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PageHero
          title="Faça sua Matrícula"
          subtitle="Certificação por competência 100% online. Escolha seu curso e finalize em poucos minutos."
          compact
        />

        {/* Trust reinforcement strip */}
        <div className="border-b border-border bg-background-alt">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {trustItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <item.icon className="h-4 w-4 text-primary/70" />
                  <span>{item.text}</span>
                </div>
              ))}
              <Link
                href="/certificacao-por-competencia"
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
              >
                <Play className="h-3.5 w-3.5" />
                Como funciona?
              </Link>
            </div>
          </div>
        </div>

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Suspense>
              <EnrollmentForm />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
