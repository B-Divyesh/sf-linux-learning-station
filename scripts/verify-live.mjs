import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseURL = process.env.VERIFY_URL ?? 'https://linux-learning-station.sociobot.in';
const canonicalBase = 'https://linux-learning-station.sociobot.in';
const evidenceDir = '.factory/repair-4-live';
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

async function completeCoreSessions(page) {
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
      assert.equal(await page.getByText(`Round ${round + 1} / 3`).isVisible(), true);
      if (activity.kind === 'typing') {
        await page.getByLabel('Your typing').fill(activity.answers[round]);
        await page.getByRole('button', { name: 'Check typing' }).click();
      } else if (activity.kind === 'spelling') {
        await page.getByLabel('Build the word').fill(activity.answers[round]);
        await page.getByRole('button', { name: 'Check word' }).click();
      } else {
        await page.getByRole('button', { name: activity.answers[round], exact: true }).click();
      }
      await page.getByRole('button', { name: round === 2 ? 'Finish session' : 'Next round' }).click();
    }
    await page.getByRole('heading', { name: '30 points saved' }).waitFor();
    await page.getByRole('button', { name: 'Station board' }).click();
  }
  await page.getByRole('button', { name: 'Start Moss Sketchbook' }).click();
  assert.equal(await page.locator('.round-meter').count(), 0);
  await page.getByRole('button', { name: 'Add dot' }).click();
  await page.getByRole('button', { name: 'Save this drawing session' }).click();
  await page.getByRole('heading', { name: '10 points saved' }).waitFor();
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
  const checkoutHref = await page.getByRole('link', { name: 'Buy workshop bundle — ₹499' }).getAttribute('href');
  assert.equal(checkoutHref, 'https://api.sociobot.in/api/v1/products/linux-learning-station/checkout');
  const checkoutResponse = await context.request.get(checkoutHref, { maxRedirects: 0 });
  assert.equal(checkoutResponse.status(), 303);
  assert.equal(new URL(checkoutResponse.headers().location).origin, 'https://checkout.dodopayments.com');
  report.checks.checkout = 'visible ₹499 action → Sociobot endpoint → 303 hosted Dodo checkout';
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
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${canonicalBase}/demo`);
  await axeSerious(page, '/?demo=1');
  await page.screenshot({ path: `${evidenceDir}/live-demo-mobile.png`, fullPage: true });
  await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
  const resizeGeometry = await page.evaluate(() => {
    const stamp = document.querySelector('.today-stamp').getBoundingClientRect();
    return { clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth, stampLeft: stamp.left, stampRight: stamp.right };
  });
  assert.ok(resizeGeometry.scrollWidth <= resizeGeometry.clientWidth, JSON.stringify(resizeGeometry));
  assert.ok(resizeGeometry.stampLeft >= 0 && resizeGeometry.stampRight <= resizeGeometry.clientWidth, JSON.stringify(resizeGeometry));
  await page.screenshot({ path: `${evidenceDir}/live-demo-200-percent.png` });
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  report.checks.textResize = resizeGeometry;

  await page.getByRole('button', { name: 'Start Pattern Quarry' }).click();
  assert.equal(await page.getByRole('heading', { name: 'Pattern Quarry' }).evaluate((node) => node === document.activeElement), true);
  assert.equal(await page.getByLabel('Demo mode').isVisible(), true);
  assert.equal(await page.title(), 'Pattern Quarry — Linux Learning Station');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${canonicalBase}/demo/activity/patterns`);
  await page.goBack();
  await page.getByRole('heading', { name: 'Choose an activity' }).waitFor();
  await page.waitForFunction(() => document.activeElement === document.querySelector('main h1'));
  assert.equal(await page.getByRole('heading', { name: 'Choose an activity' }).evaluate((node) => node === document.activeElement), true);
  await page.goForward();
  await page.getByRole('heading', { name: 'Pattern Quarry' }).waitFor();
  await page.waitForFunction(() => document.activeElement === document.querySelector('main h1'));
  assert.equal(await page.getByRole('heading', { name: 'Pattern Quarry' }).evaluate((node) => node === document.activeElement), true);
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  await page.locator('[data-action="answer-option"][data-value="●"]').click();
  await page.getByRole('button', { name: 'Station board' }).click();
  assert.equal(await page.getByText('3 wins saved').isVisible(), true);
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.waitForURL(`${baseURL}/`);
  await page.getByRole('heading', { name: 'Start offline learning activities' }).waitFor();
  await page.goto(`${baseURL}/demo`);
  assert.equal(await page.getByText('2 wins saved').isVisible(), true);

  await page.goto(`${baseURL}/activity/patterns`);
  assert.equal(await page.getByRole('heading', { name: 'Start offline learning activities' }).isVisible(), true);
  await page.getByRole('button', { name: /Start activities for ages\s+7.8/ }).click();
  await page.waitForURL(`${baseURL}/activity/patterns`);
  await page.getByRole('heading', { name: 'Pattern Quarry' }).waitFor();
  assert.equal(await page.title(), 'Pattern Quarry — Linux Learning Station');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${canonicalBase}/activity/patterns`);
  report.checks.realDeepLink = 'setup preserved /activity/patterns';

  await page.goto(`${baseURL}/terms/`);
  assert.equal(await page.getByText('You may install the station on devices you control').isVisible(), true);
  assert.equal(await page.title(), 'Terms — Linux Learning Station');
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${canonicalBase}/terms/`);
  await axeSerious(page, '/terms/');
  const termsText = await page.locator('main').innerText();
  assert.match(termsText, /Sociobot and Dodo handle checkout, payment, and refunds/i);
  assert.match(termsText, /refunded purchase no longer has an active license/i);

  await page.goto(`${baseURL}/privacy/`);
  assert.equal(await page.title(), 'Privacy — Linux Learning Station');
  const privacyText = await page.locator('main').innerText();
  assert.match(privacyText, /sends only that token/i);
  assert.match(privacyText, /does not send age range, answers, drawings, or progress to checkout/i);
  await axeSerious(page, '/privacy/');

  assert.deepEqual(report.consoleErrors, []);
  for (const invalidPath of ['/activity/not-real', '/demo/activity/not-real']) {
    const invalidResponse = await page.goto(`${baseURL}${invalidPath}`);
    assert.equal(invalidResponse?.status(), 404);
    assert.equal(await page.title(), 'Page not found — Linux Learning Station');
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), `${canonicalBase}/404`);
  }
  const notFoundResponse = await page.goto(`${baseURL}/not-a-station-route`);
  assert.equal(notFoundResponse?.status(), 404);
  assert.equal(await page.title(), 'Page not found — Linux Learning Station');
  assert.ok(await page.getByRole('link', { name: 'Privacy' }).count() >= 1);
  assert.ok(await page.getByRole('link', { name: 'Terms' }).count() >= 1);
  await axeSerious(page, '/404');
  report.consoleErrors = report.consoleErrors.filter((message) => !/Failed to load resource: the server responded with a status of 404/.test(message));

  const sitemap = await (await context.request.get(`${baseURL}/sitemap.xml`)).text();
  for (const id of ['patterns', 'keys', 'logic', 'spelling', 'numbers', 'drawing']) {
    assert.match(sitemap, new RegExp(`<loc>${canonicalBase}/activity/${id}</loc>`));
    assert.match(sitemap, new RegExp(`<loc>${canonicalBase}/demo/activity/${id}</loc>`));
  }
  report.checks.invalidActivityRoutes = '404 with designed metadata';
  report.checks.sitemap = 'all 12 activity routes listed';

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

  const sessionContext = await browser.newContext();
  const sessionPage = await sessionContext.newPage();
  await sessionPage.goto(`${baseURL}/demo`);
  await completeCoreSessions(sessionPage);
  report.checks.sessionShape = 'five guided × three rounds; one saved drawing';
  await sessionContext.close();

  const licenseContext = await browser.newContext();
  const licensePage = await licenseContext.newPage();
  const licenseRequests = [];
  await licensePage.route('https://api.sociobot.in/api/v1/products/linux-learning-station/verify**', async (route) => {
    licenseRequests.push(route.request());
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"valid":true}' });
  });
  await licensePage.goto(`${baseURL}/demo`);
  await licensePage.getByRole('button', { name: 'Adult tools', exact: true }).click();
  await licensePage.getByLabel('Paste license token').fill('live-restore-fixture');
  await licensePage.getByRole('button', { name: 'Verify license' }).click();
  await licensePage.getByRole('heading', { name: 'Workshop bundle unlocked' }).waitFor();
  assert.equal(licenseRequests.length, 1);
  const licenseURL = new URL(licenseRequests[0].url());
  assert.equal(licenseRequests[0].method(), 'GET');
  assert.equal(licenseRequests[0].postData(), null);
  assert.deepEqual([...licenseURL.searchParams.entries()], [['license', 'live-restore-fixture']]);
  const savedLicense = await licensePage.evaluate(() => ({
    token: localStorage.getItem('sb_license:linux-learning-station'),
    verdict: JSON.parse(localStorage.getItem('sb_license_verdict:linux-learning-station') ?? 'null'),
  }));
  assert.equal(savedLicense.token, 'live-restore-fixture');
  assert.equal(savedLicense.verdict.valid, true);
  await axeSerious(licensePage, '/demo adult tools after restore');
  report.checks.licenseRestore = 'visible form → token-only request → local token/verdict → unlocked';
  await licenseContext.close();

  assert.deepEqual(report.consoleErrors, []);
  report.checks.status = 'passed';
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/live-check.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
