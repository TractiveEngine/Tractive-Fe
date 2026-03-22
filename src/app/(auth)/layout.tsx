import React from "react";
import { UserEmailProvider } from "../../hooks/userEmailContext";
import { Footer } from "../../components/Footer";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserEmailProvider>
      <main>
        {children}
        <div className="bg-[#f1f1f1] w-full">
          <Footer />
        </div>
      </main>
    </UserEmailProvider>
  );
}
