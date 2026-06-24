import { Request, Response, NextFunction } from "express";
import { getAuth, requireAuth } from "@clerk/express";
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
      res.status(401).json("Unauthenticated --no Token found");
    }
    //TODO: validate user exist in db__ 1. if yes then attach to req obj with user field or 2. return Unauthorized

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
