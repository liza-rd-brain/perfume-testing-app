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


// ✅ Админ клиент (без RLS) - ТОЛЬКО ДЛЯ СЕРВЕРА!
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
    db: {
        schema: 'public',
    },
    global: {
        fetch: (url, options) => {
            // Увеличиваем таймаут до 30 секунд
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);

            return fetch(url, {
                ...options,
                signal: controller.signal,
            }).finally(() => clearTimeout(timeoutId));
        },
    },
});

