import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SiteDataProvider, DEFAULTS } from "@/hooks/useSiteData";

const CookiePolicy = () => {
  return (
    <SiteDataProvider initial={DEFAULTS}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Torna alla home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">
            Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div className="space-y-8 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-3">Cosa sono i cookie</h2>
              <p>I cookie sono piccoli file di testo che i siti web visitati inviano al terminale dell'utente, dove vengono memorizzati per essere ritrasmessi al sito alla visita successiva.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">Tipologie di cookie utilizzati</h2>
              <div className="mb-5">
                <h3 className="font-semibold mb-1">Cookie tecnici (necessari)</h3>
                <p>Necessari al corretto funzionamento del sito. Non richiedono il consenso dell'utente in quanto strettamente indispensabili per la fornitura del servizio.</p>
              </div>
              <div className="mb-5">
                <h3 className="font-semibold mb-1">Cookie analitici</h3>
                <p>Utilizzati per raccogliere informazioni in forma aggregata sul numero di utenti e su come visitano il sito. Vengono attivati solo previo consenso.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Cookie di terze parti</h3>
                <p>Possono essere installati cookie da servizi esterni (es. Google Maps, social network) per il corretto funzionamento di componenti del sito.</p>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">Gestione delle preferenze</h2>
              <p>Puoi disabilitare i cookie direttamente dalle impostazioni del tuo browser (Chrome, Firefox, Safari, Edge). Tieni presente che la disabilitazione dei cookie tecnici potrebbe compromettere il corretto funzionamento del sito.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">Contatti</h2>
              <p>Per qualsiasi domanda relativa a questa Cookie Policy, puoi contattarci all'indirizzo <a href="mailto:info@franchiniarredamenti.it" className="underline">info@franchiniarredamenti.it</a>.</p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </SiteDataProvider>
  );
};

export default CookiePolicy;
