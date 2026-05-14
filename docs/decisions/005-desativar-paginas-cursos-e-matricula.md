# 005 — Desativar páginas de cursos e matrícula; home como funil de captura

**Data:** 2026-05-14
**Status:** aceito

## Contexto

A operação da EdumaisTec passou a tratar a venda como consultiva: o lead chega pelo formulário, um consultor faz a análise gratuita e conduz o fechamento por WhatsApp. As páginas `/cursos`, `/cursos/[slug]` e `/matricula` (auto-matrícula) deixaram de fazer sentido nesse fluxo — elas distraíam o lead do CTA principal (formulário + apresentação do "como funciona") e prometiam um catálogo navegável que não é mais o caminho preferido de conversão.

## Decisão

A home foi reposicionada como **funil único de captura**, com foco no formulário (VSL hero) e na seção "como funciona" (CompetencyModel + página `/certificacao-por-competencia` no menu).

Mudanças:

1. **Redirects no `next.config.ts`** — `/cursos`, `/cursos/:path*`, `/matricula` e `/matricula/:path*` redirecionam para `/#form-lead` (âncora do formulário na home). Redirects marcados como `permanent: false` (302) para permitir reversão futura sem efeito persistente em caches/SEO.
2. **Arquivos das rotas mantidos** — `src/app/cursos/`, `src/app/matricula/` e seus componentes/APIs continuam no repositório. O redirect intercepta antes do roteamento, então o código fica como fallback caso a estratégia mude.
3. **Header** — Removido botão "Matricule-se" (desktop e mobile) e item "Cursos" do `NAV_LINKS`. Restaram: "Como Funciona", "Contato" e o modal "Já sou aluno".
4. **VslHero** — Removido o CTA "Ver cursos disponíveis". A conversão acontece no formulário ao lado do texto (no desktop) ou logo abaixo (no mobile).
5. **Home (`src/app/page.tsx`)** — Removidas as seções `CategoriesGrid` (grid de áreas técnicas) e `CtaBanner` (banner final que apontava pra `/cursos`). Fluxo passa a ser: VSL+Form → Como Funciona → Vantagens → Depoimentos → MEC → FAQ → Contato.
6. **Footer** — Removida a coluna "Cursos" inteira. Grid passou de 4 colunas para 3.
7. **ExitIntentPopup** — Os botões finais que apontavam pra `/cursos` foram redirecionados: no estado "qualified", aponta pra `#form-lead`; no "not_qualified", aponta pro WhatsApp. Mantém o popup funcional como conversor.
8. **Sitemap** — Removidas as entradas `/cursos`, `/cursos/[slug]` e `/matricula`. Adicionada `/certificacao-por-competencia`.

## Alternativas Consideradas

- **Retornar 404 nas rotas desativadas**: rejeitado. Quebraria links indexados no Google sem benefício e perderia leads que chegassem por links antigos.
- **Apagar fisicamente os arquivos das rotas**: rejeitado nesta etapa. Reversão fica fácil mantendo o código; o custo de manutenção é baixo.
- **Manter os botões apontando para o WhatsApp**: rejeitado para o fluxo principal (home/header). O objetivo é qualificar o lead via formulário antes de envolver o atendimento humano. No exit popup (que é o último recurso), o WhatsApp continua sendo o CTA do estado "not qualified".

## Consequências

**Positivas:**
- Home com foco único: captura via formulário.
- Reduz fricção e decisão paralela do lead (sem catálogo).
- Funil agora 100% guiado pelo time comercial após análise.

**Negativas / a monitorar:**
- Perda de tráfego orgânico de páginas de curso (slugs específicos). Aceitável dado o reposicionamento.
- Anúncios e materiais externos que apontem para `/cursos` continuam funcionando (redirect 302), mas o tracking deve ser revisado para evitar atribuição confusa.
- Se a estratégia mudar e o catálogo voltar, basta remover os redirects do `next.config.ts` — o código das páginas está preservado.
