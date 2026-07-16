import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export const CookieConsentBanner = () => {
  const { isBannerOpen, consent, acceptAll, rejectNonEssential, savePreferences } = useCookieConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsChoice, setAnalyticsChoice] = useState(consent?.analytics ?? false);

  if (!isBannerOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-brand-brass/30 bg-brand-walnut-deep text-brand-cream shadow-elegant">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl text-sm text-brand-cream/85">
          <p>
            Usiamo cookie tecnici, necessari al funzionamento del sito, e — solo con il tuo consenso —
            cookie analitici per capire come viene usato il sito. Puoi accettarli tutti, rifiutare quelli
            non necessari o scegliere le tue preferenze. Per saperne di più leggi la{" "}
            <Link to="/cookie-policy" className="underline hover:text-brand-brass-light">
              Cookie Policy
            </Link>.
          </p>

          {showDetails && (
            <div className="mt-4 space-y-3 rounded-sm border border-brand-cream/15 bg-brand-walnut-deep/60 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-brand-cream">Cookie tecnici</div>
                  <div className="text-xs text-brand-cream/60">Sempre attivi, necessari al funzionamento del sito.</div>
                </div>
                <Switch checked disabled />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-brand-cream">Cookie analitici</div>
                  <div className="text-xs text-brand-cream/60">Ci aiutano a capire come i visitatori usano il sito.</div>
                </div>
                <Switch checked={analyticsChoice} onCheckedChange={setAnalyticsChoice} />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {showDetails ? (
            <Button
              onClick={() => savePreferences(analyticsChoice)}
              className="bg-brand-brass text-accent-foreground hover:bg-brand-brass-light"
            >
              Salva preferenze
            </Button>
          ) : (
            <>
              <button
                onClick={() => setShowDetails(true)}
                className="text-sm font-medium uppercase tracking-widest text-brand-cream/70 underline-offset-4 hover:text-brand-cream hover:underline"
              >
                Personalizza
              </button>
              <Button
                variant="outline"
                onClick={rejectNonEssential}
                className="border-brand-cream/30 bg-transparent text-brand-cream hover:bg-brand-cream/10 hover:text-brand-cream"
              >
                Rifiuta non necessari
              </Button>
              <Button onClick={acceptAll} className="bg-brand-brass text-accent-foreground hover:bg-brand-brass-light">
                Accetta tutti
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
