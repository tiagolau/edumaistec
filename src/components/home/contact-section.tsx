import { MessageCircle, Mail, Clock } from "lucide-react";
import { INSTITUTION } from "@/lib/constants";
import { SectionTitle } from "@/components/shared/section-title";
import { ContactChannelCard } from "@/components/shared/contact-channel-card";
import { AnimatedSection } from "@/components/shared/animated-section";

const channels = [
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
];

export function ContactSection() {
  return (
    <section className="py-16 sm:py-20 bg-background-alt">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionTitle
            title="Ainda com dúvidas?"
            subtitle="Fale com nossa equipe por qualquer canal. Estamos prontos para ajudar você a escolher o curso ideal."
          />
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          {channels.map((channel, i) => (
            <AnimatedSection key={i} animation="fade-up" delay={i * 100}>
              <ContactChannelCard {...channel} />
            </AnimatedSection>
          ))}
        </div>

        {/* Business hours */}
        <AnimatedSection animation="fade-in" delay={500}>
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{INSTITUTION.businessHours.weekdays}</span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
