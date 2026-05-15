export type SupabaseMode = {
  configured: boolean;
  url?: string;
  serviceRoleConfigured: boolean;
};

export function getSupabaseMode(): SupabaseMode {
  return {
    configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    url: process.env.SUPABASE_URL,
    serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
  };
}

export function assertLocalFallbackNotice() {
  return "Supabase is optional for the MVP. When it is not configured, VineScout uses seeded in-memory data.";
}
