import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { INSTITUTION } from "@/lib/constants";
import { MetaPixel } from "@/components/analytics/meta-pixel";
import { GtmHead, GtmNoscript } from "@/components/analytics/gtm";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800", "900"],
});

const SITE_URL = `https://${INSTITUTION.domain}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${INSTITUTION.name} — ${INSTITUTION.slogan}`,
    template: `%s | ${INSTITUTION.name}`,
  },
  description:
    "Cursos técnicos EAD com diploma registrado no SISTEC/MEC. Certificação por competência para profissionais com experiência (Lei 9.394/96 Art. 41). 100% online.",
  keywords: [
    "curso técnico",
    "curso técnico por competência",
    "certificação por competência",
    "EAD",
    "colégio técnico",
    "diploma técnico",
    "SISTEC",
    "MEC",
    "técnico em enfermagem",
    "técnico em segurança do trabalho",
    "educação a distância",
    "EdumaisTec",
  ],
  authors: [{ name: INSTITUTION.legalName }],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: INSTITUTION.name,
    title: `${INSTITUTION.name} — ${INSTITUTION.slogan}`,
    description:
      "Cursos técnicos EAD com diploma registrado no SISTEC/MEC. Certificação por competência para profissionais com experiência.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: INSTITUTION.legalName,
  alternateName: INSTITUTION.name,
  url: SITE_URL,
  logo: `${SITE_URL}/logo-light.png`,
  description:
    "Cursos técnicos EAD com diploma registrado no SISTEC/MEC. Certificação por competência para profissionais com experiência.",
  address: {
    "@type": "PostalAddress",
    streetAddress: INSTITUTION.address.street,
    addressLocality: INSTITUTION.address.city,
    addressRegion: INSTITUTION.address.state,
    postalCode: INSTITUTION.address.zip,
    addressCountry: "BR",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: `+55${INSTITUTION.contacts.whatsapp.replace(/\D/g, "")}`,
      contactType: "sales",
      availableLanguage: "Portuguese",
    },
    {
      "@type": "ContactPoint",
      telephone: `+55${INSTITUTION.contacts.whatsapp.replace(/\D/g, "")}`,
      contactType: "customer support",
      availableLanguage: "Portuguese",
    },
  ],
  sameAs: [INSTITUTION.social.facebook, INSTITUTION.social.instagram],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID ?? "";

  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <GtmHead gtmId={gtmId} />
        <MetaPixel pixelId={metaPixelId} />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <GtmNoscript gtmId={gtmId} />
        {children}
      </body>
    </html>
  );
}
