# 004 — Banco edumaistec no Supabase self-hosted da Faculdade Global

**Data:** 2026-05-12
**Status:** aceito

## Contexto

O site rebrandeado da EdumaisTec ([003](003-rebrand-tecminas-para-edumaistec.md)) precisa de um Postgres próprio para o Prisma. O usuário pediu para reaproveitar a instância Supabase self-hosted existente em `supabase.faculdadeglobal.com.br` (VPS `<VPS_HOST>`, Contabo, Docker Swarm), criando apenas um **novo database** dentro do mesmo Postgres.

A stack já hospeda 13 services Supabase (db, kong, auth, rest, storage, realtime, supavisor, studio, meta, vector, analytics, functions, imgproxy) atrás de Traefik. O Postgres é compartilhado com Faculdade Global (site, agente-vendas, conselho, etc).

## Decisão

1. **Database e role criados** em `supabase_supabase_db`:
   - Role: `edumaistec` (LOGIN + CREATEDB)
   - Database: `edumaistec` (owner = `edumaistec`)
   - Senha gerada via `openssl rand -hex 16`

2. **Acesso externo via socat zero-downtime**: criado o service Docker Swarm `supabase-edumaistec-proxy` (imagem `alpine/socat`) que escuta na porta 5432 do host (mode=host) e reencaminha para `supabase_db:5432` na overlay network `Global`. Sem reschedule do service `supabase_supabase_db` e sem mexer na stack original — nenhum impacto nos demais serviços.

3. **Connection strings** ([.env.local](../../.env.local)):
   - `DATABASE_URL` aponta para `<VPS_HOST>:5432/edumaistec` com `connection_limit=1` para Vercel serverless.
   - `DIRECT_URL` igual, sem `connection_limit` (para `prisma migrate`).
   - `NEXT_PUBLIC_SUPABASE_URL` → `https://supabase.faculdadeglobal.com.br` (Storage via Kong).
   - `SUPABASE_SERVICE_ROLE_KEY` reaproveita a key da instância self-hosted.

## Alternativas Consideradas

- **Expor Supavisor (pooler)** na 6543: descartado. O Supavisor self-hosted está configurado para tenant único (`POOLER_TENANT_ID=1` → `POSTGRES_DB=postgres`) e exigiria registrar um tenant adicional em `_supavisor.tenants` apontando para o banco `edumaistec` — mais complexo e com risco em infra compartilhada.
- **`docker service update --publish-add 5432:5432 supabase_supabase_db`**: descartado para evitar 10-30s de indisponibilidade do Postgres principal durante o reschedule (afetaria todos os outros stacks que dependem dele).
- **Nova instância Supabase em `supabase.edumaistec.com.br`**: descartado porque o usuário optou explicitamente por reutilizar a instância existente.
- **Supabase Cloud (novo projeto)**: descartado pelo mesmo motivo.

## Consequências

### Funcionando
- Postgres acessível em `tcp://<VPS_HOST>:5432` como `edumaistec/edumaistec`, validado externamente (`SELECT current_user, current_database()` retorna `edumaistec | edumaistec`).
- Prisma do Vercel pode conectar sem mexer na stack Supabase compartilhada.

### Pendências e riscos
- [ ] **Sem TLS no Postgres**: o `supabase_db` self-hosted padrão não tem SSL habilitado, então a connection string usa TCP plain. Tráfego entre Vercel e VPS não é criptografado. Para produção: habilitar `ssl=on` no Postgres (custom `postgresql.conf` + certificados) ou colocar um stunnel/HAProxy TLS na frente.
- [ ] **Service `supabase-edumaistec-proxy` não está versionado**: foi criado direto via `docker service create`. Se a stack for redeployada via Portainer/compose, sobreviverá (é um service separado), mas idealmente deve ser adicionado ao YAML da stack ou versionado em um manifesto próprio.
- [ ] **`SUPABASE_SERVICE_ROLE_KEY` é global**: dá acesso a TODA a instância (incluindo dados da Faculdade Global). Para usar Storage com isolamento real, criar bucket `edumaistec-lp-banners` e aplicar RLS por bucket.
- [ ] **Backup**: o banco `edumaistec` herda o backup do volume Postgres da Faculdade Global. Confirmar se a rotina de backup atual cobre todos os databases (`pg_dumpall` cobre, `pg_dump postgres` não).
- [ ] **DNS/firewall**: a porta 5432 da VPS agora está aberta na internet. Considerar restringir por IP (UFW/iptables) apenas aos IPs da Vercel — ou aceitar como aberto e contar com a senha forte do role.

### Comandos úteis
```bash
# Remover o proxy (caso queira desfazer)
ssh root@<VPS_HOST> 'docker service rm supabase-edumaistec-proxy'

# Remover o banco e o role
ssh root@<VPS_HOST> 'docker exec -e PGPASSWORD=<superuser-pw> $(docker ps -q --filter name=supabase_supabase_db) \
  psql -U supabase_admin -d postgres -c "DROP DATABASE edumaistec; DROP ROLE edumaistec;"'

# Inspecionar o proxy
ssh root@<VPS_HOST> 'docker service ps supabase-edumaistec-proxy'
```
