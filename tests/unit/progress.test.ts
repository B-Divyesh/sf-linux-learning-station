import { describe, expect, it, vi } from 'vitest';
import { activeDays, progressCode, todayPoints } from '../../src/progress';
import { validateImport } from '../../src/db';
import type { Attempt } from '../../src/types';

const attempts: Attempt[] = [
  { id: '1', activity: 'patterns', correct: true, points: 10, detail: 'Solved', createdAt: '2026-08-28T10:00:00.000Z' },
  { id: '2', activity: 'numbers', correct: false, points: 2, detail: 'Tried', createdAt: '2026-08-27T10:00:00.000Z' },
];

describe('local progress helpers', () => {
  it('creates a short printable code without identifying a child', () => {
    vi.setSystemTime(new Date('2026-08-28T12:00:00.000Z'));
    expect(progressCode('7–8', attempts)).toMatch(/^MOSS-78-[A-Z0-9]{4}$/);
    vi.useRealTimers();
  });

  it('counts distinct practice days', () => expect(activeDays(attempts)).toBe(2));

  it('counts only today’s points', () => {
    vi.setSystemTime(new Date('2026-08-28T12:00:00.000Z'));
    expect(todayPoints(attempts)).toBe(10);
    vi.useRealTimers();
  });

  it('rejects malformed import files', () => {
    expect(() => validateImport({ settings: { ageBand: 'adult' }, attempts: [] })).toThrow(/valid Learning Station export/);
    expect(() => validateImport({ settings: { ageBand: '7–8', setupDone: true, sound: false }, attempts: [{ id: 'partial', activity: 'patterns', createdAt: '2026-08-29T00:00:00.000Z' }] })).toThrow(/valid Learning Station export/);
  });
});
