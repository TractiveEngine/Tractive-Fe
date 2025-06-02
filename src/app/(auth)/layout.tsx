import React from "react";
import { Footer } from "@/components/Footer";
import { UserEmailProvider } from "@/hooks/userEmailContext";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <UserEmailProvider>
          <main>
            {children}
            <div className="bg-[#f1f1f1] w-full">
              <Footer />
            </div>
          </main>
        </UserEmailProvider>
      </body>
    </html>
  );
}
