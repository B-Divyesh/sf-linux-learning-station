import type { Attempt, Settings, StationData } from './types';

const DB_NAME = 'linux-learning-station';
const STORE = 'station';
const DEFAULTS: Settings = { ageBand: '7–8', setupDone: false, sound: false };

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function getValue<T>(key: string): Promise<T | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE).objectStore(STORE).get(key);
    request.onsuccess = () => resolve(request.result as T | undefined);
    request.onerror = () => reject(request.error);
  });
}

async function setValue<T>(key: string, value: T): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE, 'readwrite').objectStore(STORE).put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function loadStation(): Promise<StationData> {
  const settings = await getValue<Settings>('settings');
  const attempts = await getValue<Attempt[]>('attempts');
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
  await Promise.all([setValue('settings', DEFAULTS), setValue('attempts', [])]);
}

export function validateImport(value: unknown): StationData {
  if (!value || typeof value !== 'object') throw new Error('That file does not contain station data.');
  const data = value as Partial<StationData>;
  if (!data.settings || !['5–6', '7–8', '9–10'].includes(data.settings.ageBand) || !Array.isArray(data.attempts)) {
    throw new Error('That file is not a valid Learning Station export.');
  }
  return { settings: { ...DEFAULTS, ...data.settings }, attempts: data.attempts.filter((item): item is Attempt => Boolean(item?.id && item?.activity && item?.createdAt)), updatedAt: data.updatedAt ?? new Date().toISOString() };
}
