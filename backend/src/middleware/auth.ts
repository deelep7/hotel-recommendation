import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role?: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth_token"];
  if (!token) {
    return res.status(401).json({ message: "unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
    req.userId = (decoded as JwtPayload).userId;
    req.role = (decoded as any).role;
    next();
  } catch (error) {
    return res.status(401).json({ message: "unauthorized" });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

export default verifyToken;
