import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { env } from '@/config/env';
import type { Admin } from '@prisma/client';

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Admin['role'];
}

const DURATION_UNITS_MS: Record<string, number> = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
};

export function parseDurationToMs(duration: string, fallbackMs: number): number {
  const match = /^(\d+)\s*([smhd])$/.exec(duration.trim());
  if (!match) return fallbackMs;
  const [, amount, unit] = match;
  return Number(amount) * DURATION_UNITS_MS[unit];
}

export async function authenticateAdmin(email: string, password: string): Promise<Admin | null> {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;

  const passwordMatches = await bcrypt.compare(password, admin.passwordHash);
  if (!passwordMatches) return null;

  return admin;
}

export function createSessionToken(admin: Admin): string {
  const payload: SessionPayload = {
    sub: admin.id,
    email: admin.email,
    name: admin.name,
    role: admin.role,
  };

  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}
