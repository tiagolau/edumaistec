import { notFound } from "next/navigation";

// TODO(EdumaisTec): página /quem-somos desativada a pedido. Para reativar,
// restaure o conteúdo original do git history e devolva a rota ao sitemap +
// NAV_LINKS em src/lib/constants.ts.
export default function QuemSomosPage() {
  notFound();
}
