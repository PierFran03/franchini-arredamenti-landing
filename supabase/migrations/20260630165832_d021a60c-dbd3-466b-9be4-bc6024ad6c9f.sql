
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS slug TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS collections_slug_key ON public.collections(slug) WHERE slug IS NOT NULL;

UPDATE public.collections SET slug = 'cucine' WHERE title ILIKE '%cucine%' AND slug IS NULL;
UPDATE public.collections SET slug = 'camere' WHERE title ILIKE '%camere%' AND slug IS NULL;
UPDATE public.collections SET slug = 'armadi' WHERE title ILIKE '%armadi%' AND slug IS NULL;
UPDATE public.collections SET slug = 'living' WHERE title ILIKE '%living%' AND slug IS NULL;
UPDATE public.collections SET slug = 'realizzazioni' WHERE title ILIKE '%realizz%' AND slug IS NULL;

CREATE TABLE IF NOT EXISTS public.collection_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL DEFAULT '',
  alt TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS collection_images_collection_idx ON public.collection_images(collection_id, sort_order);

GRANT SELECT ON public.collection_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collection_images TO authenticated;
GRANT ALL ON public.collection_images TO service_role;

ALTER TABLE public.collection_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read collection_images" ON public.collection_images FOR SELECT TO public USING (true);
CREATE POLICY "Admin write collection_images" ON public.collection_images FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_collection_images_updated_at BEFORE UPDATE ON public.collection_images
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
