import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo-franchini.svg";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate("/admin", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast({ title: "Account creato", description: "Accesso effettuato." });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-walnut-deep p-4">
      <div className="w-full max-w-md rounded-sm border border-brand-brass/20 bg-card p-8 shadow-elegant md:p-10">
        <Link to="/" className="flex justify-center mb-6">
          <img src={logo} alt="Franchini Arredamenti" className="h-16 w-auto" />
        </Link>
        <h1 className="text-center font-display text-3xl mb-2">Area Riservata</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">
          {mode === "signin" ? "Accedi per gestire i contenuti del sito" : "Crea l'account amministratore"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Email</label>
            <input
              required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-input bg-transparent py-3 outline-none focus:border-brand-brass"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Password</label>
            <input
              required type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-input bg-transparent py-3 outline-none focus:border-brand-brass"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full rounded-sm bg-brand-brass px-8 py-4 text-sm font-medium uppercase tracking-widest text-accent-foreground shadow-brass transition-smooth hover:bg-brand-brass-light disabled:opacity-60"
          >
            {loading ? "Attendi..." : mode === "signin" ? "Accedi" : "Crea account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 w-full text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-brand-brass transition-smooth"
        >
          {mode === "signin" ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </button>

        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-brand-brass transition-smooth">
          ← Torna al sito
        </Link>
      </div>
    </main>
  );
};

export default Auth;
