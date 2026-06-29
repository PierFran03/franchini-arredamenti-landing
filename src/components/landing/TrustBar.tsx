import * as Icons from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

export const TrustBar = () => {
  const { services } = useSiteData();
  const items = services.length ? services : [
    { id: "1", sort_order: 1, icon: "Compass", label: "Progettazione", description: "Studio personalizzato dei tuoi spazi" },
    { id: "2", sort_order: 2, icon: "Truck", label: "Trasporto", description: "Consegna puntuale in tutta la Puglia" },
    { id: "3", sort_order: 3, icon: "Wrench", label: "Montaggio", description: "Installazione professionale e curata" },
    { id: "4", sort_order: 4, icon: "Headphones", label: "Assistenza", description: "Supporto post-vendita garantito" },
  ];

  return (
    <section id="servizi" className="border-y border-border bg-secondary/50 py-14" aria-label="I nostri servizi">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {items.map((s) => {
            const Icon = (Icons as any)[s.icon] || Icons.Compass;
            return (
              <div key={s.id} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-walnut text-brand-cream">
                  <Icon className="h-6 w-6" strokeWidth={1.4} />
                </div>
                <div className="font-display text-2xl text-foreground">{s.label}</div>
                <p className="mt-1 max-w-[200px] text-sm text-muted-foreground">{s.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
