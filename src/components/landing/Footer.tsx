import logo from "@/assets/logo-franchini.svg";

export const Footer = () => {
  return (
    <footer className="border-t border-brand-walnut/20 bg-brand-walnut-deep py-12 text-brand-cream/70">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Franchini Arredamenti"
              className="h-10 w-auto object-contain brightness-0 invert opacity-90"
              width={60}
              height={40}
              loading="lazy"
            />
            <div className="leading-tight">
              <div className="font-display text-lg text-brand-cream">Franchini Arredamenti</div>
              <div className="text-xs uppercase tracking-widest">San Giorgio Ionico · TA</div>
            </div>
          </div>

          <div className="text-center text-sm md:text-right">
            <div>© {new Date().getFullYear()} Franchini Arredamenti — Tutti i diritti riservati</div>
            <div className="mt-1 text-xs">
              P. Iva — Showroom Via Roma 61/63, 74027 San Giorgio Ionico (TA)
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
