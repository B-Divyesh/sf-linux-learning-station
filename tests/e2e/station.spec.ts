import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function setup(page: import('@playwright/test').Page, age = '7–8') {
  await page.goto('/');
  await page.getByRole('button', { name: new RegExp(age.replace('–', '.')) }).click();
  await expect(page.getByRole('heading', { name: 'Choose today’s trail' })).toBeVisible();
}

test('fresh setup leads to all six offline activities at mobile width', async ({ page }) => {
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
  await expect(page.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy/');
});

test('installed station reloads while fully offline', async ({ page, context }) => {
  await setup(page);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
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
