import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import logo from "@/assets/logo-franchini.svg";
import { useSiteData } from "@/hooks/useSiteData";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export const Footer = () => {
  const { footer } = useSiteData();
  const { openPreferences } = useCookieConsent();
  return (
    <footer className="border-t border-brand-walnut/20 bg-brand-walnut-deep py-12 text-brand-cream/70">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Franchini Arredamenti"
              className="h-20 w-auto object-contain brightness-0 invert"
              width={120}
              height={80}
              loading="lazy"
            />
            <div className="leading-tight">
              <div className="text-xs uppercase tracking-[0.25em] text-brand-brass-light">Showroom</div>
              <div className="text-sm text-brand-cream/80">{footer.showroom}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/franchini_arredamenti"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Franchini Arredamenti"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-cream/20 text-brand-cream/80 transition-smooth hover:border-brand-brass hover:text-brand-brass-light"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/share/1CeFg7nM9Q/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook Franchini Arredamenti"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-cream/20 text-brand-cream/80 transition-smooth hover:border-brand-brass hover:text-brand-brass-light"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>

          <div className="text-center text-sm md:text-right">
            <div>© {new Date().getFullYear()} Franchini Arredamenti — Tutti i diritti riservati</div>
            <div className="mt-1 text-xs">
              {footer.vat} — {footer.address}
            </div>
            <div className="mt-2 text-xs flex items-center justify-center md:justify-end gap-3">
  <Link to="/privacy-policy" className="text-brand-cream/50 hover:text-brand-brass-light transition-smooth">Privacy Policy</Link>
  <span className="text-brand-cream/30">·</span>
  <Link to="/cookie-policy" className="text-brand-cream/50 hover:text-brand-brass-light transition-smooth">Cookie Policy</Link>
  <span className="text-brand-cream/30">·</span>
  <button onClick={openPreferences} className="text-brand-cream/50 hover:text-brand-brass-light transition-smooth">Preferenze cookie</button>
  <span className="text-brand-cream/30">·</span>
  <Link to="/auth" className="text-brand-cream/50 hover:text-brand-brass-light transition-smooth">Area riservata</Link>
</div>
          </div>
        </div>
      </div>
    </footer>
  );
};
