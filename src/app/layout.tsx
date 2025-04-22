import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Homecomponents/Home/Navbar";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Agrictech",
  description:
    "Farmers app is an application which it’s main purpose is to help farmers  market there product online with the help of an agent/middle man, Making it easier for buyers to locate farmers that are living in rural area’s.",
};

// LAyout 

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} antialiased`}>
        <main>
          <nav className="bg-[#f1f1f1] w-full">
            <Navbar />
          </nav>
          {children}
          <div className="bg-[#f1f1f1] w-full">
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}
