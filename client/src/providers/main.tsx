"use client";

import { AuthProvider } from "./clerk-provider";
import QueryProvider from "./query-provider";
import { AxiosInterceptor } from "./axios-interceptor";

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <AxiosInterceptor>{children}</AxiosInterceptor>
      </AuthProvider>
    </QueryProvider>
  );
}
