import { expect, test, type Browser, type BrowserContext, type BrowserContextOptions, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

const TEST_BASE_URL = 'http://127.0.0.1:4173';

/**
 * Reload, offline, update, and license scenarios must never mutate the
 * runner-owned context. The Playwright fixture owns the shared browser for
 * this worker; these tests only create and tear down their own context.
 */
async function withIsolatedPage<T>(
  browser: Browser,
  run: (page: Page, context: BrowserContext) => Promise<T>,
  options?: BrowserContextOptions,
): Promise<T> {
  const context = await browser.newContext({ baseURL: TEST_BASE_URL, ...options });
  const page = await context.newPage();
  try {
    return await run(page, context);
  } finally {
    await context.close();
  }
}

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
    await expect(page.getByText(/₹499|Restore a workshop license/).filter({ visible: true })).toHaveCount(0);
    await page.getByRole('button', { name: 'Station board' }).click();
  }
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).resolves.toBe(true);
  // axe's package permits newer Playwright peers; runtime APIs used here are stable.
  const results = await new AxeBuilder({ page: page as never }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('@claim:core-session-shape five guided activities finish after three rounds and drawing finishes after one save', async ({ page }) => {
  await page.goto('/demo');
  const guided = [
    { name: 'Pattern Quarry', kind: 'option', answers: ['●', '▲', '●'] },
    { name: 'Key Trail', kind: 'typing', answers: ['quiet keys', 'plants need light', 'I can learn offline.'] },
    { name: 'Logic Bridges', kind: 'option', answers: ['It is green', 'Cy', '18'] },
    { name: 'Word Workshop', kind: 'spelling', answers: ['plant', 'bridge', 'book'] },
    { name: 'Number Stones', kind: 'option', answers: ['8', '6 × 4', '9'] },
  ];

  for (const activity of guided) {
    await page.getByRole('button', { name: `Start ${activity.name}` }).click();
    for (let round = 0; round < 3; round += 1) {
      await expect(page.getByText(`Round ${round + 1} / 3`)).toBeVisible();
      if (activity.kind === 'typing') {
        await page.getByLabel('Your typing').fill(activity.answers[round]);
        await page.getByRole('button', { name: 'Check typing' }).click();
      } else if (activity.kind === 'spelling') {
        await page.getByLabel('Build the word').fill(activity.answers[round]);
        await page.getByRole('button', { name: 'Check word' }).click();
      } else {
        await page.getByRole('button', { name: activity.answers[round], exact: true }).click();
      }
      await expect(page.getByRole('heading', { name: 'Good noticing!' })).toBeVisible();
      await page.getByRole('button', { name: round === 2 ? 'Finish session' : 'Next round' }).click();
    }
    await expect(page.getByRole('heading', { name: '30 points saved' })).toBeVisible();
    await page.getByRole('button', { name: 'Station board' }).click();
  }

  await page.getByRole('button', { name: 'Start Moss Sketchbook' }).click();
  await expect(page.locator('.round-meter')).toHaveCount(0);
  await page.getByRole('button', { name: 'Add dot' }).click();
  await page.getByRole('button', { name: 'Save this drawing session' }).click();
  await expect(page.getByRole('heading', { name: '10 points saved' })).toBeVisible();
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

test('saved progress uses singular and plural win labels', async ({ page }) => {
  await setup(page);
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await page.getByRole('button', { name: 'Station board' }).click();
  await expect(page.getByText('1 win saved', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Start Logic Bridges' }).click();
  await page.getByRole('button', { name: 'It is green', exact: true }).click();
  await page.getByRole('button', { name: 'Station board' }).click();
  await expect(page.getByText('2 wins saved', { exact: true })).toBeVisible();
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
  await expect(page.locator('.utility-button')).toHaveText('Open adult tools');
  await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Station controls' })).toBeVisible();
  await expect(page.getByLabel('Adult tools', { exact: true }).getByText(/MOSS-78-/)).toBeVisible();
  await expect(page.getByLabel('Adult tools', { exact: true }).getByRole('link', { name: 'Buy workshop bundle — ₹499' })).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/linux-learning-station/checkout');
  await expect(page.getByLabel('Legal').getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/privacy/');
});

test('activity footer opens working adult tools and returns focus on close', async ({ page }) => {
  await page.goto('/demo/activity/numbers');
  const open = page.getByRole('button', { name: 'Open adult tools', exact: true });
  await open.click();
  await expect(page.getByRole('heading', { name: 'Station controls' })).toBeVisible();
  await expect(page.locator('.print-sheet')).toHaveCount(1);
  await page.getByRole('button', { name: 'Close adult tools' }).click();
  await expect(open).toBeFocused();
});

test('@claim:offline-reload demo station completes and saves activity while fully offline after first visit', async ({ browser }) => {
  await withIsolatedPage(browser, async (page, context) => {
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
});

test('@claim:installable-pwa Chromium accepts the demo as an installable app', async ({ browser }) => {
  await withIsolatedPage(browser, async (page, context) => {
    await page.goto('/demo');
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.reload();
    await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);

    const session = await context.newCDPSession(page);
    const manifest = await session.send('Page.getAppManifest');
    const installability = await session.send('Page.getInstallabilityErrors');
    expect(manifest.errors).toEqual([]);
    expect(installability.installabilityErrors).toEqual([]);

    const data = JSON.parse(manifest.data ?? '{}');
    expect(data).toMatchObject({
      name: 'Linux Learning Station',
      start_url: '/?source=pwa&v=1.2.5',
      display: 'standalone',
    });
    expect(data.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ sizes: '192x192', purpose: 'any' }),
      expect.objectContaining({ sizes: '512x512', purpose: 'any maskable' }),
    ]));
  });
});

test('privacy and terms are real standalone pages', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.getByRole('heading', { level: 1, name: 'Privacy' })).toBeVisible();
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy — Linux Learning Station');
  await page.goto('/terms/');
  await expect(page.getByRole('heading', { level: 1, name: 'Terms' })).toBeVisible();
  await expect(page.getByText('You may install the station on devices you control')).toBeVisible();
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.locator('main')).not.toContainText(/Dodo|merchant of record|refund|charge reversal/i);
  await page.goto('/privacy/');
  await expect(page.locator('main')).not.toContainText(/Dodo|merchant of record|refund|charge reversal/i);
  await page.goto('/offline.html');
  await expect(page).toHaveTitle('Offline — Linux Learning Station');
  await expect(page.getByRole('heading', { level: 1, name: 'The station is offline' })).toBeVisible();
  await expect(page.locator('style, [style]')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Privacy' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
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

test('invalid activity routes return the designed 404 and sitemap lists every valid activity route', async ({ page, request }) => {
  for (const path of ['/activity/not-real', '/demo/activity/not-real']) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page).toHaveTitle('Page not found — Linux Learning Station');
    await expect(page.getByRole('heading', { name: 'This page was not found' })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://linux-learning-station.sociobot.in/404');
    await expect(page.locator('link[rel="canonical"]')).not.toHaveAttribute('href', new RegExp(path));
  }

  const sitemap = await (await request.get('/sitemap.xml')).text();
  const routes = ['patterns', 'keys', 'logic', 'spelling', 'numbers', 'drawing'];
  for (const id of routes) {
    expect(sitemap).toContain(`<loc>https://linux-learning-station.sociobot.in/activity/${id}</loc>`);
    expect(sitemap).toContain(`<loc>https://linux-learning-station.sociobot.in/demo/activity/${id}</loc>`);
  }
  const config = await (await request.get('/staticwebapp.config.json')).json() as { routes: Array<{ route: string }> };
  expect(config.routes.some(({ route }) => route === '/activity/*' || route === '/demo/activity/*')).toBe(false);
  for (const id of routes) {
    expect(config.routes.some(({ route }) => route === `/activity/${id}`)).toBe(true);
    expect(config.routes.some(({ route }) => route === `/demo/activity/${id}`)).toBe(true);
  }
});

test('demo board keeps all content visible at 200% text size on a 390px screen', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  await expect(page.getByLabel('Today: 2 points')).toContainText('Today2points');
  const geometry = await page.evaluate(() => {
    const stamp = document.querySelector('.today-stamp')!.getBoundingClientRect();
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      stampLeft: stamp.left,
      stampRight: stamp.right,
    };
  });
  expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
  expect(geometry.stampLeft).toBeGreaterThanOrEqual(0);
  expect(geometry.stampRight).toBeLessThanOrEqual(geometry.clientWidth);
});

test('demo entry and offline status reflect actual service-worker readiness', async ({ browser }) => {
  await withIsolatedPage(browser, async (page) => {
    await page.goto('/?demo=1');
    await expect(page.getByLabel('Demo mode')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Choose an activity' })).toBeVisible();
    await expect.poll(() => page.locator('#connection-status').textContent()).toMatch(/Ready offline|Online/);
    await page.reload();
    await expect.poll(() => page.locator('#connection-status').textContent()).toContain('Ready offline');
  });
});

test('@claim:demo-sandbox discards changed sample progress on exit and keeps it out of real data', async ({ browser }) => {
  await withIsolatedPage(browser, async (page, context) => {
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
  const storage = await page.evaluate(async () => {
    const names = (await indexedDB.databases()).map(({ name }) => name).filter(Boolean);
    const attempts = await new Promise<unknown[]>((resolve, reject) => {
      const open = indexedDB.open('linux-learning-station-demo');
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const database = open.result;
        const read = database.transaction('station').objectStore('station').get('attempts');
        read.onerror = () => reject(read.error);
        read.onsuccess = () => { database.close(); resolve(read.result as unknown[]); };
      };
    });
    return { names, attempts, localStorageKeys: Object.keys(localStorage), sessionStorageKeys: Object.keys(sessionStorage) };
  });
  expect(storage.names).toContain('linux-learning-station-demo');
  expect(storage.names).not.toContain('linux-learning-station');
  expect(storage.attempts).toHaveLength(4);
  expect(storage.localStorageKeys).toEqual([]);
  expect(storage.sessionStorageKeys).toEqual([]);
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

test('@claim:update-notice applies a real waiting service worker update and reloads under the new controller', async ({ browser }) => {
  await withIsolatedPage(browser, async (page) => {
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
});

test('@claim:paid-bundle verified license provides five rounds and detailed printouts', async ({ browser }) => {
  await withIsolatedPage(browser, async (page) => {
    let checks = 0;
    await page.route('https://api.sociobot.in/api/v1/products/linux-learning-station/verify?license=test-license', async (route) => {
      checks += 1;
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true}' });
    });
    await page.goto('/demo');
    await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
    await page.getByLabel('Paste license token').fill('test-license');
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('heading', { name: 'Workshop bundle unlocked' })).toBeVisible();
    expect(checks).toBe(1);
    await page.getByRole('button', { name: 'Close adult tools' }).click();
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
});

test('@claim:license-local-storage restoring through Adult tools keeps only the token and verdict in browser license storage', async ({ browser }) => {
  const token = 'local-storage-test-token';
  await withIsolatedPage(browser, async (page) => {
    await page.route(`https://api.sociobot.in/api/v1/products/linux-learning-station/verify?license=${token}`, async (route) => route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true}' }));
    await page.goto('/demo');
    await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
    await page.getByLabel('Paste license token').fill(token);
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('heading', { name: 'Workshop bundle unlocked' })).toBeVisible();

    const stored = await page.evaluate(async (expectedToken) => {
      const tokenKey = 'sb_license:linux-learning-station';
      const verdictKey = 'sb_license_verdict:linux-learning-station';
      const verdict = JSON.parse(localStorage.getItem(verdictKey) ?? 'null') as { valid?: boolean; checkedAt?: number } | null;
      const databaseNames = (await indexedDB.databases()).map(({ name }) => name).filter(Boolean);
      const databaseText = await new Promise<string>((resolve, reject) => {
        const open = indexedDB.open('linux-learning-station-demo');
        open.onerror = () => reject(open.error);
        open.onsuccess = () => {
          const database = open.result;
          const read = database.transaction('station').objectStore('station').getAll();
          read.onerror = () => reject(read.error);
          read.onsuccess = () => { database.close(); resolve(JSON.stringify(read.result)); };
        };
      });
      return {
        token: localStorage.getItem(tokenKey),
        verdict,
        licenseKeys: Object.keys(localStorage).filter((key) => key.startsWith('sb_license')),
        sessionKeys: Object.keys(sessionStorage),
        databaseNames,
        databaseContainsToken: databaseText.includes(expectedToken),
      };
    }, token);
    expect(stored.token).toBe(token);
    expect(stored.verdict?.valid).toBe(true);
    expect(stored.verdict?.checkedAt).toEqual(expect.any(Number));
    expect(stored.licenseKeys.sort()).toEqual(['sb_license:linux-learning-station', 'sb_license_verdict:linux-learning-station']);
    expect(stored.sessionKeys).toEqual([]);
    expect(stored.databaseNames).toContain('linux-learning-station-demo');
    expect(stored.databaseContainsToken).toBe(false);
  });
});

test('@claim:license-request-privacy restoring a license sends only its token and no learning progress', async ({ browser }) => {
  const token = 'opaque-restore-token';
  const requests: import('@playwright/test').Request[] = [];
  await withIsolatedPage(browser, async (page) => {
    await page.route('https://api.sociobot.in/api/v1/products/linux-learning-station/verify**', async (route) => {
      requests.push(route.request());
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true}' });
    });
    await page.goto('/demo');
    await expect(page.getByText('2 wins saved')).toBeVisible();
    await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
    await page.getByLabel('Paste license token').fill(token);
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('heading', { name: 'Workshop bundle unlocked' })).toBeVisible();

    expect(requests).toHaveLength(1);
    const sent = requests[0];
    const url = new URL(sent.url());
    expect(sent.method()).toBe('GET');
    expect(sent.postData()).toBeNull();
    expect(url.origin).toBe('https://api.sociobot.in');
    expect(url.pathname).toBe('/api/v1/products/linux-learning-station/verify');
    expect([...url.searchParams.entries()]).toEqual([['license', token]]);
    expect(sent.headers()['cookie']).toBeUndefined();
    expect(decodeURIComponent(url.search).toLowerCase()).not.toMatch(/age|answer|drawing|progress|attempt|activity/);
  });
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

test('@claim:checkout-purchase recorded hosted offer proves ₹499 one-time checkout and accepts the returned license', async ({ browser }) => {
  const fixture = JSON.parse(await readFile('tests/fixtures/checkout-session.json', 'utf8')) as {
    schemaVersion: number;
    productSlug: string;
    checkoutEndpoint: string;
    returnPathTemplate: string;
    offer: { currency: string; amountMinor: number; billing: string };
    response: { status: number; contentType: string; body: string };
  };
  const checkoutRequests: import('@playwright/test').Request[] = [];
  const token = 'returned-checkout-license';
  await withIsolatedPage(browser, async (page) => {
    expect(fixture).toMatchObject({
      schemaVersion: 1,
      productSlug: 'linux-learning-station',
      checkoutEndpoint: 'https://api.sociobot.in/api/v1/products/linux-learning-station/checkout',
      offer: { currency: 'INR', amountMinor: 49900, billing: 'one_time' },
    });
    const checkoutBody = fixture.response.body.replaceAll(
      '{{RETURN_URL}}',
      `${TEST_BASE_URL}${fixture.returnPathTemplate.replace('{{LICENSE_TOKEN}}', token)}`,
    );
    await page.route(fixture.checkoutEndpoint, async (route) => {
      checkoutRequests.push(route.request());
      await route.fulfill({ status: fixture.response.status, contentType: fixture.response.contentType, body: checkoutBody });
    });
    await page.goto('/');
    await expect(page.getByText('Optional bundle: ₹499 once', { exact: true })).toBeVisible();
    const buy = page.getByRole('link', { name: 'Buy workshop bundle — ₹499' });
    await expect(buy).toHaveAttribute('href', fixture.checkoutEndpoint);
    await buy.click();
    await expect(page).toHaveURL(fixture.checkoutEndpoint);
    await expect(page.getByRole('heading', { name: 'Workshop bundle checkout' })).toBeVisible();
    await expect(page.getByText('₹499', { exact: true })).toBeVisible();
    await expect(page.getByText('One-time purchase', { exact: true })).toBeVisible();
    await expect(page.getByText('No recurring charge', { exact: true })).toBeVisible();
    expect(checkoutRequests).toHaveLength(1);
    expect(checkoutRequests[0].method()).toBe('GET');
    expect(checkoutRequests[0].postData()).toBeNull();
    expect(new URL(checkoutRequests[0].url()).search).toBe('');
    expect(checkoutRequests[0].headers()['cookie']).toBeUndefined();

    await page.route(`https://api.sociobot.in/api/v1/products/linux-learning-station/verify?license=${token}`, async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true}' });
    });
    await page.getByRole('link', { name: 'Complete recorded purchase' }).click();
    await expect(page).toHaveURL('/demo');
    await expect.poll(() => page.evaluate(() => localStorage.getItem('sb_license:linux-learning-station'))).toBe(token);
    await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Workshop bundle unlocked' })).toBeVisible();
  });
});

test('@claim:daily-license-check verifies a stored license no more than once per day', async ({ browser }) => {
  let checks = 0;
  await withIsolatedPage(browser, async (page) => {
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

test('regression: back and forward leave activity answers stable for immediate input', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Choose an activity' })).toBeFocused();
  await page.goForward();
  await expect(page.getByRole('heading', { name: 'Pattern Quarry' })).toBeFocused();
  await expect(page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).resolves.toBe('auto');
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await expect(page.getByRole('heading', { name: 'Good noticing!' })).toBeVisible();
});

test('regression: blocked IndexedDB recovery reloads without inline script', async ({ browser }) => {
  await withIsolatedPage(browser, async (page) => {
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
  await scan();
  await page.goto('/demo/activity/numbers'); await scan();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/privacy/'); await scan();
  await page.goto('/terms/'); await scan();
  await page.goto('/offline.html'); await scan();
  await page.goto('/not-a-real-route'); await scan();
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

test('regression: corrupt cached license verdict cannot block startup', async ({ browser }) => {
  await withIsolatedPage(browser, async (page) => {
    await page.addInitScript(() => {
      localStorage.setItem('sb_license:linux-learning-station', 'sample-token');
      localStorage.setItem('sb_license_verdict:linux-learning-station', '{bad json');
    });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Start offline learning activities' })).toBeVisible();
  });
});

test('regression: an isolated reload context tears down without closing the shared browser', async ({ browser }) => {
  await withIsolatedPage(browser, async (page) => {
    await page.goto('/demo');
    await page.reload();
    await expect(page.getByRole('heading', { name: 'Choose an activity' })).toBeVisible();
  });

  expect(browser.isConnected()).toBe(true);
  await withIsolatedPage(browser, async (page) => {
    await page.route('https://api.sociobot.in/api/v1/products/linux-learning-station/verify?license=post-reload-license', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true}' });
    });
    await page.goto('/demo');
    await page.getByRole('button', { name: 'Adult tools', exact: true }).click();
    await page.getByLabel('Paste license token').fill('post-reload-license');
    await page.getByRole('button', { name: 'Verify license' }).click();
    await expect(page.getByRole('heading', { name: 'Workshop bundle unlocked' })).toBeVisible();
  });
  expect(browser.isConnected()).toBe(true);
});
