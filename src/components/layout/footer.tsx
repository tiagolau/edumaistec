import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { INSTITUTION } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-primary-dark text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Institucional */}
          <div>
            <div className="mb-4">
              <span className="inline-flex items-center justify-center rounded-xl bg-white p-2 shadow-sm">
                <Image
                  src="/logo-dark.png"
                  alt={INSTITUTION.name}
                  width={180}
                  height={180}
                  sizes="64px"
                  className="h-14 w-14 object-contain"
                  loading="lazy"
                />
              </span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              {INSTITUTION.mecPortaria}. Certificação técnica por competência:
              sua experiência vale um diploma oficial.
            </p>
            <p className="mt-3 text-xs text-primary-foreground/60">
              CNPJ: {INSTITUTION.cnpj}
            </p>
          </div>

          {/* Cursos */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Cursos
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link href="/cursos?categoria=saude" className="transition-colors hover:text-accent">
                  Saúde
                </Link>
              </li>
              <li>
                <Link href="/cursos?categoria=infraestrutura" className="transition-colors hover:text-accent">
                  Infraestrutura
                </Link>
              </li>
              <li>
                <Link href="/cursos?categoria=tecnologia" className="transition-colors hover:text-accent">
                  Tecnologia
                </Link>
              </li>
              <li>
                <Link href="/cursos?categoria=administracao" className="transition-colors hover:text-accent">
                  Administração
                </Link>
              </li>
              <li>
                <Link href="/cursos?categoria=seguranca-do-trabalho" className="transition-colors hover:text-accent">
                  Segurança do Trabalho
                </Link>
              </li>
              <li>
                <Link href="/cursos" className="font-medium text-accent transition-colors hover:text-accent/80">
                  Ver todos os cursos →
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Atendimento
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p>{INSTITUTION.contacts.whatsapp}</p>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <span>{INSTITUTION.contacts.email}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{INSTITUTION.address.full}</span>
              </li>
            </ul>
            <div className="mt-4 text-xs text-primary-foreground/50">
              <p>{INSTITUTION.businessHours.weekdays}</p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
              Legal
            </h3>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link href="/politica-de-privacidade" className="transition-colors hover:text-accent">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/contato" className="transition-colors hover:text-accent">
                  Contato
                </Link>
              </li>
            </ul>
            {/* Redes Sociais */}
            <div className="mt-6 flex gap-3">
              <a
                href={INSTITUTION.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={INSTITUTION.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-accent"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/50">
          <p>
            © {new Date().getFullYear()} {INSTITUTION.name}. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
