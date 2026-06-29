import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to site-images bucket and returns a long-lived signed URL
 * (bucket is private; we use signed URLs with very long expiry).
 */
export async function uploadSiteImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: uploadErr } = await supabase.storage
    .from("site-images")
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (uploadErr) throw uploadErr;

  // 100 years
  const { data, error } = await supabase.storage
    .from("site-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 100);
  if (error || !data) throw error || new Error("Cannot sign URL");
  return data.signedUrl;
}
