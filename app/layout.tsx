import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitShelf - Human-Friendly GitHub Releases",
  description:
    "Discover apps built on GitHub. Browse beautiful app listings, screenshots, and download links directly from GitHub releases.",
  keywords: ["GitHub", "releases", "app store", "download", "open source"],
  authors: [{ name: "GitShelf" }],
  openGraph: {
    title: "GitShelf - Human-Friendly GitHub Releases",
    description:
      "Discover apps built on GitHub with beautiful listings and direct downloads.",
    url: "https://gitshelf.vercel.app",
    siteName: "GitShelf",
    type: "website",
  },
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
