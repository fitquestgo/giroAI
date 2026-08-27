-- Seed idempotente de exemplos ("demonstração") para a vitrine do Giro AÍ.
-- Roda quantas vezes for preciso: o índice único (source, nome_produto)
-- filtrado por is_demo evita duplicar.

insert into public.stock_items
  (nome_produto, categoria, quantidade, preco_ou_faixa, nome_empresa, cidade, is_demo, source)
values
  ('Camisetas básicas lote misto (P ao GG)', 'Roupas', 180, 'R$ 12 a R$ 18/un', 'Confecção Bela Vista', 'Americana/SP', true, 'merco-2026'),
  ('Fones de ouvido bluetooth (sobra de lançamento)', 'Eletrônicos', 95, 'R$ 35/un', 'TecnoDistribuidora Sul', 'Caxias do Sul/RS', true, 'merco-2026'),
  ('Barras de cereal integral (validade 4 meses)', 'Alimentos não perecíveis', 3200, 'R$ 1,20/un no atacado', 'Alimentos Bom Grão', 'Ribeirão Preto/SP', true, 'merco-2026'),
  ('Jaquetas jeans coleção passada', 'Roupas', 60, 'R$ 45 a R$ 60/un', 'Jeans & Cia', 'Toritama/PE', true, 'merco-2026'),
  ('Carregadores portáteis 10.000mAh', 'Eletrônicos', 140, 'R$ 28/un', 'ImportTech Brasil', 'São Paulo/SP', true, 'merco-2026'),
  ('Café torrado e moído (excesso de produção)', 'Alimentos não perecíveis', 800, 'R$ 9,90/pacote 500g', 'Torrefação Serra Alta', 'Poços de Caldas/MG', true, 'merco-2026')
on conflict (source, nome_produto) where is_demo do nothing;
