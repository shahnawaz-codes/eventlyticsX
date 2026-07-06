"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "./clerk-provider";
import QueryProvider from "./query-provider";
import { AxiosInterceptor } from "./axios-interceptor";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <AxiosInterceptor>
          {children}
          <Toaster
            position="top-right"
            theme="light"
            richColors
          />
        </AxiosInterceptor>
      </AuthProvider>
    </QueryProvider>
  );
}

