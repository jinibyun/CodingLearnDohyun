"use client";

import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { supabase } from "@/lib/supabase";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted || error) {
        return;
      }
      setUser(data.session?.user ?? null);
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="bg-black text-white">
            <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-6">
                <Link href="/" className="hover:opacity-80">
                  Main
                </Link>
                <Link href="/home" className="hover:opacity-80">
                  Home
                </Link>
                <Link href="/about" className="hover:opacity-80">
                  About
                </Link>
                <Link href="/shadcntest" className="hover:opacity-80">
                  Shadcn Test
                </Link>
                
              </div>
              <div className="ml-auto flex items-center gap-3">
                <ThemeToggle />
                {!user ? (
                  <Link href="/login" className="hover:opacity-80">
                    로그인
                  </Link>
                ) : (
                  <>
                    <Link href="/profile" className="hover:opacity-80">
                      프로필
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded border border-white/40 px-3 py-1 text-sm hover:bg-white/10"
                    >
                      로그아웃
                    </button>
                  </>
                )}
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
