import { Request, Response, NextFunction } from "express";
import { getAuth, requireAuth } from "@clerk/express";
import { prisma } from "../config/db.js";
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}
export const protectedRoute = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      return res.status(401).json("Unauthenticated --no Token found");
    }

    const isUser = await prisma.user.findUnique({
      where: { id: auth.userId },
    });
    if (!isUser) {
      return res.status(401).json("Unauthenticated");
    }
    // for now i just return id
    const user = {
      id: auth.userId,
    };
    req.user = user as any;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
