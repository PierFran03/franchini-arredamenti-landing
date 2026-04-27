import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { Collections } from "@/components/landing/Collections";
import { Story } from "@/components/landing/Story";
import { Promo } from "@/components/landing/Promo";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
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
  );
};

export default Index;
