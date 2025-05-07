import { Navbar } from "@/components/nav/Navbar";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main>
          <Toaster position="top-center" />
          <nav className="bg-[#f1f1f1] w-full">
            <Navbar />
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}
