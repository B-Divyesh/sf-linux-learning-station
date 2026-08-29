import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function setup(page: import('@playwright/test').Page, age = '7–8') {
  await page.goto('/');
  await page.getByRole('button', { name: new RegExp(age.replace('–', '.')) }).click();
  await expect(page.getByRole('heading', { name: 'Choose today’s trail' })).toBeVisible();
}

test('@claim:six-free-activities fresh setup leads to all six offline activities at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await setup(page);
  await expect(page.locator('.activity-slab')).toHaveCount(6);
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).resolves.toBe(true);
  // axe's package permits newer Playwright peers; runtime APIs used here are stable.
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('completes a pattern round and stores a win', async ({ page }) => {
  await setup(page);
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await expect(page.getByText('What comes next?')).toBeVisible();
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await expect(page.getByRole('heading', { name: 'Good noticing!' })).toBeVisible();
  await page.getByRole('button', { name: 'Next round' }).click();
  await expect(page.getByText('Round 2 / 3')).toBeVisible();
});

test('typing, spelling, and drawing have working completion paths', async ({ page }) => {
  await setup(page, '5–6');
  await page.getByRole('button', { name: 'Start Key Trail' }).click();
  await page.getByLabel('Your typing').fill('moss');
  await page.getByRole('button', { name: 'Check typing' }).click();
  await expect(page.getByRole('heading', { name: 'Good noticing!' })).toBeVisible();
  await page.getByRole('button', { name: 'Station board' }).click();
  await page.getByRole('button', { name: 'Start Word Workshop' }).click();
  await page.getByLabel('Build the word').fill('cat');
  await page.getByRole('button', { name: 'Check word' }).click();
  await expect(page.getByRole('heading', { name: 'Good noticing!' })).toBeVisible();
  await page.getByRole('button', { name: 'Station board' }).click();
  await page.getByRole('button', { name: 'Start Moss Sketchbook' }).click();
  await page.getByRole('button', { name: 'Add dot' }).click();
  await page.getByRole('button', { name: 'Save this drawing session' }).click();
  await expect(page.getByRole('heading', { name: /points saved/ })).toBeVisible();
});

test('adult tools expose local data and legal controls', async ({ page }) => {
  await setup(page);
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Station controls' })).toBeVisible();
  await expect(page.getByLabel('Adult tools', { exact: true }).getByText(/MOSS-78-/)).toBeVisible();
  await expect(page.getByRole('link', { name: 'Buy the offline bundle' })).toHaveAttribute('href', /api\.sociobot\.in\/api\/v1\/products\/linux-learning-station\/checkout/);
  await expect(page.getByLabel('Legal').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy/');
});

test('@claim:offline-reload installed station reloads while fully offline', async ({ page, context }) => {
  await setup(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await expect(page.evaluate(async () => {
    const script = document.querySelector<HTMLScriptElement>('script[type="module"]')?.src;
    const names = await caches.keys();
    return Boolean(script && await Promise.all(names.map(async (name) => caches.open(name).then((cache) => cache.match(script)))).then((matches) => matches.some(Boolean)));
  })).resolves.toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Choose today’s trail' })).toBeVisible();
  await expect(page.getByText(/working offline/i)).toBeVisible();
});

test('privacy and terms are real standalone pages', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms' })).toBeVisible();
});

test('@claim:demo-sandbox opens a seeded station without using the real setup', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByLabel('Demo mode')).toContainText('Demo — sample data, nothing is saved');
  await expect(page.getByRole('heading', { name: 'Choose today’s trail' })).toBeVisible();
  await expect(page.getByText('2 wins saved')).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('2 wins saved')).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Choose today’s trail' })).toBeVisible();
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Start offline learning activities' })).toBeVisible();
});

test('@claim:local-only core activity use does not send data off this origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await setup(page);
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
});

test('@claim:json-export exports complete local progress and rejects partial attempts', async ({ page }) => {
  await setup(page);
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export data' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^learning-station-.*\.json$/);
  const stream = await download.createReadStream();
  let json = '';
  for await (const chunk of stream ?? []) json += String(chunk);
  const contents = JSON.parse(json);
  expect(contents.settings.ageBand).toBe('7–8');
  await page.locator('#import-file').setInputFiles('tests/fixtures/broken-import.json');
  await expect(page.getByRole('status').getByText('That file is not a valid Learning Station export.')).toBeVisible();
});

test('regressions: exact typing, valid 9–10 logic, dialog cancel, titles, and focus trap', async ({ page }) => {
  await setup(page, '5–6');
  await page.getByRole('button', { name: 'Start Key Trail' }).click();
  await page.getByLabel('Your typing').fill('moss ');
  await page.getByRole('button', { name: 'Check typing' }).click();
  await expect(page.getByRole('heading', { name: 'A useful try' })).toBeVisible();
  await page.getByRole('button', { name: 'Station board' }).click();
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByLabel('Legal').getByRole('link', { name: 'Terms' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close adult tools' })).toBeFocused();
  await page.getByRole('button', { name: 'Erase progress on this computer' }).click();
  await page.getByRole('button', { name: 'Keep progress' }).click();
  await expect(page.locator('#reset-dialog')).not.toBeVisible();
  await page.getByRole('button', { name: '9–10' }).click();
  await page.getByRole('button', { name: 'Start Logic Bridges' }).click();
  await expect(page).toHaveTitle('Logic Bridges — Linux Learning Station');
  await page.getByRole('button', { name: 'A is not red' }).click();
  await page.getByRole('button', { name: 'Next round' }).click();
  await page.getByRole('button', { name: 'It did not rain' }).click();
  await page.getByRole('button', { name: 'Next round' }).click();
  await page.getByRole('button', { name: 'A is true' }).click();
  await expect(page.getByRole('heading', { name: 'Good noticing!' })).toBeVisible();
});

test('regression: corrupt cached license verdict cannot block startup', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:linux-learning-station', 'sample-token');
    localStorage.setItem('sb_license_verdict:linux-learning-station', '{bad json');
  });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Start offline learning activities' })).toBeVisible();
});
