"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

/**
 * AuthProvider wraps the application in Clerk authentication context.
 * 
 * TODO: Configure custom appearance or localization options on ClerkProvider.
 * See: https://clerk.com/docs/components/clerk-provider
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      // You can add custom configuration properties here
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      {children}
    </ClerkProvider>
  );
}
