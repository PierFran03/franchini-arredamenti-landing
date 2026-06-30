import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";

import logo from "@/assets/logo-franchini.svg";

const navItems = [
  { label: "Collezioni", href: "#collezioni" },
  { label: "Servizi", href: "#servizi" },
  { label: "Storia", href: "#storia" },
  { label: "Contatti", href: "#contatti" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-elegant ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className={`container mx-auto flex items-center justify-between px-4 transition-elegant ${scrolled ? "h-20" : "h-28"}`}>
        <a href="#top" className="flex items-center gap-3" aria-label="Franchini Arredamenti — Home">
          <img
            src={logo}
            alt="Logo Franchini Arredamenti"
            className={`w-auto object-contain transition-elegant drop-shadow-lg ${
              scrolled ? "h-14" : "h-20 brightness-0 invert"
            }`}
            width={120}
            height={80}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`text-sm tracking-wide transition-smooth hover:text-brand-brass ${
                scrolled ? "text-foreground/80" : "text-brand-cream/90"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#prenota"
          className="inline-flex items-center gap-2 rounded-sm bg-brand-brass px-4 py-2.5 text-sm font-medium text-accent-foreground shadow-brass transition-smooth hover:bg-brand-brass-light"
        >
          <CalendarCheck className="h-4 w-4" />
          <span className="hidden sm:inline">Prenota appuntamento</span>
          <span className="sm:hidden">Prenota</span>
        </a>

      </div>
    </header>
  );
};
