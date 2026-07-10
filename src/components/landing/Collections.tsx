import { ArrowUpRight } from "lucide-react";
import cucine from "@/assets/category-cucine.jpg";
import camere from "@/assets/category-camere.jpg";
import living from "@/assets/category-living.jpg";
import armadi from "@/assets/category-armadi.jpg";
import { useSiteData, collectionHref } from "@/hooks/useSiteData";

const FALLBACK_IMAGES = [cucine, camere, armadi, living];

export const Collections = () => {
  const { collections, collections_header: h } = useSiteData();

  return (
    <section id="collezioni" className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.3em] text-brand-brass">{h.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl lg:text-6xl">
            {h.title_line1}
            <span className="italic text-brand-brass"> {h.title_line2}</span>
          </h2>
          <p className="mt-6 text-muted-foreground md:text-lg">{h.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[260px]">
          {collections.map((c, i) => (
            <a
              key={c.id}
              href={collectionHref(c)}
              className={`group relative overflow-hidden rounded-sm shadow-soft transition-elegant hover:shadow-elegant ${c.span} min-h-[280px] lg:min-h-0`}
            >
              <img
                src={c.image_url || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
                alt={c.title}
                className="absolute inset-0 h-full w-full object-cover transition-elegant group-hover:scale-105"
                loading="lazy"
                width={1024}
                height={1024}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-walnut-deep/90 via-brand-walnut-deep/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl text-brand-cream md:text-3xl">{c.title}</h3>
                    <p className="mt-2 max-w-md text-sm text-brand-cream/80">{c.description}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-brass text-accent-foreground transition-smooth group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
