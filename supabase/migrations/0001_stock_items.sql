-- Giro AÍ — Merco 2026
-- Tabela única para a landing page: vitrine de estoque parado + cadastro.

create extension if not exists "pgcrypto";

create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  nome_produto text not null,
  categoria text not null,
  quantidade integer not null check (quantidade > 0),
  preco_ou_faixa text not null,
  nome_empresa text not null,
  cidade text,
  contato text,
  foto_url text,
  is_demo boolean not null default false,
  source text not null default 'merco-2026',
  created_at timestamptz not null default now()
);

-- Chave estável para permitir seed idempotente (upsert) sem duplicar exemplos.
create unique index if not exists stock_items_demo_slug_idx
  on public.stock_items (source, nome_produto)
  where is_demo;

create index if not exists stock_items_created_at_idx
  on public.stock_items (created_at desc);

alter table public.stock_items enable row level security;

-- Leitura pública (qualquer visitante pode ver a lista).
-- IMPORTANTE: a coluna `contato` é lida por essa mesma policy — a proteção
-- contra vazamento de contato de terceiros é feita na camada de aplicação:
-- a query de listagem (ProductList) faz `select` explícito sem `contato`.
drop policy if exists "stock_items_public_read" on public.stock_items;
create policy "stock_items_public_read"
  on public.stock_items
  for select
  to anon, authenticated
  using (true);

-- Nenhuma policy de insert/update/delete para anon/authenticated: toda
-- escrita passa pela Server Action, que usa a chave secreta (bypassa RLS)
-- somente no servidor.

-- Bucket público para as fotos enviadas no formulário.
insert into storage.buckets (id, name, public)
values ('stock-photos', 'stock-photos', true)
on conflict (id) do nothing;

drop policy if exists "stock_photos_public_read" on storage.objects;
create policy "stock_photos_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'stock-photos');

-- Sem policy de insert/update/delete em storage.objects para anon/authenticated:
-- o upload é feito server-side (Server Action) com a chave secreta.
