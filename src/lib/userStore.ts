import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';

/**
 * Lightweight account store for the demo.
 *
 * Backed by `globalThis` so the signup route handler and NextAuth's
 * `authorize()` (which Next bundles separately) share the SAME Map within
 * the running server process. Survives HMR in dev.
 *
 * NOTE: this is in-memory — accounts are lost on server restart / serverless
 * cold start. The `demo@pkflix.com` account always works. For production,
 * replace this with a real `users` table (hashed passwords) in Hasura/Postgres.
 */

const globalForUsers = globalThis as unknown as { __pkflixUsers?: Map<string, string> };
const users: Map<string, string> = globalForUsers.__pkflixUsers ?? new Map();
if (!globalForUsers.__pkflixUsers) globalForUsers.__pkflixUsers = users;

const normalize = (email: string) => email.trim().toLowerCase();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function hasUser(email: string): boolean {
  return users.has(normalize(email));
}

export function registerUser(email: string, password: string): void {
  users.set(normalize(email), hashPassword(password));
}

export function verifyUser(email: string, password: string): boolean {
  const stored = users.get(normalize(email));
  if (!stored) return false;
  const [salt, key] = stored.split(':');
  const keyBuf = Buffer.from(key, 'hex');
  const derived = scryptSync(password, salt, 64);
  return keyBuf.length === derived.length && timingSafeEqual(keyBuf, derived);
}
