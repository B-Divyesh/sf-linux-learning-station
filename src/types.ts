export type AgeBand = '5–6' | '7–8' | '9–10';
export type ActivityId = 'patterns' | 'keys' | 'logic' | 'spelling' | 'numbers' | 'drawing';

export interface Settings {
  ageBand: AgeBand;
  setupDone: boolean;
  sound: boolean;
}

export interface Attempt {
  id: string;
  activity: ActivityId;
  correct: boolean;
  points: number;
  detail: string;
  createdAt: string;
}

export interface StationData {
  settings: Settings;
  attempts: Attempt[];
  updatedAt: string;
}

export interface ActivityInfo {
  id: ActivityId;
  title: string;
  kicker: string;
  description: string;
  ages: AgeBand[];
  symbol: string;
  tone: string;
}
