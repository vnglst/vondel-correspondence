import type { Metadata } from "next";
import { Proza_Libre } from "next/font/google";
import Head from "next/head";
import "./globals.css";

const inter = Proza_Libre({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Letters from Vondel",
  description: "A collection of letters from Joost van den Vondel. Edited with OCR and GPT-4o.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <script
          defer
          data-domain="vondel.koenvangilst.nl"
          src="https://plausible.koenvangilst.nl/js/script.js"
        ></script>
      </Head>
      <body className={inter.className}>
        {children}
        <footer className="bg-slate-900 text-white text-center p-4">
          Made with GPT-4o by <a href="https://koenvangilst.nl">Koen van Gilst</a>
        </footer>
      </body>
    </html>
  );
}
