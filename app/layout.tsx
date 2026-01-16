import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BookmarksProvider } from "@/context/BookmarksContext";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <BookmarksProvider>
          <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <h1 className="text-xl font-semibold text-gray-900">Bookmark Vault</h1>
            </div>
          </header>
          <main className="max-w-4xl mx-auto px-4 py-6">
            {children}
          </main>
          <DevTools />
        </BookmarksProvider>
      </body>
    </html>
  );
}
