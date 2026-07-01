import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowLeft, CalendarCheck, Menu, X } from "lucide-react";

import logo from "@/assets/logo-franchini.svg";

const navItems = [
  { label: "Collezioni", href: "#collezioni" },
  { label: "Servizi", href: "#servizi" },
  { label: "Storia", href: "#storia" },
  { label: "Contatti", href: "#contatti" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const homeHref = (href: string) => (isHome ? href : `/${href}`);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-elegant ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border shadow-soft"
            : "bg-transparent"
        }`}
      >
        <div className={`container mx-auto flex items-center justify-between px-4 transition-elegant ${scrolled ? "h-20" : "h-28"}`}>
          <a href={isHome ? "#top" : "/"} className="flex items-center gap-3" aria-label="Franchini Arredamenti — Home">
            {!isHome && (
              <ArrowLeft className="h-5 w-5 text-brand-cream/90 transition-smooth hover:text-brand-brass" />
            )}
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
                href={homeHref(item.href)}
                className={`text-sm tracking-wide transition-smooth hover:text-brand-brass ${
                  scrolled ? "text-foreground/80" : "text-brand-cream/90"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={homeHref("#prenota")}
              className="inline-flex items-center gap-2 rounded-sm bg-brand-brass px-3 py-2 text-xs font-medium text-accent-foreground shadow-brass transition-smooth hover:bg-brand-brass-light sm:px-4 sm:py-2.5 sm:text-sm"
            >
              <CalendarCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Prenota appuntamento</span>
              <span className="sm:hidden">Prenota</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex items-center justify-center rounded-sm p-2 lg:hidden"
              aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            >
              {mobileOpen ? (
                <X className={`h-6 w-6 ${scrolled ? "text-foreground" : "text-brand-cream"}`} />
              ) : (
                <Menu className={`h-6 w-6 ${scrolled ? "text-foreground" : "text-brand-cream"}`} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-background/98 backdrop-blur-lg pt-24 px-6 pb-8 flex flex-col gap-6 lg:hidden">
          <nav className="flex flex-col gap-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={homeHref(item.href)}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-display text-foreground/90 transition-smooth hover:text-brand-brass"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto">
            <a
              href={homeHref("#prenota")}
              onClick={() => setMobileOpen(false)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-brand-brass px-6 py-3 text-sm font-medium uppercase tracking-widest text-accent-foreground shadow-brass transition-smooth hover:bg-brand-brass-light"
            >
              <CalendarCheck className="h-4 w-4" />
              Prenota appuntamento
            </a>
          </div>
        </div>
      )}
    </>
  );
};
