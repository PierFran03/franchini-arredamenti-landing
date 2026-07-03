import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { SiteDataProvider, DEFAULTS } from "@/hooks/useSiteData";

const PrivacyPolicy = () => {
  return (
    <SiteDataProvider initial={DEFAULTS}>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Torna alla home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">
            Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <div className="space-y-8 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Titolare del trattamento</h2>
              <p>Il titolare del trattamento dei dati è <strong>GI.ERRE srl</strong>, con sede in compl. Nord Z.I, 74027 San Giorgio Jonico (TA). Per qualsiasi informazione può contattarci all'indirizzo email <a href="mailto:info@franchiniarredamenti.it" className="underline">info@stilcucine.com</a> o al numero <a href="tel:+393483573099" className="underline">348 357 3099</a>.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Tipologie di dati raccolti</h2>
              <p>Raccogliamo i dati che lei ci fornisce volontariamente tramite i moduli di contatto e prenotazione:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Nome e cognome</li>
                <li>Indirizzo email</li>
                <li>Numero di telefono</li>
                <li>Messaggio o richiesta</li>
                <li>Dati di navigazione raccolti tramite cookie</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">3. Finalità del trattamento</h2>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Rispondere alle sue richieste di informazioni e preventivo</li>
                <li>Gestire le prenotazioni di appuntamento</li>
                <li>Adempiere agli obblighi di legge</li>
                <li>Migliorare il funzionamento del sito (previo consenso)</li>
              </ul>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">4. Base giuridica</h2>
              <p>Il trattamento si basa sul suo consenso (art. 6, par. 1, lett. a GDPR), sull'esecuzione di misure precontrattuali (lett. b) e sul legittimo interesse del titolare (lett. f).</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">5. Conservazione dei dati</h2>
              <p>I dati saranno conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti e in conformità agli obblighi di legge.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Diritti dell'interessato</h2>
              <p>In ogni momento può esercitare i diritti previsti dagli artt. 15-22 del GDPR scrivendo a <a href="mailto:info@stilcucine.com" className="underline">info@stilcucine.com</a>.</p>
            </section>
            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Cookie</h2>
              <p>Per informazioni sull'utilizzo dei cookie consulti la nostra <Link to="/cookie-policy" className="underline">Cookie Policy</Link>.</p>
            </section>
          </div>
        </main>
        <Footer />
      </div>
    </SiteDataProvider>
  );
};

export default PrivacyPolicy;
