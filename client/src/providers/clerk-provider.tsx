"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      // You can add custom configuration properties here
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        variables: {},
      }}
      telemetry={false}
    >
      {children}
    </ClerkProvider>
  );
}
