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
    if (!JWKS) {
      const JWKS_URL = process.env.NEON_AUTH_JWKS_URL!;
      JWKS = createRemoteJWKSet(new URL(JWKS_URL));
    }

    const { payload } = await jwtVerify(token, JWKS);
    req.user = {
      id: payload.sub!,
      email: payload.email as string,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
