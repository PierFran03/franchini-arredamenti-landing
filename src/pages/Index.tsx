import { useEffect, useState } from "react";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Collections } from "@/components/landing/Collections";
import { Story } from "@/components/landing/Story";
import { Promo } from "@/components/landing/Promo";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";
import { SiteDataProvider, fetchSiteData, DEFAULTS, SiteData } from "@/hooks/useSiteData";

const Index = () => {
  const [data, setData] = useState<SiteData>(DEFAULTS);
  useEffect(() => {
    fetchSiteData().then((d) => d && setData(d));
  }, []);

  return (
    <SiteDataProvider initial={data}>
      <main className="min-h-screen bg-background">
        <Header />
        <Hero />
        <TrustBar />
        <Collections />
        <Story />
        <Promo />
        <Contact />
        <Footer />
      </main>
    </SiteDataProvider>
  );
};

export default Index;
