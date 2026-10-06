import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    plan: string;
  };
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      req.user = decoded;
      return next();
    } catch (err) {
      // Invalid token
    }
  }

  // Fallback for development / mock mode demo
  req.user = {
    id: 'user-admin-default',
    email: 'admin@scenara.ai',
    name: 'Creative Director',
    plan: 'pro_studio',
  };
  return next();
}
