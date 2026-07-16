import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  decidedAt: string;
};

const STORAGE_KEY = "franchini-cookie-consent";

function readStoredConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CookieConsent;
  } catch {
    return null;
  }
}

type CookieConsentContextValue = {
  consent: CookieConsent | null;
  isBannerOpen: boolean;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  savePreferences: (analytics: boolean) => void;
  openPreferences: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export const CookieConsentProvider = ({ children }: { children: ReactNode }) => {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    setConsent(stored);
    setIsBannerOpen(!stored);
  }, []);

  const persist = useCallback((analytics: boolean) => {
    const next: CookieConsent = { necessary: true, analytics, decidedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setConsent(next);
    setIsBannerOpen(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: next }));
  }, []);

  const value: CookieConsentContextValue = {
    consent,
    isBannerOpen,
    acceptAll: () => persist(true),
    rejectNonEssential: () => persist(false),
    savePreferences: (analytics: boolean) => persist(analytics),
    openPreferences: () => setIsBannerOpen(true),
  };

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
};

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  return ctx;
}
