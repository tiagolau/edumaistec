import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { ExitIntentPopup } from "@/components/layout/exit-intent-popup";
import { VslHero } from "@/components/home/vsl-hero";
import { CompetencyModel } from "@/components/home/competency-model";
import { Advantages } from "@/components/home/advantages";
import { Testimonials } from "@/components/home/testimonials";
import { CategoriesGrid } from "@/components/home/categories-grid";
import { MecSection } from "@/components/shared/mec-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaBanner } from "@/components/home/cta-banner";
import { ContactSection } from "@/components/home/contact-section";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* 1. Hook — VSL hero with video */}
        <VslHero />
        {/* 2. Educate — how competency certification works */}
        <CompetencyModel />
        {/* 3. Reinforce — why EdumaisTec */}
        <Advantages />
        {/* 4. Trust — social proof */}
        <Testimonials />
        {/* 5. Explore — browse courses by area */}
        <CategoriesGrid />
        {/* 6. Authority — SISTEC/MEC section */}
        <MecSection />
        {/* 7. Objection handling */}
        <FaqSection />
        {/* 8. Final CTA */}
        <CtaBanner />
        {/* 9. Support channels */}
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppFab />
      <ExitIntentPopup />
    </>
  );
}
