import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type HeroContent = {
  badge: string;
  title_line1: string;
  title_line2: string;
  subtitle: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
  address: string;
  image_url: string;
};

export type StoryContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  paragraph1: string;
  paragraph2: string;
  cta_label: string;
  cta_href: string;
  stat1_n: string; stat1_l: string;
  stat2_n: string; stat2_l: string;
  stat3_n: string; stat3_l: string;
};

export type PromoContent = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  description: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
};

export type CollectionsHeader = {
  eyebrow: string;
  title_line1: string;
  title_line2: string;
  description: string;
};

export type ContactInfo = {
  phone: string;
  phone_href: string;
  email: string;
  address: string;
  hours: string;
};

export type FooterInfo = {
  vat: string;
  showroom: string;
  address: string;
};

export type Service = {
  id: string;
  sort_order: number;
  icon: string;
  label: string;
  description: string;
};

export type Collection = {
  id: string;
  sort_order: number;
  title: string;
  description: string;
  image_url: string;
  span: string;
  cta_href: string;
  slug?: string | null;
};

export type CollectionImage = {
  id: string;
  collection_id: string;
  image_url: string;
  alt: string;
  sort_order: number;
};

export function collectionHref(c: Pick<Collection, "slug" | "cta_href">) {
  if (c.slug) return `/collezioni/${c.slug}`;
  return c.cta_href || "#contatti";
}

export async function fetchCollectionBySlug(slug: string): Promise<{ collection: Collection; images: CollectionImage[] } | null> {
  const { data: col } = await supabase.from("collections").select("*").eq("slug", slug).maybeSingle();
  if (!col) return null;
  const { data: imgs } = await supabase
    .from("collection_images" as any)
    .select("*")
    .eq("collection_id", (col as any).id)
    .order("sort_order");
  return { collection: col as any, images: (imgs as any) || [] };
}

export async function fetchCollectionImages(collectionId: string): Promise<CollectionImage[]> {
  const { data } = await supabase
    .from("collection_images" as any)
    .select("*")
    .eq("collection_id", collectionId)
    .order("sort_order");
  return (data as any) || [];
}

export type SiteData = {
  hero: HeroContent;
  story: StoryContent;
  promo: PromoContent;
  collections_header: CollectionsHeader;
  contact: ContactInfo;
  footer: FooterInfo;
  services: Service[];
  collections: Collection[];
};

const SiteDataContext = createContext<SiteData | null>(null);

export const SiteDataProvider = ({ initial, children }: { initial: SiteData; children: ReactNode }) => {
  const [data, setData] = useState<SiteData>(initial);

  useEffect(() => {
    fetchSiteData().then((d) => d && setData(d));
  }, []);

  return <SiteDataContext.Provider value={data}>{children}</SiteDataContext.Provider>;
};

export const useSiteData = () => {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider");
  return ctx;
};

export async function fetchSiteData(): Promise<SiteData | null> {
  try {
    const [content, services, collections] = await Promise.all([
      supabase.from("site_content").select("*"),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("collections").select("*").order("sort_order"),
    ]);

    const byKey: Record<string, any> = {};
    (content.data || []).forEach((r: any) => { byKey[r.key] = r.value; });

    return {
      hero: { ...DEFAULTS.hero, ...(byKey.hero || {}) },
      story: { ...DEFAULTS.story, ...(byKey.story || {}) },
      promo: { ...DEFAULTS.promo, ...(byKey.promo || {}) },
      collections_header: { ...DEFAULTS.collections_header, ...(byKey.collections_header || {}) },
      contact: { ...DEFAULTS.contact, ...(byKey.contact || {}) },
      footer: { ...DEFAULTS.footer, ...(byKey.footer || {}) },
      services: (services.data as any) || DEFAULTS.services,
      collections: (collections.data as any) || DEFAULTS.collections,
    };
  } catch (e) {
    console.error("fetchSiteData", e);
    return null;
  }
}

export const DEFAULTS: SiteData = {
  hero: {
    badge: "Dal cuore della Puglia · Made in Italy",
    title_line1: "La tua casa,",
    title_line2: "su misura da oltre vent'anni.",
    subtitle: "Cucine, camere, living e armadi disegnati per la tua vita. Tradizione artigiana, design contemporaneo, assistenza completa dal progetto al montaggio.",
    cta_primary_label: "Prenota un appuntamento",
    cta_primary_href: "#prenota",
    cta_secondary_label: "Scopri le collezioni",
    cta_secondary_href: "#collezioni",
    address: "Via Roma 61/63 · San Giorgio Ionico (TA)",
    image_url: "",
  },

  story: {
    eyebrow: "La nostra storia",
    title_line1: "Tradizione, design,",
    title_line2: "passione pugliese.",
    paragraph1: "Franchini Arredamenti nasce dalla collaborazione con Stilcucine, azienda leader che da sempre pone al centro la soddisfazione del cliente, progettando e costruendo cucine su misura.",
    paragraph2: "Siamo il marchio di supporto per l'arredamento completo della casa: dalla cucina alla camera, dal living al guardaroba. Un unico interlocutore, un unico progetto, un risultato armonioso.",
    cta_label: "Vieni a trovarci in showroom",
    cta_href: "#contatti",
    stat1_n: "20+", stat1_l: "Anni di esperienza",
    stat2_n: "1000+", stat2_l: "Case arredate",
    stat3_n: "100%", stat3_l: "Made in Italy",
  },
  promo: {
    eyebrow: "Promozione attiva",
    title_line1: "Le Fablier",
    title_line2: "Al Primo Sguardo.",
    description: "Scopri le collezioni Le Fablier in promozione esclusiva nel nostro showroom di San Giorgio Ionico. Camere da letto, armadi e living dell'iconico marchio italiano, a condizioni dedicate.",
    cta_primary_label: "Prenota una visita",
    cta_primary_href: "#prenota",
    cta_secondary_label: "Scrivici ora",
    cta_secondary_href: "#prenota",
  },

  collections_header: {
    eyebrow: "Le nostre collezioni",
    title_line1: "Ogni stanza, una storia",
    title_line2: "da raccontare.",
    description: "Selezioniamo i migliori marchi italiani — Le Fablier, Stilcucine, Fimar — e li abbiniamo a soluzioni su misura per dare vita ad ambienti unici.",
  },
  contact: {
    phone: "099 22 33 295",
    phone_href: "tel:+390992233295",
    email: "info@franchiniarredamenti.it",
    address: "Via Roma 61/63, 74027 San Giorgio Ionico (TA)",
    hours: "Lun-Sab: 9:00-13:00 / 16:00-20:00",
  },
  footer: {
    vat: "P. Iva",
    showroom: "San Giorgio Ionico · TA",
    address: "Showroom Via Roma 61/63, 74027 San Giorgio Ionico (TA)",
  },
  services: [],
  collections: [],
};
