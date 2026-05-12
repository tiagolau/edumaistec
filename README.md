# EdumaisTec — Site Institucional

Site institucional da EdumaisTec construído com Next.js 16, Prisma, Supabase e shadcn/ui.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui (Radix UI)
- **Banco de dados**: PostgreSQL (Supabase) via Prisma
- **Storage**: Supabase Storage (banners de Landing Pages)
- **Deploy**: Vercel

## Configuração

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha os valores:

```bash
cp .env.example .env.local
```

Variáveis necessárias:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL (Supabase) |
| `DIRECT_URL` | Mesma connection string (usado pelo Prisma para migrations) |
| `EDUNO_API_BASE_URL` | URL da API Eduno EAD |
| `EDUNO_API_TOKEN` | Token de autenticação Eduno |
| `EDUNO_SELLER_CPF` | CPF do vendedor Eduno |
| `EDUNO_CAMPAIGN_ID` | ID da campanha Eduno |
| `EDUNO_POLO_CODE` | Código do polo Eduno |
| `NEXT_PUBLIC_USE_MOCK_DATA` | `true` para dados mockados, `false` para API real |
| `NEXT_PUBLIC_SITE_URL` | URL do site (ex: `http://localhost:3000`) |
| `CRON_SECRET` | Secret para proteção dos cron jobs |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key do Supabase (para Storage) |

### 3. Configurar banco de dados

```bash
npx prisma db push      # Aplicar schema ao banco
npx prisma generate      # Gerar Prisma Client
```

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | Lint com ESLint |
| `npm run db:push` | Aplicar schema Prisma ao banco |
| `npm run db:migrate` | Criar migration Prisma |
| `npm run db:seed` | Popular banco com dados iniciais |
| `npm run db:studio` | Abrir Prisma Studio (GUI do banco) |

---

## Gerador de Landing Pages

Sistema para gestores de tráfego criarem landing pages com formulários customizáveis.

### Funcionalidades

- Upload de banner (imagem) via Supabase Storage
- Builder de campos de formulário (texto, e-mail, telefone, select, checkbox)
- Redirect automático após envio do formulário
- Disparo de webhook (POST) com os dados do formulário
- Painel admin para gerenciar LPs e ver submissions
- Páginas públicas com Server Components (SEO otimizado)

### Acesso

O admin é acessado via link com token:

```
https://seudominio.com/admin?token=SEU_TOKEN_AQUI
```

As landing pages ficam em:

```
https://seudominio.com/lp/slug-da-campanha
```

### Criar um workspace

Cada gestor de tráfego recebe um workspace com um token de acesso. Para criar:

```bash
npx tsx --env-file=.env.local scripts/create-workspace.ts
```

O script imprime o token e a URL de acesso ao admin.

### Arquitetura

#### Tabelas (Prisma)

| Tabela | Descrição |
|--------|-----------|
| `lp_workspaces` | Workspaces dos gestores (token de acesso) |
| `landing_pages` | Configurações das LPs (banner, campos, redirect, webhook) |
| `lp_submissions` | Dados enviados pelos visitantes |

#### API Routes

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `GET` | `/api/lp` | Token | Listar LPs do workspace |
| `POST` | `/api/lp` | Token | Criar nova LP |
| `GET` | `/api/lp/[id]` | Token | Detalhes de uma LP |
| `PUT` | `/api/lp/[id]` | Token | Atualizar LP |
| `DELETE` | `/api/lp/[id]` | Token | Deletar LP |
| `GET` | `/api/lp/[id]/submissions` | Token | Listar submissions (paginado) |
| `POST` | `/api/lp/submit` | Publico | Submissão do formulário |
| `POST` | `/api/lp/upload` | Token | Upload de banner |

A autenticação das rotas protegidas é feita via header `x-workspace-token`.

#### Fluxo de submissão

1. Visitante preenche o formulário na LP pública (`/lp/[slug]`)
2. Frontend faz `POST /api/lp/submit` com os dados
3. Backend valida os campos obrigatórios, salva no banco
4. Se configurado, dispara webhook (fire-and-forget) com os dados
5. Retorna URL de redirect para o frontend
6. Frontend redireciona o visitante

#### Webhook

Quando configurado, um `POST` é enviado para a URL de webhook com o seguinte payload:

```json
{
  "event": "form_submission",
  "timestamp": "2026-02-24T12:00:00.000Z",
  "data": {
    "nome": "João Silva",
    "email": "joao@email.com",
    "telefone": "(11) 99999-9999"
  }
}
```

### Supabase Storage

O bucket `lp-banners` deve existir no Supabase Storage com acesso público. Para criá-lo manualmente, vá em Supabase Dashboard > Storage > New Bucket.

Configuração do bucket:
- **Nome**: `lp-banners`
- **Público**: Sim
- **Tamanho máximo**: 5MB
- **Tipos permitidos**: `image/jpeg`, `image/png`, `image/webp`

---

## Estrutura do Projeto

```
src/
├── app/                          # Rotas e páginas (App Router)
│   ├── admin/                    # Painel admin do gerador de LPs
│   ├── lp/[slug]/                # Landing pages públicas
│   ├── api/
│   │   ├── lp/                   # API do gerador de LPs
│   │   ├── contato/              # API de contato
│   │   ├── cursos/               # API de cursos
│   │   ├── matricula/            # API de matrícula
│   │   ├── proposta/             # API de proposta
│   │   └── sync/                 # Sync com Eduno
│   ├── cursos/                   # Catálogo de cursos
│   ├── contato/                  # Página de contato
│   ├── matricula/                # Fluxo de matrícula
│   └── proposta/                 # Proposta comercial
├── components/
│   ├── ui/                       # Componentes shadcn/ui
│   ├── lp/                       # Componentes do gerador de LPs
│   │   ├── admin/                # Componentes do painel admin
│   │   └── public/               # Componentes da LP pública
│   ├── contato/                  # Formulário de contato
│   ├── cursos/                   # Listagem de cursos
│   ├── matricula/                # Steps da matrícula
│   ├── home/                     # Seções da home
│   ├── layout/                   # Header, footer, nav
│   └── shared/                   # Componentes compartilhados
├── lib/
│   ├── db.ts                     # Prisma client singleton
│   ├── utils.ts                  # Utilitários (cn)
│   ├── masks.ts                  # Máscaras (CPF, telefone, CEP)
│   ├── constants.ts              # Constantes do site
│   ├── lp/                       # Libs do gerador de LPs
│   ├── supabase/                 # Client Supabase Storage
│   ├── validators/               # Schemas Zod
│   ├── services/                 # Lógica de negócio
│   └── eduno/                    # Integração API Eduno
├── types/                        # Types TypeScript
└── generated/                    # Prisma Client gerado
```

## Deploy

O projeto está configurado na Vercel com deploy automático a cada push no branch `main`.

Variáveis de ambiente devem ser configuradas no Vercel Dashboard > Project Settings > Environment Variables.
