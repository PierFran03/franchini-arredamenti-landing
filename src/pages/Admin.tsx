import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { fetchSiteData, DEFAULTS, SiteData, Collection, Service, CollectionImage, fetchCollectionImages } from "@/hooks/useSiteData";
import { uploadSiteImage } from "@/lib/storage";
import { LogOut, Save, Upload, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import logo from "@/assets/logo-franchini.svg";
import { ClosuresManager } from "@/components/admin/ClosuresManager";

const Field = ({ label, value, onChange, textarea = false }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean;
}) => (
  <label className="block">
    <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
    {textarea ? (
      <textarea rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-brass" />
    ) : (
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm outline-none focus:border-brand-brass" />
    )}
  </label>
);

const ImageField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadSiteImage(file);
      onChange(url);
      toast({ title: "Immagine caricata" });
    } catch (err: any) {
      toast({ title: "Errore upload", description: err.message, variant: "destructive" });
    } finally { setUploading(false); }
  };
  return (
    <div>
      <span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-16 rounded-sm object-cover border border-border" />}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-input bg-background px-3 py-2 text-xs uppercase tracking-widest hover:border-brand-brass">
          <Upload className="h-3.5 w-3.5" />
          {uploading ? "Caricamento..." : value ? "Cambia" : "Carica"}
          <input type="file" accept="image/*" className="hidden" onChange={handle} disabled={uploading} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-muted-foreground hover:text-destructive">Rimuovi</button>
        )}
      </div>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="oppure URL..."
        className="mt-2 w-full rounded-sm border border-input bg-background px-3 py-2 text-xs outline-none focus:border-brand-brass" />
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="rounded-sm border border-border bg-card p-6 shadow-soft">
    <h2 className="mb-5 font-display text-2xl">{title}</h2>
    <div className="grid gap-4 md:grid-cols-2">{children}</div>
  </section>
);

const CollectionGallery = ({ collectionId }: { collectionId: string }) => {
  const { toast } = useToast();
  const [images, setImages] = useState<CollectionImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const imgs = await fetchCollectionImages(collectionId);
      setImages(imgs);
      setLoading(false);
    })();
  }, [collectionId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const start = (images.at(-1)?.sort_order ?? -1) + 1;
      const uploaded = await Promise.all(files.map((f) => uploadSiteImage(f)));
      const rows = uploaded.map((url, i) => ({
        collection_id: collectionId, image_url: url, alt: "", sort_order: start + i,
      }));
      const { data: inserted, error } = await supabase.from("collection_images" as any).insert(rows).select();
      if (error) throw error;
      setImages((prev) => [...prev, ...((inserted as any) || [])]);
      toast({ title: `${files.length} immagine/i caricata/e` });
    } catch (err: any) {
      toast({ title: "Errore upload", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const updateAlt = async (id: string, alt: string) => {
    setImages((prev) => prev.map((i) => i.id === id ? { ...i, alt } : i));
  };
  const saveAlt = async (id: string, alt: string) => {
    await supabase.from("collection_images" as any).update({ alt }).eq("id", id);
  };
  const remove = async (id: string) => {
    if (!confirm("Eliminare questa foto?")) return;
    await supabase.from("collection_images" as any).delete().eq("id", id);
    setImages((prev) => prev.filter((i) => i.id !== id));
  };
  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const a = images[i], b = images[j];
    const newArr = [...images];
    newArr[i] = { ...b, sort_order: a.sort_order };
    newArr[j] = { ...a, sort_order: b.sort_order };
    setImages(newArr);
    await Promise.all([
      supabase.from("collection_images" as any).update({ sort_order: a.sort_order }).eq("id", b.id),
      supabase.from("collection_images" as any).update({ sort_order: b.sort_order }).eq("id", a.id),
    ]);
  };

  return (
    <div className="md:col-span-2 rounded-sm border border-dashed border-border bg-secondary/30 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-widest text-muted-foreground">Galleria realizzazioni ({images.length})</span>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-sm border border-input bg-background px-3 py-1.5 text-xs uppercase tracking-widest hover:border-brand-brass">
          <Upload className="h-3.5 w-3.5" />
          {uploading ? "Caricamento..." : "Aggiungi foto"}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {loading ? (
        <div className="text-xs text-muted-foreground">Caricamento...</div>
      ) : images.length === 0 ? (
        <div className="text-xs text-muted-foreground">Nessuna foto. Carica le immagini delle realizzazioni di questa collezione.</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.id} className="rounded-sm border border-border bg-background p-2">
              <img src={img.image_url} alt={img.alt} className="aspect-[4/3] w-full rounded-sm object-cover" />
              <input value={img.alt} placeholder="Testo alternativo"
                onChange={(e) => updateAlt(img.id, e.target.value)}
                onBlur={(e) => saveAlt(img.id, e.target.value)}
                className="mt-2 w-full rounded-sm border border-input px-2 py-1 text-xs" />
              <div className="mt-1 flex items-center justify-between">
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} className="p-1 hover:text-brand-brass"><ArrowUp className="h-3.5 w-3.5" /></button>
                  <button onClick={() => move(i, 1)} className="p-1 hover:text-brand-brass"><ArrowDown className="h-3.5 w-3.5" /></button>
                </div>
                <button onClick={() => remove(img.id)} className="p-1 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<SiteData>(DEFAULTS);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/auth", { replace: true }); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const isAdmin = (roles || []).some((r: any) => r.role === "admin");
      if (!isAdmin) {
        toast({ title: "Accesso negato", description: "Solo gli amministratori possono accedere.", variant: "destructive" });
        await supabase.auth.signOut();
        navigate("/auth", { replace: true });
        return;
      }
      setAuthorized(true);
      const d = await fetchSiteData();
      if (d) setData(d);
      setLoading(false);
    })();
  }, [navigate, toast]);

  const updateContent = (key: keyof SiteData, patch: any) => {
    setData((d) => ({ ...d, [key]: { ...(d[key] as any), ...patch } }));
  };

  const saveContent = async (key: string, value: any) => {
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value }, { onConflict: "key" });
    if (error) throw error;
  };

  const assertSaved = (error: any, label: string) => {
    if (error) {
      throw new Error(`${label}: ${error.message}`);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveContent("hero", data.hero),
        saveContent("story", data.story),
        saveContent("promo", data.promo),
        saveContent("collections_header", data.collections_header),
        saveContent("contact", data.contact),
        saveContent("footer", data.footer),
      ]);
      const serviceResults = await Promise.all(data.services.map((s) =>
        supabase.from("services").upsert({
          id: s.id, sort_order: s.sort_order, icon: s.icon, label: s.label, description: s.description,
        }, { onConflict: "id" })
      ));
      serviceResults.forEach(({ error }, index) => assertSaved(error, `Servizio ${index + 1}`));

      const collectionResults = await Promise.all(data.collections.map((c) =>
        supabase.from("collections").upsert({
          id: c.id, sort_order: c.sort_order, title: c.title, description: c.description,
          image_url: c.image_url, span: c.span, cta_href: c.cta_href, slug: c.slug || null,
        }, { onConflict: "id" })
      ));
      collectionResults.forEach(({ error }, index) => assertSaved(error, `Collezione ${index + 1}`));

      const fresh = await fetchSiteData();
      if (fresh) setData(fresh);
      toast({ title: "Salvato", description: "Modifiche pubblicate." });
    } catch (err: any) {
      toast({ title: "Errore salvataggio", description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const updateService = (i: number, patch: Partial<Service>) => {
    setData((d) => ({ ...d, services: d.services.map((s, idx) => idx === i ? { ...s, ...patch } : s) }));
  };
  const moveService = async (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.services.length) return;
    const a = { ...data.services[i], sort_order: data.services[j].sort_order };
    const b = { ...data.services[j], sort_order: data.services[i].sort_order };
    setData((d) => {
      const arr = [...d.services]; arr[i] = b; arr[j] = a;
      return { ...d, services: arr };
    });
  };
  const deleteService = async (id: string) => {
    if (!confirm("Eliminare questa voce?")) return;
    await supabase.from("services").delete().eq("id", id);
    setData((d) => ({ ...d, services: d.services.filter((s) => s.id !== id) }));
  };
  const addService = async () => {
    const { data: row, error } = await supabase.from("services").insert({
      sort_order: (data.services.at(-1)?.sort_order || 0) + 1,
      icon: "Compass", label: "Nuovo servizio", description: ""
    }).select().single();
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    setData((d) => ({ ...d, services: [...d.services, row as any] }));
  };

  const updateCollection = (i: number, patch: Partial<Collection>) => {
    setData((d) => ({ ...d, collections: d.collections.map((c, idx) => idx === i ? { ...c, ...patch } : c) }));
  };
  const moveCollection = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.collections.length) return;
    const a = { ...data.collections[i], sort_order: data.collections[j].sort_order };
    const b = { ...data.collections[j], sort_order: data.collections[i].sort_order };
    setData((d) => {
      const arr = [...d.collections]; arr[i] = b; arr[j] = a;
      return { ...d, collections: arr };
    });
  };
  const deleteCollection = async (id: string) => {
    if (!confirm("Eliminare questa collezione?")) return;
    await supabase.from("collections").delete().eq("id", id);
    setData((d) => ({ ...d, collections: d.collections.filter((c) => c.id !== id) }));
  };
  const addCollection = async () => {
    const { data: row, error } = await supabase.from("collections").insert({
      sort_order: (data.collections.at(-1)?.sort_order || 0) + 1,
      title: "Nuova collezione", description: "", image_url: "", span: "", cta_href: "#contatti"
    }).select().single();
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    setData((d) => ({ ...d, collections: [...d.collections, row as any] }));
  };

  if (loading || !authorized) {
    return <main className="flex min-h-screen items-center justify-center bg-background"><div className="text-muted-foreground">Caricamento...</div></main>;
  }

  return (
    <main className="min-h-screen bg-secondary/30 pb-24">
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="" className="h-10 w-auto" />
            <span className="font-display text-lg">Admin · Franchini</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs uppercase tracking-widest text-muted-foreground hover:text-brand-brass">Vedi sito</Link>
            <button onClick={handleSaveAll} disabled={saving}
              className="inline-flex items-center gap-2 rounded-sm bg-brand-brass px-5 py-2.5 text-xs font-medium uppercase tracking-widest text-accent-foreground shadow-brass hover:bg-brand-brass-light disabled:opacity-60">
              <Save className="h-3.5 w-3.5" />{saving ? "Salvataggio..." : "Salva tutto"}
            </button>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-sm border border-input px-3 py-2.5 text-xs uppercase tracking-widest hover:border-destructive hover:text-destructive">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto space-y-8 px-4 py-10">
        <Section title="Hero">
          <Field label="Badge superiore" value={data.hero.badge} onChange={(v) => updateContent("hero", { badge: v })} />
          <Field label="Titolo riga 1" value={data.hero.title_line1} onChange={(v) => updateContent("hero", { title_line1: v })} />
          <Field label="Titolo riga 2 (corsivo)" value={data.hero.title_line2} onChange={(v) => updateContent("hero", { title_line2: v })} />
          <Field label="Indirizzo" value={data.hero.address} onChange={(v) => updateContent("hero", { address: v })} />
          <div className="md:col-span-2"><Field label="Sottotitolo" value={data.hero.subtitle} onChange={(v) => updateContent("hero", { subtitle: v })} textarea /></div>
          <Field label="CTA primaria — testo" value={data.hero.cta_primary_label} onChange={(v) => updateContent("hero", { cta_primary_label: v })} />
          <Field label="CTA primaria — link" value={data.hero.cta_primary_href} onChange={(v) => updateContent("hero", { cta_primary_href: v })} />
          <Field label="CTA secondaria — testo" value={data.hero.cta_secondary_label} onChange={(v) => updateContent("hero", { cta_secondary_label: v })} />
          <Field label="CTA secondaria — link" value={data.hero.cta_secondary_href} onChange={(v) => updateContent("hero", { cta_secondary_href: v })} />
          <div className="md:col-span-2"><ImageField label="Immagine di sfondo" value={data.hero.image_url} onChange={(v) => updateContent("hero", { image_url: v })} /></div>
        </Section>

        <Section title="Servizi (Trust Bar)">
          <div className="md:col-span-2 space-y-3">
            {data.services.map((s, i) => (
              <div key={s.id} className="grid gap-3 rounded-sm border border-border bg-background p-4 md:grid-cols-[auto_1fr_2fr_auto]">
                <input value={s.icon} onChange={(e) => updateService(i, { icon: e.target.value })} placeholder="Icona (Compass)"
                  className="w-28 rounded-sm border border-input px-2 py-1.5 text-sm" />
                <input value={s.label} onChange={(e) => updateService(i, { label: e.target.value })} placeholder="Etichetta"
                  className="rounded-sm border border-input px-2 py-1.5 text-sm" />
                <input value={s.description} onChange={(e) => updateService(i, { description: e.target.value })} placeholder="Descrizione"
                  className="rounded-sm border border-input px-2 py-1.5 text-sm" />
                <div className="flex items-center gap-1">
                  <button onClick={() => moveService(i, -1)} className="p-1 hover:text-brand-brass"><ArrowUp className="h-4 w-4" /></button>
                  <button onClick={() => moveService(i, 1)} className="p-1 hover:text-brand-brass"><ArrowDown className="h-4 w-4" /></button>
                  <button onClick={() => deleteService(s.id)} className="p-1 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
            <button onClick={addService} className="inline-flex items-center gap-2 rounded-sm border border-dashed border-brand-brass/50 px-4 py-2 text-xs uppercase tracking-widest hover:bg-brand-brass/5">
              <Plus className="h-3.5 w-3.5" /> Aggiungi servizio
            </button>
            <p className="text-xs text-muted-foreground">Icone: usa i nomi di <a className="underline" href="https://lucide.dev/icons" target="_blank" rel="noreferrer">lucide.dev</a> (es. Compass, Truck, Wrench).</p>
          </div>
        </Section>

        <Section title="Header collezioni">
          <Field label="Eyebrow" value={data.collections_header.eyebrow} onChange={(v) => updateContent("collections_header", { eyebrow: v })} />
          <Field label="Titolo riga 1" value={data.collections_header.title_line1} onChange={(v) => updateContent("collections_header", { title_line1: v })} />
          <Field label="Titolo riga 2 (corsivo)" value={data.collections_header.title_line2} onChange={(v) => updateContent("collections_header", { title_line2: v })} />
          <div className="md:col-span-2"><Field label="Descrizione" value={data.collections_header.description} onChange={(v) => updateContent("collections_header", { description: v })} textarea /></div>
        </Section>

        <Section title="Collezioni">
          <div className="md:col-span-2 space-y-4">
            {data.collections.map((c, i) => (
              <div key={c.id} className="grid gap-3 rounded-sm border border-border bg-background p-4 md:grid-cols-2">
                <Field label="Titolo" value={c.title} onChange={(v) => updateCollection(i, { title: v })} />
                <Field label="Slug URL (es. cucine)" value={c.slug || ""} onChange={(v) => updateCollection(i, { slug: v.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-|-$/g, "") })} />
                <div className="md:col-span-2"><Field label="Descrizione" value={c.description} onChange={(v) => updateCollection(i, { description: v })} textarea /></div>
                <Field label='Classi span (es. "lg:col-span-2 lg:row-span-2")' value={c.span} onChange={(v) => updateCollection(i, { span: v })} />
                <Field label="Link CTA (fallback se slug vuoto)" value={c.cta_href} onChange={(v) => updateCollection(i, { cta_href: v })} />
                <div className="md:col-span-2 flex items-end justify-between">
                  <p className="text-xs text-muted-foreground">{c.slug ? `Pagina dedicata: /collezioni/${c.slug}` : "Senza slug — la card userà il Link CTA."}</p>
                  <div className="flex items-center gap-1">
                    <button onClick={() => moveCollection(i, -1)} className="p-2 hover:text-brand-brass"><ArrowUp className="h-4 w-4" /></button>
                    <button onClick={() => moveCollection(i, 1)} className="p-2 hover:text-brand-brass"><ArrowDown className="h-4 w-4" /></button>
                    <button onClick={() => deleteCollection(c.id)} className="p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="md:col-span-2"><ImageField label="Immagine di copertina" value={c.image_url} onChange={(v) => updateCollection(i, { image_url: v })} /></div>
                <CollectionGallery collectionId={c.id} />
              </div>
            ))}
            <button onClick={addCollection} className="inline-flex items-center gap-2 rounded-sm border border-dashed border-brand-brass/50 px-4 py-2 text-xs uppercase tracking-widest hover:bg-brand-brass/5">
              <Plus className="h-3.5 w-3.5" /> Aggiungi collezione
            </button>
          </div>
        </Section>

        <Section title="La nostra storia">
          <Field label="Eyebrow" value={data.story.eyebrow} onChange={(v) => updateContent("story", { eyebrow: v })} />
          <Field label="CTA — testo" value={data.story.cta_label} onChange={(v) => updateContent("story", { cta_label: v })} />
          <Field label="Titolo riga 1" value={data.story.title_line1} onChange={(v) => updateContent("story", { title_line1: v })} />
          <Field label="Titolo riga 2 (corsivo)" value={data.story.title_line2} onChange={(v) => updateContent("story", { title_line2: v })} />
          <Field label="CTA — link" value={data.story.cta_href} onChange={(v) => updateContent("story", { cta_href: v })} />
          <div />
          <div className="md:col-span-2"><Field label="Paragrafo 1" value={data.story.paragraph1} onChange={(v) => updateContent("story", { paragraph1: v })} textarea /></div>
          <div className="md:col-span-2"><Field label="Paragrafo 2" value={data.story.paragraph2} onChange={(v) => updateContent("story", { paragraph2: v })} textarea /></div>
          <Field label="Stat 1 — numero" value={data.story.stat1_n} onChange={(v) => updateContent("story", { stat1_n: v })} />
          <Field label="Stat 1 — label" value={data.story.stat1_l} onChange={(v) => updateContent("story", { stat1_l: v })} />
          <Field label="Stat 2 — numero" value={data.story.stat2_n} onChange={(v) => updateContent("story", { stat2_n: v })} />
          <Field label="Stat 2 — label" value={data.story.stat2_l} onChange={(v) => updateContent("story", { stat2_l: v })} />
          <Field label="Stat 3 — numero" value={data.story.stat3_n} onChange={(v) => updateContent("story", { stat3_n: v })} />
          <Field label="Stat 3 — label" value={data.story.stat3_l} onChange={(v) => updateContent("story", { stat3_l: v })} />
        </Section>

        <Section title="Promo">
          <Field label="Eyebrow" value={data.promo.eyebrow} onChange={(v) => updateContent("promo", { eyebrow: v })} />
          <div />
          <Field label="Titolo riga 1" value={data.promo.title_line1} onChange={(v) => updateContent("promo", { title_line1: v })} />
          <Field label="Titolo riga 2 (corsivo)" value={data.promo.title_line2} onChange={(v) => updateContent("promo", { title_line2: v })} />
          <div className="md:col-span-2"><Field label="Descrizione" value={data.promo.description} onChange={(v) => updateContent("promo", { description: v })} textarea /></div>
          <Field label="CTA primaria — testo" value={data.promo.cta_primary_label} onChange={(v) => updateContent("promo", { cta_primary_label: v })} />
          <Field label="CTA primaria — link" value={data.promo.cta_primary_href} onChange={(v) => updateContent("promo", { cta_primary_href: v })} />
          <Field label="CTA secondaria — testo" value={data.promo.cta_secondary_label} onChange={(v) => updateContent("promo", { cta_secondary_label: v })} />
          <Field label="CTA secondaria — link" value={data.promo.cta_secondary_href} onChange={(v) => updateContent("promo", { cta_secondary_href: v })} />
        </Section>

        <Section title="Contatti">
          <Field label="Telefono visualizzato" value={data.contact.phone} onChange={(v) => updateContent("contact", { phone: v })} />
          <Field label="Link telefono (tel:...)" value={data.contact.phone_href} onChange={(v) => updateContent("contact", { phone_href: v })} />
          <Field label="Email" value={data.contact.email} onChange={(v) => updateContent("contact", { email: v })} />
          <Field label="Indirizzo" value={data.contact.address} onChange={(v) => updateContent("contact", { address: v })} />
          <div className="md:col-span-2"><Field label="Orari (a capo permessi)" value={data.contact.hours} onChange={(v) => updateContent("contact", { hours: v })} textarea /></div>
        </Section>

        <ClosuresManager />

        <Section title="Footer">
          <Field label="P. IVA" value={data.footer.vat} onChange={(v) => updateContent("footer", { vat: v })} />
          <Field label="Showroom" value={data.footer.showroom} onChange={(v) => updateContent("footer", { showroom: v })} />
          <div className="md:col-span-2"><Field label="Indirizzo completo" value={data.footer.address} onChange={(v) => updateContent("footer", { address: v })} /></div>
        </Section>

        <div className="flex justify-end">
          <button onClick={handleSaveAll} disabled={saving}
            className="inline-flex items-center gap-2 rounded-sm bg-brand-brass px-8 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground shadow-brass hover:bg-brand-brass-light disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Salvataggio..." : "Salva tutto"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Admin;
