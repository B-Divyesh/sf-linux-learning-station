const SLUG = 'linux-learning-station';
const TOKEN_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `sb_license_verdict:${SLUG}`;
const VERIFY_BASE = 'https://api.sociobot.in/api/v1/products';
export const CHECKOUT_URL = `${VERIFY_BASE}/${SLUG}/checkout`;

export interface LicenseState { unlocked: boolean; checking: boolean; notice: string; }

function savedVerdict(): { valid: boolean; checkedAt: number } | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(VERDICT_KEY) || 'null');
    if (!value || typeof value !== 'object') return null;
    const verdict = value as { valid?: unknown; checkedAt?: unknown };
    return typeof verdict.valid === 'boolean' && typeof verdict.checkedAt === 'number' && Number.isFinite(verdict.checkedAt) ? { valid: verdict.valid, checkedAt: verdict.checkedAt } : null;
  } catch {
    localStorage.removeItem(VERDICT_KEY);
    return null;
  }
}

export function cachedLicense(): LicenseState {
  const token = localStorage.getItem(TOKEN_KEY);
  const cached = savedVerdict();
  return { unlocked: Boolean(token && cached?.valid), checking: Boolean(token), notice: '' };
}

export function captureLicense(): void {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token.trim());
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function storeLicense(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
}

export async function checkLicense(): Promise<LicenseState> {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return { unlocked: false, checking: false, notice: '' };
  const cached = savedVerdict();
  const fresh = cached && Date.now() - cached.checkedAt < 86_400_000;
  if (fresh) return { unlocked: cached.valid, checking: false, notice: cached.valid ? '' : 'License no longer active.' };
  try {
    const response = await fetch(`${VERIFY_BASE}/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verify failed');
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return { unlocked: result.valid, checking: false, notice: result.valid ? '' : 'License no longer active.' };
  } catch {
    return { unlocked: cached?.valid ?? false, checking: false, notice: cached ? 'Offline — using the last license check.' : 'Connect once to verify this license.' };
  }
}
