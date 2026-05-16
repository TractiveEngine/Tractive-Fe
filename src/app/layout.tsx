import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import AuthGuard from "@/components/guards/AuthGuard";

// Self-hosted Montserrat (variable font, latin subset): no build-time fetch
// from Google Fonts, so the build works offline / behind restricted networks
// (and on Vercel). The single woff2 is a variable font covering the 400-700
// weight axis used across the app.
const montserrat = localFont({
  src: "./fonts/montserrat-latin-variable.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agrictech",
  description:
    "Farmers app is an application which it’s main purpose is to help farmers  market there product online with the help of an agent/middle man, Making it easier for buyers to locate farmers that are living in rural area’s.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <Providers>
          <AuthGuard>
            <main>{children}</main>
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
