import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseURL = process.env.VERIFY_URL ?? 'https://linux-learning-station.sociobot.in';
const evidenceDir = '.factory/polish-2-live';
const activityNames = ['Pattern Quarry', 'Key Trail', 'Logic Bridges', 'Word Workshop', 'Number Stones', 'Moss Sketchbook'];
await mkdir(evidenceDir, { recursive: true });

const browser = await chromium.launch();
const report = { baseURL, checkedAt: new Date().toISOString(), consoleErrors: [], requests: [], checks: {} };

async function axeSerious(page, route) {
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''));
  assert.deepEqual(violations, [], `${route} has serious or critical axe violations`);
  report.checks[`axe:${route}`] = 0;
}

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  page.on('console', (message) => { if (message.type() === 'error') report.consoleErrors.push(message.text()); });
  page.on('pageerror', (error) => report.consoleErrors.push(String(error)));
  page.on('request', (request) => report.requests.push(request.url()));

  await page.goto(baseURL, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('h1').textContent(), 'Start offline learning activities');
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('main').count(), 1);
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  assert.equal(await page.title(), 'Linux Learning Station — offline activities for ages 5–10');
  assert.equal(await page.getByRole('button', { name: 'Try it with sample data' }).isVisible(), true);
  const factBox = await page.locator('.fact-list').boundingBox();
  assert.ok(factBox && factBox.y + factBox.height <= 844, 'first-screen facts must fit in the mobile viewport');
  await axeSerious(page, '/');
  await page.screenshot({ path: `${evidenceDir}/live-cold-mobile.png`, fullPage: true });

  await page.getByRole('button', { name: 'Try it with sample data' }).click();
  assert.match(page.url(), /\?demo=1$/);
  await page.getByLabel('Demo mode').waitFor();
  assert.equal(await page.getByLabel('Demo mode').getByRole('button', { name: 'Reset demo' }).isVisible(), true);
  assert.equal(await page.getByText('2 wins saved').isVisible(), true);
  const labels = await page.locator('.slab-action span:first-child').allTextContents();
  assert.deepEqual(labels, activityNames.map((name) => `Start ${name}`));
  const targets = await page.locator('button, a').evaluateAll((nodes) => nodes.filter((node) => {
    const style = getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden' && node.getBoundingClientRect().width > 0;
  }).map((node) => ({ text: node.textContent?.trim(), width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
  assert.equal(targets.every(({ width, height }) => width >= 44 && height >= 44), true, JSON.stringify(targets.filter(({ width, height }) => width < 44 || height < 44)));
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${baseURL}/demo`);
  await axeSerious(page, '/?demo=1');
  await page.screenshot({ path: `${evidenceDir}/live-demo-mobile.png`, fullPage: true });

  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Pattern Quarry' }).evaluate((node) => node === document.activeElement), true);
  assert.equal(await page.getByLabel('Demo mode').isVisible(), true);
  assert.equal(await page.title(), 'Pattern Quarry — Linux Learning Station');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${baseURL}/demo/activity/patterns`);
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await page.getByRole('button', { name: 'Station board' }).click();
  assert.equal(await page.getByText('3 wins saved').isVisible(), true);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL(`${baseURL}/`);
  await page.getByRole('heading', { name: 'Start offline learning activities' }).waitFor();
  await page.goto(`${baseURL}/demo`);
  assert.equal(await page.getByText('2 wins saved').isVisible(), true);

  await page.goto(`${baseURL}/terms/`);
  assert.equal(await page.getByText('You may install the station on devices you control').isVisible(), true);
  assert.equal(await page.title(), 'Terms — Linux Learning Station');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${baseURL}/terms/`);
  await axeSerious(page, '/terms/');

  await page.goto(`${baseURL}/privacy/`);
  assert.equal(await page.title(), 'Privacy — Linux Learning Station');
  await axeSerious(page, '/privacy/');

  const notFoundResponse = await page.goto(`${baseURL}/not-a-station-route`);
  assert.equal(notFoundResponse?.status(), 404);
  assert.equal(await page.title(), 'Page not found — Linux Learning Station');
  assert.equal(await page.getByRole('link', { name: 'Privacy' }).isVisible(), true);
  assert.equal(await page.getByRole('link', { name: 'Terms' }).isVisible(), true);
  await axeSerious(page, '/404');

  const externalRequests = report.requests.filter((url) => new URL(url).origin !== new URL(baseURL).origin);
  assert.deepEqual(externalRequests, []);
  report.checks.mobileActions = labels;
  report.checks.minimumTarget = targets.reduce((minimum, target) => Math.min(minimum, target.width, target.height), Infinity);
  report.checks.demoIsolation = '2 wins → 3 wins → exit → 2 wins';
  report.checks.externalRequests = externalRequests;
  await context.close();

  const installContext = await browser.newContext();
  const installPage = await installContext.newPage();
  await installPage.goto(`${baseURL}/demo`);
  await installPage.evaluate(() => navigator.serviceWorker.ready);
  await installPage.reload();
  await installPage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  const session = await installContext.newCDPSession(installPage);
  const manifest = await session.send('Page.getAppManifest');
  const installability = await session.send('Page.getInstallabilityErrors');
  assert.deepEqual(manifest.errors, []);
  assert.deepEqual(installability.installabilityErrors, []);
  report.checks.installabilityErrors = installability.installabilityErrors;
  await installContext.close();

  const offlineContext = await browser.newContext();
  const offlinePage = await offlineContext.newPage();
  await offlinePage.goto(`${baseURL}/?demo=1`);
  await offlinePage.evaluate(() => navigator.serviceWorker.ready);
  await offlinePage.reload();
  await offlinePage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  await offlineContext.setOffline(true);
  await offlinePage.reload();
  assert.equal(await offlinePage.getByRole('heading', { name: 'Choose an activity' }).isVisible(), true);
  await offlinePage.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  await offlinePage.locator('[data-action="answer-option"][data-value="●"]').click();
  await offlinePage.getByRole('button', { name: 'Station board' }).click();
  assert.equal(await offlinePage.getByText('3 wins saved').isVisible(), true);
  report.checks.offlineActivity = 'passed';
  await offlineContext.close();

  assert.deepEqual(report.consoleErrors, []);
  report.checks.status = 'passed';
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/live-check.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
