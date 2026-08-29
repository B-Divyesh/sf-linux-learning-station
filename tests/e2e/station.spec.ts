import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function setup(page: import('@playwright/test').Page, age = '7–8') {
  await page.goto('/');
  await page.getByRole('button', { name: new RegExp(age.replace('–', '.')) }).click();
  await expect(page.getByRole('heading', { name: 'Choose an activity' })).toBeVisible();
}

test('@claim:six-free-activities demo exposes all six free activities at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await expect(page.locator('.activity-slab')).toHaveCount(6);
  const paths: Array<[string, () => Promise<void>]> = [
    ['Pattern Quarry', async () => { await page.locator('[data-action="answer-option"][data-value="●"]').click(); }],
    ['Key Trail', async () => { await page.getByLabel('Your typing').fill('quiet keys'); await page.getByRole('button', { name: 'Check typing' }).click(); }],
    ['Logic Bridges', async () => { await page.locator('[data-action="answer-option"][data-value="It is green"]').click(); }],
    ['Word Workshop', async () => { await page.getByLabel('Build the word').fill('plant'); await page.getByRole('button', { name: 'Check word' }).click(); }],
    ['Number Stones', async () => { await page.locator('[data-action="answer-option"][data-value="8"]').click(); }],
    ['Moss Sketchbook', async () => { await page.getByRole('button', { name: 'Add dot' }).click(); await page.getByRole('button', { name: 'Save this drawing session' }).click(); }],
  ];
  for (const [name, complete] of paths) {
    const start = page.getByRole('button', { name: `Start ${name}` });
    await expect(start.locator('span').first()).toHaveText(`Start ${name}`);
    await start.click();
    await complete();
    await expect(page.getByRole('heading', { name: /Good noticing!|points saved/ })).toBeVisible();
    await expect(page.getByText(/₹499|Restore a workshop license/)).toHaveCount(0);
    await page.getByRole('button', { name: 'Station board' }).click();
  }
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
  await expect(page.getByText('New licenses are not for sale now.')).toBeVisible();
  await expect(page.getByLabel('Legal').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy/');
});

test('@claim:offline-reload demo station completes and saves activity while fully offline after first visit', async ({ page, context }) => {
  await page.goto('/demo');
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
  await expect(page.getByRole('heading', { name: 'Choose an activity' })).toBeVisible();
  await expect(page.getByText(/working offline/i)).toBeVisible();
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await expect(page.getByRole('heading', { name: 'Good noticing!' })).toBeVisible();
  await page.getByRole('button', { name: 'Station board' }).click();
  await expect(page.getByText('3 wins saved')).toBeVisible();
});

test('@claim:installable-pwa Chromium accepts the demo as an installable app', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

  const session = await page.context().newCDPSession(page);
  const manifest = await session.send('Page.getAppManifest');
  const installability = await session.send('Page.getInstallabilityErrors');
  expect(manifest.errors).toEqual([]);
  expect(installability.installabilityErrors).toEqual([]);

  const data = JSON.parse(manifest.data ?? '{}');
  expect(data).toMatchObject({
    name: 'Linux Learning Station',
    start_url: '/?source=pwa&v=1.2.2',
    display: 'standalone',
  });
  expect(data.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: '192x192', purpose: 'any' }),
    expect.objectContaining({ sizes: '512x512', purpose: 'any maskable' }),
  ]));
});

test('privacy and terms are real standalone pages', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Linux Learning Station');
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms' })).toBeVisible();
  await expect(page.getByText('You may install the station on devices you control')).toBeVisible();
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
});

test('real activity deep links survive setup and set route-specific metadata', async ({ page }) => {
  await page.goto('/activity/patterns');
  await expect(page.getByRole('heading', { name: 'Start offline learning activities' })).toBeVisible();
  await page.getByRole('button', { name: /Start activities for ages\s+7.8/ }).click();
  await expect(page).toHaveURL(/\/activity\/patterns$/);
  await expect(page.getByRole('heading', { name: 'Pattern Quarry' })).toBeVisible();
  await expect(page).toHaveTitle('Pattern Quarry — Linux Learning Station');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://linux-learning-station.sociobot.in/activity/patterns');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Pattern Quarry — Linux Learning Station');
});

test('demo entry and offline status reflect actual service-worker readiness', async ({ page }) => {
  await page.goto('/?demo=1');
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Choose an activity' })).toBeVisible();
  await expect.poll(() => page.locator('#connection-status').textContent()).toMatch(/Ready offline|Online/);
  await page.reload();
  await expect.poll(() => page.locator('#connection-status').textContent()).toContain('Ready offline');
});

test('@claim:demo-sandbox discards changed sample progress on exit and keeps it out of real data', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.getByLabel('Demo mode')).toContainText('Demo — sample data, nothing is saved');
  await expect(page.getByRole('heading', { name: 'Choose an activity' })).toBeVisible();
  await expect(page.getByText('2 wins saved')).toBeVisible();
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await expect(page).toHaveURL(/\/demo\/activity\/patterns$/);
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await expect(page.getByRole('heading', { name: 'Good noticing!' })).toBeVisible();
  await page.getByRole('button', { name: 'Station board' }).click();
  await expect(page.getByText('3 wins saved')).toBeVisible();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Choose an activity' })).toBeVisible();
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'Start offline learning activities' })).toBeVisible();
  await page.goto('/demo');
  await expect(page.getByText('2 wins saved')).toBeVisible();
});

test('@claim:local-only demo activity use does not send data off this origin', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  expect(requests.every((url) => new URL(url).origin === 'http://127.0.0.1:4173')).toBe(true);
  expect(await page.locator('iframe, [class*="advert"], [id*="chat"]').count()).toBe(0);
  expect(await page.locator('script[src]').evaluateAll((scripts) => scripts.every((script) => new URL((script as HTMLScriptElement).src).origin === location.origin))).toBe(true);
});

test('@claim:json-export exports and imports complete data but rejects impossible scores', async ({ page }) => {
  await page.goto('/demo');
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
  const path = await download.path();
  expect(path).toBeTruthy();
  await page.locator('#import-file').setInputFiles(path!);
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await expect(page.getByRole('status').getByText('Progress imported successfully.')).toBeVisible();
  await page.locator('#import-file').setInputFiles('tests/fixtures/broken-import.json');
  await expect(page.getByRole('status').getByText('That file is not a valid Learning Station export.')).toBeVisible();
  await page.locator('#import-file').setInputFiles('tests/fixtures/negative-points-import.json');
  await expect(page.getByRole('status').getByText('That file is not a valid Learning Station export.')).toBeVisible();
});

test('@claim:erase-progress erases real activity progress and returns to setup', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: /Start activities for ages\s+7–8/ }).click();
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await page.getByRole('button', { name: 'Station board' }).click();
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await page.getByRole('button', { name: 'Erase progress on this computer' }).click();
  await page.getByRole('button', { name: 'Erase progress', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Start offline learning activities' })).toBeVisible();
});

test('@claim:printable-code creates an anonymous progress code and printable sheet', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  const code = await page.locator('.code-label strong').textContent();
  expect(code).toMatch(/^MOSS-78-[A-Z0-9]{4}$/);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.print-sheet')).toBeVisible();
  await expect(page.locator('.print-code')).toHaveText(code!);
  await expect(page.locator('.print-sheet')).not.toContainText(/name|email/i);
});

test('@claim:input-paths supports keyboard and touch-style drawing controls', async ({ page }) => {
  await page.goto('/demo/activity/drawing');
  const addDot = page.getByRole('button', { name: 'Add dot' });
  await addDot.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#announcer')).toHaveText('Dot added to the drawing.');
  const box = await page.locator('#sketch').boundingBox();
  expect(box).toBeTruthy();
  await page.locator('#sketch').dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', clientX: box!.x + 30, clientY: box!.y + 30 });
  await page.locator('#sketch').dispatchEvent('pointermove', { pointerId: 1, pointerType: 'touch', clientX: box!.x + 60, clientY: box!.y + 60 });
  await page.locator('#sketch').dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch', clientX: box!.x + 60, clientY: box!.y + 60 });
  await page.getByRole('button', { name: 'Save this drawing session' }).click();
  await expect(page.getByRole('heading', { name: /points saved/ })).toBeVisible();
});

test('@claim:update-notice applies a real waiting service worker update and reloads under the new controller', async ({ page }) => {
  await page.goto('/demo');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await page.evaluate(() => navigator.serviceWorker.register('/sw-test-vnext.js'));
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.getRegistration().then((registration) => Boolean(registration?.waiting)))).toBe(true);
  await page.evaluate(() => window.dispatchEvent(new Event('station:update-ready')));
  const changed = page.waitForEvent('framenavigated');
  await page.getByRole('button', { name: 'Update now' }).click();
  await changed;
  await expect.poll(() => page.evaluate(async () => (await caches.match('/update-marker'))?.text())).toBe('vnext');
  await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller?.scriptURL.endsWith('/sw-test-vnext.js'))).toBe(true);
});

test('@claim:paid-bundle verified license provides five rounds and detailed printouts', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('sb_license:linux-learning-station', 'test-license');
  });
  await page.route('https://api.sociobot.in/api/v1/products/linux-learning-station/verify?license=test-license', async (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true}' }));
  await page.goto('/demo');
  await expect.poll(() => page.getByRole('button', { name: 'Start Pattern Quarry' }).count()).toBe(1);
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  for (const answer of ['●', '▲', '●', '●', '▲']) {
    await page.locator(`[data-action="answer-option"][data-value="${answer}"]`).click();
    await page.getByRole('button', { name: /Next round|Finish session/ }).click();
  }
  await expect(page.getByRole('heading', { name: '50 points saved' })).toBeVisible();
  await page.getByRole('button', { name: 'Station board' }).click();
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.print-sheet').getByRole('heading', { name: 'Recent practice' })).toBeVisible();
});

test('@claim:age-ranges opens distinct guided content for each age range', async ({ page }) => {
  const fixtures: Array<[string, string]> = [['5–6', '● ● ● plus ● ● is…'], ['7–8', '14 − 6 = ?'], ['9–10', '3/4 of 20 is…']];
  for (const [age, question] of fixtures) {
    await page.goto('/');
    await page.getByRole('button', { name: new RegExp(`Start activities for ages\\s+${age.replace('–', '.')}`) }).click();
    await page.getByRole('button', { name: 'Start Number Stones' }).click();
    await expect(page.getByText(question)).toBeVisible();
    await page.getByRole('button', { name: 'Station board' }).click();
    await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
    await page.getByRole('button', { name: 'Erase progress on this computer' }).click();
    await page.getByRole('button', { name: 'Erase progress', exact: true }).click();
  }
});

test('@claim:sales-paused exposes no checkout or purchase action', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('New licenses are not for sale now.')).toBeVisible();
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await expect(page.getByText('New licenses are not for sale now.')).toBeVisible();
  await expect(page.locator('a[href*="checkout"], button:has-text("Buy"), button:has-text("Purchase")')).toHaveCount(0);
});

test('@claim:daily-license-check verifies a stored license no more than once per day', async ({ page }) => {
  let checks = 0;
  await page.route('https://api.sociobot.in/api/v1/products/linux-learning-station/verify?license=test-license', async (route) => {
    checks += 1;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true}' });
  });
  await page.goto('/demo');
  await page.evaluate(() => localStorage.setItem('sb_license:linux-learning-station', 'test-license'));
  await page.reload();
  await expect.poll(() => checks).toBe(1);
  await page.reload();
  await page.waitForTimeout(300);
  expect(checks).toBe(1);
});

test('regressions: demo route, round focus, recovery handler, and 44px mobile targets', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo/activity/patterns');
  await expect(page.getByLabel('Demo mode')).toBeVisible();
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await page.getByRole('button', { name: 'Next round' }).click();
  await expect(page.locator('[data-round-focus]')).toBeFocused();
  const targets = await page.locator('.brand, .demo-banner button, .site-footer a').evaluateAll((nodes) => nodes.map((node) => ({ text: node.textContent?.trim(), width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
  expect(targets.every(({ width, height }) => width >= 44 && height >= 44)).toBe(true);
  expect(await page.locator('[onclick]').count()).toBe(0);
});

test('regression: blocked IndexedDB recovery reloads without inline script', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.addInitScript(() => Object.defineProperty(window, 'indexedDB', { configurable: true, get: () => { throw new Error('blocked for test'); } }));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The station could not open' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).not.toHaveAttribute('onclick');
  await Promise.all([page.waitForEvent('domcontentloaded'), page.getByRole('button', { name: 'Try again' }).click()]);
  await expect(page.getByRole('heading', { name: 'The station could not open' })).toBeVisible();
  expect(errors.filter((message) => /content security policy|refused to execute/i.test(message))).toEqual([]);
});

test('accessibility smoke: cold, demo, activity, adult tools, privacy, and terms', async ({ page }) => {
  const scan = async () => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  };
  await page.goto('/'); await scan();
  await page.goto('/demo'); await scan();
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await page.waitForTimeout(300);
  await scan();
  await page.goto('/demo/activity/numbers'); await scan();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/privacy/'); await scan();
  await page.goto('/terms/'); await scan();
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
