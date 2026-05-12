import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { PageHero } from "@/components/shared/page-hero";
import { ProposalForm } from "@/components/proposta/proposal-form";

export const metadata: Metadata = {
  title: "Gerar Proposta Comercial",
  description:
    "Gere uma proposta comercial personalizada para seus alunos. Área exclusiva para consultores da EdumaisTec.",
};

export default function PropostaPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PageHero
          title="Proposta Comercial"
          subtitle="Gere um link de proposta personalizado para enviar ao seu aluno."
          compact
        />

        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <Suspense>
              <ProposalForm />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
