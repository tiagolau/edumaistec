# 002 — Migração da API Eduno para Produção

**Data:** 2026-03-18
**Status:** aceito

## Contexto

O site estava conectado ao ambiente de teste da Eduno (`teste02.genora.com.br`). A Eduno forneceu as credenciais do ambiente de produção com endpoint diferente do documentado originalmente.

## Decisão

Migrar todas as integrações para o endpoint de produção `ava05.eduno.com.br/api`:

- `.env.local` atualizado com URL e token de produção (teste mantido como comentário)
- `.env.example` atualizado com documentação dos dois ambientes
- Fallback no `client.ts` corrigido de `ead.eduno.com.br` → `ava05.eduno.com.br`
- `next.config.ts` atualizado com hostnames de imagem: `ava05.eduno.com.br`, `ead.eduno.com.br`, `teste02.genora.com.br`
- Variáveis da Vercel (produção) atualizadas: `EDUNO_API_BASE_URL`, `EDUNO_API_TOKEN`, `CRON_SECRET`
- `NEXT_PUBLIC_USE_MOCK_DATA` removida (dados mock eliminados em commit anterior)

## Alternativas Consideradas

- Manter ambientes separados (preview=teste, production=produção): descartado por simplicidade — não temos branch de staging

## Consequências

- Site agora consome dados reais de cursos/áreas da Eduno em produção
- Matrículas e propostas vão para o sistema real
- **Pendência:** `EDUNO_SELLER_CPF`, `EDUNO_CAMPAIGN_ID` e `EDUNO_POLO_CODE` ainda com valores placeholder — confirmar com o cliente antes de aceitar matrículas reais
