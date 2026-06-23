import { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

let JWKS: any = null;

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    /**
     * TODO: Implement Clerk JWT Token verification.
     * 
     * You need to verify that this token is signed by Clerk.
     * You can either:
     * 1. Use the `@clerk/backend` SDK to verify the token:
     *    ```typescript
     *    import { createClerkClient } from "@clerk/backend";
     *    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
     *    const payload = await clerkClient.verifyToken(token);
     *    req.user = { id: payload.sub, email: payload.email as string };
     *    ```
     * 2. Or verify manually using `jose` and Clerk's JWKS URL:
     *    ```typescript
     *    const JWKS_URL = `https://<your-clerk-frontend-api>/.well-known/jwks.json`;
     *    const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
     *    const { payload } = await jwtVerify(token, JWKS);
     *    req.user = { id: payload.sub!, email: payload.email as string };
     *    ```
     */
    console.warn("Clerk Auth token verification is pending implementation. Mocking user session for testing.");
    
    // MOCK USER for testing before Clerk logic is wired up:
    req.user = {
      id: "user_mock_12345",
      email: "developer@eventlyticsx.com",
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
