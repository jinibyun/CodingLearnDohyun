import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "OOO의 포트폴리오",
  description: "Next.js로 만든 첫 번째 작품",
};

export default function RootLayout({ children }) {
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
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Link href="/login" className="hover:opacity-80">
                  Login
                </Link>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
