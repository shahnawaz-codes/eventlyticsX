import { createInternalNeonAuth } from "@neondatabase/auth";
import { BetterAuthReactAdapter, BetterAuthReactAdapterInstance } from "@neondatabase/auth/react/adapters";

const internalAuth = createInternalNeonAuth<BetterAuthReactAdapterInstance>(process.env.NEXT_PUBLIC_NEON_AUTH_BASE_URL!, {
  adapter: BetterAuthReactAdapter(),
});

export const authClient = internalAuth.adapter;
export const getJWTToken = internalAuth.getJWTToken;


