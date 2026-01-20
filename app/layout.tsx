import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BookmarksProvider } from "@/context/BookmarksContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { DevTools } from "@/components/DevTools";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookmark Vault",
  description: "A simple bookmark manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors`}
      >
        <ThemeProvider>
          <BookmarksProvider>
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
              <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Bookmark Vault
                </h1>
                <ThemeToggle />
              </div>
            </header>
            <main className="max-w-4xl mx-auto px-4 py-6">
              {children}
            </main>
            <DevTools />
          </BookmarksProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
