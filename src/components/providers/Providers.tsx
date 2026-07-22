"use client";

import NextAuthProvider from "./NextAuthProvider";
import ReduxProvider from "./ReduxProvider";
import QueryProvider from "@/lib/react-query/QueryProvider";
import SessionSync from "./SessionSync";
import { AddAccountModalProvider } from "./AddAccountModalProvider";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <ReduxProvider>
        <QueryProvider>
          <SessionSync />
          <AddAccountModalProvider>{children}</AddAccountModalProvider>
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </ReduxProvider>
    </NextAuthProvider>
  );
}
