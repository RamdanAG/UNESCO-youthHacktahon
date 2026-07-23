import { createClient } from "@supabase/supabase-js";

// TODO: move to env vars (.env.local) - never commit real keys.
// NOTE: per docs/BACKEND_CONTRACT.md, this is NOT used to read/write gameplay
// tables directly (sessions, characters, battles, etc) - that always goes
// through the Backend REST API. Only use this for Supabase Auth client-side
// helpers if needed, or future Realtime features.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
