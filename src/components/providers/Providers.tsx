"use client";

import NextAuthProvider from "./NextAuthProvider";
import ReduxProvider from "./ReduxProvider";
import QueryProvider from "@/lib/react-query/QueryProvider";
import SessionSync from "./SessionSync";
import { Toaster } from "sonner"; 

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <ReduxProvider>
        <QueryProvider>
          <SessionSync />
          {children}
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </ReduxProvider>
    </NextAuthProvider>
  );
}
