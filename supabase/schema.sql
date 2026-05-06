-- =====================================================================
-- Castelo Hernani Vallim Nº 123 — Schema completo (Fase 2 + Fase 3)
--
-- COMO EXECUTAR:
--   1. Abra o painel do Supabase do projeto.
--   2. Vá em "SQL Editor" (ícone </> no menu lateral).
--   3. Crie um New Query, cole TODO o conteúdo deste arquivo, clique em Run.
--   4. Confira na aba "Table Editor" se as 4 tabelas foram criadas
--      (posts, post_images, events, contacts).
--   5. Confira em "Storage" se os buckets `covers` e `gallery` aparecem.
--
-- PRÓXIMO PASSO (depois de rodar este script):
--   Em "Authentication > Providers", DESATIVE "Enable email signups"
--   para que só usuários criados manualmente consigam logar.
--   Depois vá em "Authentication > Users" e crie o admin (e-mail + senha).
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1) Tabelas
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS posts (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  title        TEXT         NOT NULL,
  slug         TEXT         NOT NULL UNIQUE,
  content      TEXT         NOT NULL,
  category     TEXT         NOT NULL
                            CHECK (category IN ('reuniao','entretenimento','filantropia','cerimonia')),
  cover_image  TEXT,
  published    BOOLEAN      NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS post_images (
  id             UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id        UUID         NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  image_url      TEXT         NOT NULL,
  display_order  INT          NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id           UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT         NOT NULL,
  date         DATE         NOT NULL,
  time         TIME,
  description  TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id          UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT         NOT NULL,
  email       TEXT,
  message     TEXT         NOT NULL,
  read        BOOLEAN      NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at  ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category    ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_published   ON posts(published);
CREATE INDEX IF NOT EXISTS idx_post_images_post  ON post_images(post_id, display_order);
CREATE INDEX IF NOT EXISTS idx_events_date       ON events(date);
CREATE INDEX IF NOT EXISTS idx_contacts_read     ON contacts(read, created_at DESC);


-- ---------------------------------------------------------------------
-- 2) Trigger para manter posts.updated_at
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS posts_set_updated_at ON posts;
CREATE TRIGGER posts_set_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at_column();


-- ---------------------------------------------------------------------
-- 3) Row Level Security (RLS)
-- ---------------------------------------------------------------------

ALTER TABLE posts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_images  ENABLE ROW LEVEL SECURITY;
ALTER TABLE events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts     ENABLE ROW LEVEL SECURITY;

-- POSTS: leitura pública (só publicados); escrita só autenticado.
DROP POLICY IF EXISTS "posts_public_read"        ON posts;
DROP POLICY IF EXISTS "posts_authenticated_all"  ON posts;

CREATE POLICY "posts_public_read" ON posts
  FOR SELECT USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "posts_authenticated_all" ON posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- POST_IMAGES: leitura pública; escrita só autenticado.
DROP POLICY IF EXISTS "post_images_public_read"        ON post_images;
DROP POLICY IF EXISTS "post_images_authenticated_all"  ON post_images;

CREATE POLICY "post_images_public_read" ON post_images
  FOR SELECT USING (true);

CREATE POLICY "post_images_authenticated_all" ON post_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- EVENTS: leitura pública; escrita só autenticado.
DROP POLICY IF EXISTS "events_public_read"        ON events;
DROP POLICY IF EXISTS "events_authenticated_all"  ON events;

CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (true);

CREATE POLICY "events_authenticated_all" ON events
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- CONTACTS: qualquer um pode ENVIAR (INSERT); só autenticado lê/atualiza/apaga.
DROP POLICY IF EXISTS "contacts_public_insert"    ON contacts;
DROP POLICY IF EXISTS "contacts_authenticated_read" ON contacts;
DROP POLICY IF EXISTS "contacts_authenticated_update" ON contacts;
DROP POLICY IF EXISTS "contacts_authenticated_delete" ON contacts;

CREATE POLICY "contacts_public_insert" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "contacts_authenticated_read" ON contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "contacts_authenticated_update" ON contacts
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "contacts_authenticated_delete" ON contacts
  FOR DELETE TO authenticated USING (true);


-- ---------------------------------------------------------------------
-- 4) Storage: buckets `covers` e `gallery`
-- ---------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('covers', 'covers', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage (objects):
-- Leitura pública para os 2 buckets; escrita/edição/remoção só autenticado.

DROP POLICY IF EXISTS "covers_public_read"            ON storage.objects;
DROP POLICY IF EXISTS "covers_authenticated_insert"   ON storage.objects;
DROP POLICY IF EXISTS "covers_authenticated_update"   ON storage.objects;
DROP POLICY IF EXISTS "covers_authenticated_delete"   ON storage.objects;
DROP POLICY IF EXISTS "gallery_public_read"           ON storage.objects;
DROP POLICY IF EXISTS "gallery_authenticated_insert"  ON storage.objects;
DROP POLICY IF EXISTS "gallery_authenticated_update"  ON storage.objects;
DROP POLICY IF EXISTS "gallery_authenticated_delete"  ON storage.objects;

CREATE POLICY "covers_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "covers_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers');
CREATE POLICY "covers_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'covers') WITH CHECK (bucket_id = 'covers');
CREATE POLICY "covers_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'covers');

CREATE POLICY "gallery_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "gallery_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "gallery_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "gallery_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'gallery');


-- =====================================================================
-- Fim do script. Se tudo ok, você verá "Success. No rows returned".
-- =====================================================================
