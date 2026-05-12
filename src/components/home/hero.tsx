import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, CreditCard, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MecBadge } from "@/components/shared/mec-badge";
import { SearchBar } from "./search-bar";
import { INSTITUTION } from "@/lib/constants";

const trustBadges = [
  { icon: BookOpen, label: "Cursos técnicos por competência" },
  { icon: CreditCard, label: "12x sem juros" },
  { icon: ShieldCheck, label: "Certificado SISTEC/MEC" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light">
      {/* Background pattern — layered geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-accent/[0.07]" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-white/[0.04]" />
        <div className="absolute right-1/3 top-1/4 h-2 w-2 rounded-full bg-accent/30 animate-pulse-soft" />
        <div className="absolute left-1/4 bottom-1/3 h-1.5 w-1.5 rounded-full bg-white/20 animate-pulse-soft [animation-delay:1.5s]" />
        <div className="absolute right-1/4 bottom-1/4 h-1 w-1 rounded-full bg-accent/20 animate-pulse-soft [animation-delay:3s]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — Content */}
          <div className="animate-fade-up">
            <MecBadge className="mb-6" />

            <h1 className="max-w-xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-[3.4rem] xl:leading-[1.1]">
              Transforme sua experiência em{" "}
              <span className="text-white/90">diploma técnico</span> — 100%
              online
            </h1>

            <p className="mt-5 max-w-lg text-base text-white/75 leading-relaxed sm:text-lg">
              Certificação por competência com validade nacional (SISTEC/MEC).
              Cursos técnicos EAD para quem já atua na área e quer formalizar
              sua profissão. Até 12x sem juros.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-lg">
              <SearchBar />
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent-dark px-8 text-base"
                asChild
              >
                <Link href="/cursos">
                  Ver todos os cursos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 text-base bg-transparent"
                asChild
              >
                <Link href="/quem-somos">Conheça a {INSTITUTION.name}</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 flex flex-wrap gap-4">
              {trustBadges.map((badge, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-white/60"
                >
                  <badge.icon className="h-4 w-4 text-accent/80" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Hero Image */}
          <div className="relative hidden lg:block animate-fade-in [animation-delay:300ms]">
            {/* Decorative accents behind image */}
            <div className="absolute -inset-4 rounded-3xl bg-accent/10 rotate-3" />
            <div className="absolute -inset-2 rounded-2xl bg-white/5 -rotate-2" />

            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/20">
              <Image
                src="/images/hero/hero-students.jpg"
                alt={`Estudantes da ${INSTITUTION.name} estudando em ambiente profissional moderno`}
                width={600}
                height={400}
                sizes="(max-width: 1024px) 0px, 50vw"
                className="h-auto w-full object-cover"
                priority
              />
              {/* Subtle overlay for blending */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/20 to-transparent" />
            </div>

            {/* Floating accent dots */}
            <div className="absolute -right-3 top-8 h-6 w-6 rounded-full bg-accent/40 animate-float" />
            <div className="absolute -left-4 bottom-12 h-4 w-4 rounded-full bg-white/20 animate-float [animation-delay:2s]" />
          </div>
        </div>
      </div>
    </section>
  );
}
