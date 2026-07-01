
CREATE TABLE public.calendar_closures (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text NOT NULL DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT calendar_closures_range_valid CHECK (end_date >= start_date)
);

GRANT SELECT ON public.calendar_closures TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_closures TO authenticated;
GRANT ALL ON public.calendar_closures TO service_role;

ALTER TABLE public.calendar_closures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read calendar_closures" ON public.calendar_closures
  FOR SELECT TO public USING (true);

CREATE POLICY "Admin write calendar_closures" ON public.calendar_closures
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER trg_calendar_closures_touch
  BEFORE UPDATE ON public.calendar_closures
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX idx_calendar_closures_range ON public.calendar_closures (start_date, end_date);
