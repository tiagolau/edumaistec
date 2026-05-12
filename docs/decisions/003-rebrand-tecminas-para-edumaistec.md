# 003 — Rebrand do site Tecminas para EdumaisTec

**Data:** 2026-05-12
**Status:** aceito

## Contexto

O diretório [Edumaistec/site](../../) era uma cópia byte-a-byte do site [Tecminas/site](/Users/tiagolau/Devs/Tecminas/site/) (Next.js 16 + Prisma + Supabase). Todos os textos, metadados, paleta de cores, fontes e ativos ainda apontavam para o "Colégio Técnico TecMinas", com 26 arquivos contendo strings da marca antiga. Era preciso transformá-lo no site oficial da EdumaisTec, reaproveitando a mesma estrutura (home com VSL, certificação por competência, catálogo Eduno, fluxo de matrícula, gerador de LPs, painel admin).

A LP existente em [LP/Edumaistec/App.tsx](../../../LP/Edumaistec/App.tsx) forneceu a referência visual e textual oficial da marca (cores, slogan, CNPJ, escopo de produto).

## Decisão

Foi feito um **rebrand visual + textual completo** mantendo intacta a estrutura de páginas, integrações e fluxos do Tecminas. Mudanças aplicadas:

### Identidade visual
- **Paleta** ([src/app/globals.css](../../src/app/globals.css)) trocada de "vermelho + vinho" do Tecminas para **laranja `#FF6600` + navy `#003366` + azul `#004A94` + off-white `#F8FAFC`** (idêntica à LP). Convertidas para `oklch()`. Novos tokens `--navy` e `--navy-light` adicionados.
- **Fontes** ([src/app/layout.tsx](../../src/app/layout.tsx)): Sora substituída por **Inter (corpo) + Montserrat (display)** carregadas via `next/font/google`. Variáveis `--font-inter` e `--font-montserrat` expostas no `@theme`.
- **Logo**: [public/logo.png](../../../LP/Edumaistec/public/logo.png) da LP copiado como `public/logo-light.png` e `public/logo-dark.png`.

### Branding e textos
- [src/lib/constants.ts](../../src/lib/constants.ts) reescrito: `name`, `legalName`, `slogan` ("Sua experiência vale um Diploma Oficial em mãos"), `cnpj` `63.111.623/0001-51` e contatos como **placeholders "A DEFINIR"** marcados com `TODO(EdumaisTec)`.
- Todas as 26 ocorrências da marca antiga ("TecMinas", "Coronel Fabriciano", `gerenciageraltecminas@gmail.com`, `colegiotecminasead.com.br`, `wa.me/5531981076323`) substituídas — referenciando `INSTITUTION` em vez de hardcoded sempre que possível.
- SEO/metadata (`layout.tsx`, `sitemap.ts`, `robots.ts`, JSON-LD `EducationalOrganization`) agora derivam do `INSTITUTION.domain`.
- Página `/contato` ([src/app/contato/page.tsx](../../src/app/contato/page.tsx)): iframe do Google Maps agora é dinâmico baseado em `INSTITUTION.address.full` e é ocultado enquanto o endereço estiver "A DEFINIR".

### Catálogo de cursos
- A integração com **Eduno API** foi preservada (conforme decidido com o usuário). É necessário trocar `EDUNO_API_TOKEN`, `EDUNO_SELLER_CPF`, `EDUNO_CAMPAIGN_ID` e `EDUNO_POLO_CODE` em `.env.local` pelos credenciais da EdumaisTec.

### Validação
- `npx tsc --noEmit` rodou sem erros após o rebrand.

## Alternativas Consideradas

- **Rebrand + novo design da home (estilo bold da LP)**: descartado nesta etapa para entregar um site funcional rapidamente. Pode ser feito em uma iteração posterior aplicando o visual da LP (hero com formulário, gradientes pesados, border-radius generoso).
- **Reusar o catálogo seed do Tecminas**: descartado — o usuário definiu que cursos vêm da API Eduno da EdumaisTec.
- **Reutilizar contatos do Tecminas temporariamente**: descartado em favor de placeholders "A DEFINIR" visíveis, evitando o risco de leads serem enviados para o WhatsApp/e-mail do Tecminas em produção.

## Consequências

### Pendências antes de subir em produção
- [ ] Preencher em [src/lib/constants.ts](../../src/lib/constants.ts): `address.{street,city,zip,full}`, `contacts.{whatsapp,whatsappLink,email}`, `social.{facebook,instagram}` e validar `domain`.
- [ ] Configurar `.env.local` com as credenciais Eduno da EdumaisTec e a `DATABASE_URL` do novo projeto Supabase.
- [ ] Fornecer logos otimizados para fundo escuro (footer aplica `brightness-0 invert` no atual, que apaga o detalhe laranja do "MAIS"). Substituir `public/logo-dark.png` por uma versão branca/clara nativa.
- [ ] Substituir `public/images/hero/hero-students.jpg` e `public/images/about/team-atendimento.jpg` por imagens próprias da EdumaisTec quando disponíveis.
- [ ] Re-fazer o seed do FAQ ([prisma/seed.ts](../../prisma/seed.ts)) — hoje o conteúdo ainda fala em "pós-graduação EAD" (herdado do projeto original Faculdade Global). O FAQ exibido no site usa [src/data/faq.ts](../../src/data/faq.ts), que já foi atualizado; o `seed.ts` afeta apenas o banco caso seja executado.
- [ ] Validar que o "Portal do Aluno" (`https://ava05.eduno.com.br` em [header.tsx](../../src/components/layout/header.tsx)) é o ambiente Eduno correto para os alunos EdumaisTec.

### Impactos positivos
- Estrutura, integrações e fluxos do Tecminas reaproveitados — admin de LPs, gerador de propostas, integração com Eduno, matrícula, sitemap dinâmico, JSON-LD SEO.
- Branding agora 100% derivado de `INSTITUTION` — qualquer ajuste futuro (WhatsApp, endereço) é feito em um único arquivo.
