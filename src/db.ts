import type { Attempt, Settings, StationData } from './types';
import { isDemoMode } from './mode';

const DB_NAME = 'linux-learning-station';
const STORE = 'station';
const DEFAULTS: Settings = { ageBand: '7–8', setupDone: false, sound: false };

export const demoStation = (): StationData => ({
  settings: { ageBand: '7–8', setupDone: true, sound: false },
  attempts: [
    { id: 'demo-pattern', activity: 'patterns', correct: true, points: 10, detail: 'Solved a shape pattern', createdAt: '2026-08-28T10:00:00.000Z' },
    { id: 'demo-keys', activity: 'keys', correct: true, points: 10, detail: 'Typed a trail carefully', createdAt: '2026-08-28T10:03:00.000Z' },
    { id: 'demo-numbers', activity: 'numbers', correct: false, points: 2, detail: 'Practised number stones', createdAt: '2026-08-29T09:15:00.000Z' },
  ],
  updatedAt: '2026-08-29T09:15:00.000Z',
});

function databaseName(): string { return isDemoMode() ? `${DB_NAME}-demo` : DB_NAME; }

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName(), 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getValue<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).get(key);
    request.onsuccess = () => { const value = request.result as T | undefined; db.close(); resolve(value); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

async function setValue<T>(key: string, value: T): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(value, key);
    request.onsuccess = () => { db.close(); resolve(); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
}

export async function loadStation(): Promise<StationData> {
  const settings = await getValue<Settings>('settings');
  const attempts = await getValue<Attempt[]>('attempts');
  if (isDemoMode() && !settings && !attempts) {
    const sample = demoStation();
    await replaceStation(sample);
    return sample;
  }
  return { settings: settings ?? DEFAULTS, attempts: attempts ?? [], updatedAt: new Date().toISOString() };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await setValue('settings', settings);
}

export async function saveAttempt(attempt: Attempt): Promise<void> {
  const attempts = (await getValue<Attempt[]>('attempts')) ?? [];
  attempts.push(attempt);
  await setValue('attempts', attempts.slice(-500));
}

export async function replaceStation(data: StationData): Promise<void> {
  await Promise.all([setValue('settings', data.settings), setValue('attempts', data.attempts.slice(-500))]);
}

export async function clearStation(): Promise<void> {
  const next = isDemoMode() ? demoStation() : { settings: DEFAULTS, attempts: [] as Attempt[] };
  await Promise.all([setValue('settings', next.settings), setValue('attempts', next.attempts)]);
}

/** Remove changed sample progress before a visitor returns to real mode. */
export async function discardDemoStation(): Promise<void> {
  // Re-seed first: browser implementations can delay deleteDatabase while a
  // just-finished IndexedDB transaction releases its connection. No changed
  // demo result can survive that delay.
  await clearStation();
  const request = indexedDB.deleteDatabase(`${DB_NAME}-demo`);
  // A blocked delete is harmless here: the just-written seed contains no
  // visitor changes, and a later close lets the browser complete deletion.
  request.onerror = () => undefined;
}

export function validateImport(value: unknown): StationData {
  if (!value || typeof value !== 'object') throw new Error('That file does not contain station data.');
  const data = value as Partial<StationData>;
  if (!data.settings || !['5–6', '7–8', '9–10'].includes(data.settings.ageBand) || typeof data.settings.setupDone !== 'boolean' || typeof data.settings.sound !== 'boolean' || !Array.isArray(data.attempts)) {
    throw new Error('That file is not a valid Learning Station export.');
  }
  const activityIds = new Set(['patterns', 'keys', 'logic', 'spelling', 'numbers', 'drawing']);
  const validAttempt = (item: unknown): item is Attempt => {
    if (!item || typeof item !== 'object') return false;
    const attempt = item as Partial<Attempt>;
    return typeof attempt.id === 'string' && attempt.id.length > 0
      && typeof attempt.activity === 'string' && activityIds.has(attempt.activity)
      && typeof attempt.correct === 'boolean' && typeof attempt.points === 'number'
      && attempt.points === (attempt.correct ? 10 : 2)
      && typeof attempt.detail === 'string' && typeof attempt.createdAt === 'string' && !Number.isNaN(Date.parse(attempt.createdAt));
  };
  if (!data.attempts.every(validAttempt) || (data.updatedAt !== undefined && (typeof data.updatedAt !== 'string' || Number.isNaN(Date.parse(data.updatedAt))))) {
    throw new Error('That file is not a valid Learning Station export.');
  }
  return { settings: { ageBand: data.settings.ageBand, setupDone: data.settings.setupDone, sound: data.settings.sound }, attempts: data.attempts.slice(-500), updatedAt: data.updatedAt ?? new Date().toISOString() };
}
