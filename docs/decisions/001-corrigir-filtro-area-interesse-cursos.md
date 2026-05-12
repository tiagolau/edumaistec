# 001 — Corrigir filtro por área de interesse na listagem de cursos

**Data:** 2026-02-27
**Status:** aceito

## Contexto

Ao acessar a página `/cursos` e selecionar uma área de interesse (ex: "Artes e Humanidades"), o resultado mostrava **0 cursos**. O problema afetava todas as áreas de interesse exceto "Educação", "Diversos" e "Serviços".

### Causa raiz

A tabela `areas` no Supabase continha slugs de seed desatualizados (ex: `saude-bem-estar`) que não correspondiam aos slugs gerados pela API Eduno (ex: `saude-e-bem-estar`). Além disso, os `area_id` gravados nos cursos (vindos de `/cursos/detalhado`) não correspondiam aos IDs da tabela `areas` (vindos de `/areasdeinteresse`). Resultado: **8 de 11 áreas** com slugs incompatíveis e **todos os joins** retornando dados trocados.

A API Eduno em si é 100% consistente — os nomes de área entre `/cursos` e `/areasdeinteresse` são idênticos. O problema era exclusivamente da camada de cache Supabase.

## Decisão

**Remover o Supabase como intermediário na listagem de cursos e áreas.** Tanto `getCourses()` quanto `getAreas()` agora consultam diretamente a API Eduno, que é a fonte de verdade.

- `getCourses()` → `fetchCourses()` → Eduno `/cursos`
- `getAreas()` → `fetchAreas()` → Eduno `/areasdeinteresse`
- Cache via ISR do Next.js (revalidação do fetch: 1h para cursos, 24h para áreas)
- Sync (`/api/sync`) mantido para outros usos, mas não é mais necessário para a listagem

## Alternativas Consideradas

- **Fuzzy matching entre slugs do Supabase**: implementado e validado com 100% de acerto, mas adicionava complexidade desnecessária quando a API Eduno já fornece dados consistentes
- **Corrigir dados no Supabase via sync**: resolveria pontualmente, mas o schema de IDs divergente tornaria o problema recorrente
- **Normalização de slugs no frontend**: frágil para casos como `computacao-tic` vs `computacao-e-tecnologias-da-informacao-e-comunicacao-tic`

## Consequências

- Filtro por área funciona corretamente para todas as 11 áreas
- Dados 100% confiáveis da API Eduno (fonte de verdade)
- Carregamento pode ser ~500ms mais lento na primeira requisição (cache ISR mitiga)
- Supabase continua disponível para matrícula e outras funcionalidades
- O endpoint `/api/sync` continua funcional para futura reintrodução de cache se necessário
