type SupabaseEnv = {
  url: string;
  publishableKey: string;
};

function requireEnvValue(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local before creating a Supabase client.`,
    );
  }

  return value;
}

export function getSupabaseEnv(): SupabaseEnv {
  return {
    url: requireEnvValue(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
    publishableKey: requireEnvValue(
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  };
}
