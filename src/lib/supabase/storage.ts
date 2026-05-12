import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "lp-banners";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

let _supabase: SupabaseClient | null = null;

function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios para o Supabase Storage",
      );
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}

export async function uploadBanner(
  file: File,
  workspaceId: string,
  lpId: string,
) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Arquivo muito grande. Máximo 5MB.");
  }

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${workspaceId}/${lpId}-${Date.now()}.${ext}`;

  const supabase = getSupabase();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return {
    url: urlData.publicUrl,
    path,
  };
}

export async function deleteBanner(path: string) {
  const supabase = getSupabase();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error(`Erro ao deletar banner: ${error.message}`);
  }
}
