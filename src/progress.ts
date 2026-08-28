import type { AgeBand, Attempt } from './types';

export function progressCode(ageBand: AgeBand, attempts: Attempt[]): string {
  const successful = attempts.filter((item) => item.correct).length;
  const activities = new Set(attempts.filter((item) => item.correct).map((item) => item.activity)).size;
  const week = Math.floor(Date.now() / 604_800_000).toString(36).toUpperCase().slice(-2).padStart(2, '0');
  const age = ageBand.replace(/\D/g, '');
  const checksum = ((successful * 17 + activities * 31 + Number(age)) % 1296).toString(36).toUpperCase().padStart(2, '0');
  return `MOSS-${age}-${week}${checksum}`;
}

export function activeDays(attempts: Attempt[]): number {
  return new Set(attempts.map((item) => item.createdAt.slice(0, 10))).size;
}

export function todayPoints(attempts: Attempt[]): number {
  const today = new Date().toISOString().slice(0, 10);
  return attempts.filter((item) => item.createdAt.startsWith(today)).reduce((sum, item) => sum + item.points, 0);
}
