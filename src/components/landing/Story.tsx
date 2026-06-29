import { ArrowRight } from "lucide-react";
import { useSiteData } from "@/hooks/useSiteData";

export const Story = () => {
  const { story } = useSiteData();
  const stats = [
    { n: story.stat1_n, l: story.stat1_l },
    { n: story.stat2_n, l: story.stat2_l },
    { n: story.stat3_n, l: story.stat3_l },
  ];
  return (
    <section id="storia" className="relative overflow-hidden bg-brand-walnut py-24 text-brand-cream md:py-32">
      <div className="container mx-auto grid gap-16 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-brand-brass-light">{story.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl text-balance md:text-5xl lg:text-6xl">
            {story.title_line1}
            <span className="italic text-brand-brass-light"> {story.title_line2}</span>
          </h2>
          <div className="mt-8 space-y-5 text-brand-cream/85 md:text-lg">
            <p>{story.paragraph1}</p>
            <p>{story.paragraph2}</p>
          </div>
          <a href={story.cta_href} className="group mt-10 inline-flex items-center gap-2 border-b border-brand-brass-light pb-2 text-sm uppercase tracking-widest text-brand-brass-light transition-smooth hover:gap-4">
            {story.cta_label}
            <ArrowRight className="h-4 w-4 transition-smooth group-hover:translate-x-1" />
          </a>
        </div>

        <div className="grid gap-px bg-brand-cream/20 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.l} className="bg-brand-walnut p-8 text-center md:p-10">
              <div className="font-display text-5xl text-brand-brass-light md:text-6xl">{s.n}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-brand-cream/70">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
