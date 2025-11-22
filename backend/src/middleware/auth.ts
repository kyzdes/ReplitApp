import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../db/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Authentication required' },
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as {
      userId: string;
      email: string;
      username: string;
    };

    // Verify session exists and is not expired
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid or expired token' },
      });
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      username: session.user.username,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { message: 'Invalid token' },
    });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret) as {
        userId: string;
        email: string;
        username: string;
      };

      const session = await prisma.session.findUnique({
        where: { token },
        include: { user: true },
      });

      if (session && session.expiresAt >= new Date()) {
        req.user = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.username,
        };
      }
    }

    next();
  } catch (error) {
    // Continue without auth if token is invalid
    next();
  }
};
