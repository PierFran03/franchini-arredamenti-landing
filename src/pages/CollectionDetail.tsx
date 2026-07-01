import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, X } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SiteDataProvider, fetchCollectionBySlug, fetchSiteData, DEFAULTS, type SiteData, type Collection, type CollectionImage } from "@/hooks/useSiteData";

const CollectionDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [images, setImages] = useState<CollectionImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [siteData, setSiteData] = useState<SiteData>(DEFAULTS);

  useEffect(() => {
    fetchSiteData().then((d) => d && setSiteData(d));
  }, []);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const res = await fetchCollectionBySlug(slug);
      if (res) {
        setCollection(res.collection);
        setImages(res.images);
        document.title = `${res.collection.title} · Franchini Arredamenti`;
      }
      setLoading(false);
    })();
  }, [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, images.length]);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-background"><div className="text-muted-foreground">Caricamento...</div></main>;
  }

  if (!collection) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
        <h1 className="font-display text-3xl">Collezione non trovata</h1>
        <Link to="/#collezioni" className="text-brand-brass underline">Torna alle collezioni</Link>
      </main>
    );
  }

  const cover = collection.image_url;
  const gallery = images.filter((i) => i.image_url);

  return (
    <SiteDataProvider initial={siteData}>
      <Header />
      <Link
        to="/#collezioni"
        className="fixed left-4 top-24 z-40 inline-flex items-center gap-2 rounded-sm bg-background/90 backdrop-blur-md border border-border px-4 py-2 text-sm font-medium text-foreground shadow-soft transition-smooth hover:text-brand-brass"
      >
        <ArrowLeft className="h-4 w-4" /> Torna alle collezioni
      </Link>
      <main className="min-h-screen bg-background">
        {/* HERO */}
        <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          {cover && (
            <img src={cover} alt={collection.title}
              className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-walnut-deep via-brand-walnut-deep/60 to-brand-walnut-deep/20" />
          <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-4 pb-16">
            <Link to="/#collezioni" className="mb-6 inline-flex w-fit items-center gap-2 text-xs uppercase tracking-[0.3em] text-brand-cream/80 hover:text-brand-brass-light transition-smooth">
              <ArrowLeft className="h-3.5 w-3.5" /> Tutte le collezioni
            </Link>
            <h1 className="font-display text-4xl text-brand-cream md:text-6xl lg:text-7xl text-balance">{collection.title}</h1>
            {collection.description && (
              <p className="mt-4 max-w-2xl text-brand-cream/85 md:text-lg">{collection.description}</p>
            )}
          </div>
        </section>

        {/* GALLERY */}
        <section className="container mx-auto px-4 py-20 md:py-28">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="text-xs uppercase tracking-[0.3em] text-brand-brass">Galleria</span>
            <h2 className="mt-4 font-display text-3xl md:text-4xl">Alcune nostre realizzazioni</h2>
          </div>

          {gallery.length === 0 ? (
            <div className="mx-auto max-w-xl rounded-sm border border-dashed border-border bg-secondary/40 p-12 text-center text-muted-foreground">
              Stiamo preparando la galleria di questa collezione. Vieni a trovarci in showroom per scoprire tutte le realizzazioni.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((img, i) => (
                <button key={img.id} type="button" onClick={() => setLightbox(i)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-sm shadow-soft transition-elegant hover:shadow-elegant">
                  <img src={img.image_url} alt={img.alt || collection.title} loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-elegant group-hover:scale-105" />
                  <div className="absolute inset-0 bg-brand-walnut-deep/0 transition-elegant group-hover:bg-brand-walnut-deep/20" />
                </button>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link to="/#prenota"
              className="inline-flex items-center gap-2 rounded-sm bg-brand-brass px-8 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground shadow-brass hover:bg-brand-brass-light transition-smooth">
              Prenota un appuntamento in showroom
            </Link>
          </div>
        </section>

        {/* LIGHTBOX */}
        {lightbox !== null && gallery[lightbox] && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-walnut-deep/95 p-4"
            onClick={() => setLightbox(null)}>
            <button type="button" onClick={() => setLightbox(null)}
              className="absolute right-6 top-6 text-brand-cream hover:text-brand-brass-light">
              <X className="h-7 w-7" />
            </button>
            <img src={gallery[lightbox].image_url} alt={gallery[lightbox].alt || collection.title}
              className="max-h-[88vh] max-w-[92vw] rounded-sm object-contain"
              onClick={(e) => e.stopPropagation()} />
          </div>
        )}
      </main>
      <Footer />
    </SiteDataProvider>
  );
};

export default CollectionDetail;
