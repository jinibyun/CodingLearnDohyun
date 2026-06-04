import { createBrowserClient } from "@supabase/ssr"
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase-config"

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
