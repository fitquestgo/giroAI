# Giro AÍ — Landing Page (Merco 2026)

Landing page single-page, sem login: hero, como funciona, vitrine de estoque
parado (exemplos + cadastros reais) e um formulário de cadastro.

## Stack

- Next.js (App Router) + TypeScript + Tailwind, mobile-first
- Server Actions para submissão do formulário e leitura da lista
- Supabase (Postgres + Storage), sem Auth

## Rodando localmente

```bash
npm install
cp .env.local.example .env.local   # preencha com as chaves reais do seu projeto Supabase
npm run dev
```

Abra http://localhost:3000.

## Banco de dados (Supabase)

1. No dashboard do projeto, abra **SQL Editor**.
2. Rode o conteúdo de [`supabase/migrations/0001_stock_items.sql`](supabase/migrations/0001_stock_items.sql) — cria a tabela `stock_items`, habilita RLS (leitura pública, escrita só via service key) e o bucket público `stock-photos`.
3. Rode o conteúdo de [`supabase/seed.sql`](supabase/seed.sql) — insere 4-6 produtos de exemplo (`is_demo = true`). É idempotente, pode rodar de novo sem duplicar.

### Variáveis de ambiente

| Variável | Onde usar | Onde pegar |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | client + server | Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | client + server (leitura) | Project Settings → API keys (publishable) |
| `SUPABASE_SECRET_KEY` | só Server Actions | Project Settings → API keys (secret) — **nunca** expor no client |

## Segurança / decisões importantes

- RLS habilitado; não há policy de `insert`/`update`/`delete` para `anon`/`authenticated` — toda escrita passa pela Server Action (`lib/actions.ts`), que usa a chave secreta só no servidor.
- A coluna `contato` nunca é devolvida pela listagem pública: a query em `lib/stock-items.ts` faz `select` explícito das colunas, sem `contato`.
- Itens de seed (`is_demo = true`) exibem a tag "exemplo" no card, para não serem confundidos com cadastros reais.
- Upload de foto é feito server-side (Server Action) direto pro bucket `stock-photos`; o client nunca fala com o Storage diretamente.
- A página usa `export const dynamic = "force-dynamic"` para sempre refletir o cadastro mais recente sem depender de cache.

## Deploy (Vercel)

```bash
npm install -g vercel   # se ainda não tiver
vercel login
vercel                  # deploy de preview
```

Configure as 3 variáveis de ambiente acima no dashboard da Vercel (Project → Settings → Environment Variables) antes do primeiro deploy — ou rode `vercel env add <nome>` para cada uma.

Para produção: `vercel --prod`.
