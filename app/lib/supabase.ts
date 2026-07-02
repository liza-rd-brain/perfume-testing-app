// app/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}

// Клиент для браузера (с anon ключом)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Серверный клиент (с сервисным ключом, для server-only кода)
export const supabaseServer = createClient(
    supabaseUrl,
    supabaseServiceKey || supabaseAnonKey
);