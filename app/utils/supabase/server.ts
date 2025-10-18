// typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, any>) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          // Safe to ignore if called in a Server Component or readonly context
        }
      },
      remove(name: string, options: Record<string, any>) {
        try {
          cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        } catch {
          // Safe to ignore in Server Components or readonly context
        }
      },
    },
  });
}
