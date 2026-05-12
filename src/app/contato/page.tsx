import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { PageHero } from "@/components/shared/page-hero";
import { ContactChannelCard } from "@/components/shared/contact-channel-card";
import { AnimatedSection } from "@/components/shared/animated-section";
import { ContactForm } from "@/components/contato/contact-form";
import { INSTITUTION } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contato",
  description: `Entre em contato com a ${INSTITUTION.name}. Atendimento via WhatsApp, e-mail ou presencialmente.`,
};

const contactChannels = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: INSTITUTION.contacts.whatsapp,
    href: INSTITUTION.contacts.whatsappLink,
    iconColor: "text-green-600",
    iconBgColor: "bg-green-50",
  },
  {
    icon: Mail,
    title: "E-mail",
    value: INSTITUTION.contacts.email,
    href: `mailto:${INSTITUTION.contacts.email}`,
    iconColor: "text-primary",
    iconBgColor: "bg-primary/10",
  },
  {
    icon: MapPin,
    title: "Endereço",
    value: INSTITUTION.address.full,
    href: `https://maps.google.com/?q=${encodeURIComponent(INSTITUTION.address.full)}`,
    iconColor: "text-accent",
    iconBgColor: "bg-accent/10",
  },
];

export default function ContatoPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <PageHero
          title="Fale Conosco"
          subtitle="Estamos aqui para ajudar. Entre em contato por qualquer um dos nossos canais de atendimento."
        />

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
              {/* Contact channels */}
              <div className="lg:col-span-2 space-y-4">
                {contactChannels.map((channel, idx) => (
                  <AnimatedSection
                    key={idx}
                    animation="fade-up"
                    delay={idx * 80}
                  >
                    <ContactChannelCard {...channel} />
                  </AnimatedSection>
                ))}

                {/* Business hours */}
                <AnimatedSection animation="fade-up" delay={350}>
                  <div className="rounded-2xl bg-background-alt p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">
                        Horário de Atendimento
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {INSTITUTION.businessHours.weekdays}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {INSTITUTION.businessHours.friday}
                    </p>
                  </div>
                </AnimatedSection>
              </div>

              {/* Contact form */}
              <div className="lg:col-span-3">
                <AnimatedSection animation="fade-up" delay={100}>
                  <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                    <h2 className="mb-1 text-xl font-semibold text-foreground">
                      Envie uma mensagem
                    </h2>
                    <p className="mb-6 text-sm text-muted-foreground">
                      Preencha o formulário abaixo e retornaremos em breve.
                    </p>
                    <ContactForm />
                  </div>
                </AnimatedSection>
              </div>
            </div>

            {/* TODO(EdumaisTec): substituir o iframe abaixo pelo embed do Google Maps
                gerado a partir do endereço oficial da sede assim que ele estiver definido. */}
            {INSTITUTION.address.full !== "A DEFINIR" && (
              <AnimatedSection animation="fade-up" delay={200}>
                <div className="mt-12 overflow-hidden rounded-2xl border border-border">
                  <iframe
                    title={`Localização ${INSTITUTION.name}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(
                      INSTITUTION.address.full,
                    )}&output=embed`}
                    className="h-64 w-full sm:h-80"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </AnimatedSection>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
