import './style.css';
import { activities, activityName, AGE_BANDS, keyPhrases, logicRounds, numberRounds, patternRounds, spellingRounds } from './data';
import { clearStation, discardDemoStation, loadStation, replaceStation, saveAttempt, saveSettings, validateImport } from './db';
import { cachedLicense, captureLicense, checkLicense, CHECKOUT_URL, storeLicense, type LicenseState } from './license';
import { activeDays, progressCode, todayPoints } from './progress';
import { appPath, isDemoMode } from './mode';
import type { ActivityId, AgeBand, Attempt, StationData } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
let station: StationData;
let license: LicenseState = { unlocked: false, checking: false, notice: '' };
let adultOpen = false;
let installPrompt: Event | null = null;
let feedback = '';
let activityState: { id: ActivityId; round: number; score: number; result?: { correct: boolean; answer: string } } | null = null;
let routeMessage = '';
let offlineReady = false;
const BUILD_VERSION = 'v1.2.4';
const SITE_URL = 'https://linux-learning-station.sociobot.in';

const esc = (value: string) => value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);

function route(): { page: 'home' | 'activity'; id?: ActivityId } {
  const prefix = isDemoMode() ? '/demo' : '';
  const match = location.pathname.match(new RegExp(`^${prefix}/activity/(patterns|keys|logic|spelling|numbers|drawing)$`));
  return match ? { page: 'activity', id: match[1] as ActivityId } : { page: 'home' };
}

function navigate(path: string, message: string): void {
  history.pushState({}, '', appPath(path));
  routeMessage = message;
  render(true);
}

function footer(): string {
  return `<footer class="site-footer"><p>Six local activities for shared Linux computers. <a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a> · Built by Param Factory · ${BUILD_VERSION}</p>${station.settings.setupDone ? '<button class="text-button" data-action="toggle-adult">Open adult tools</button>' : ''}</footer>`;
}

function shell(content: string, page = 'home'): string {
  return `
    <header class="site-header screen-only">
      <a class="brand" href="${appPath('/')}" data-action="home" aria-label="Linux Learning Station home">
        <img src="/assets/station-mark.svg" width="44" height="44" alt="" />
        <span>Linux Learning Station</span>
      </a>
      <nav class="site-nav" aria-label="Primary navigation"><a href="/demo">Demo</a><a href="/privacy/">Privacy</a></nav>
      <div class="status-chips" aria-label="Station status">
        <span class="status-chip" id="connection-status"><span class="status-dot" aria-hidden="true"></span>${navigator.onLine ? (offlineReady ? 'Ready offline' : 'Online') : 'Offline'}</span>
        ${page === 'home' ? '<button class="utility-button" data-action="toggle-adult" aria-expanded="' + adultOpen + '">Adult tools</button>' : ''}
      </div>
    </header>
    <main id="main">${content}</main>
    <div id="announcer" class="sr-only" aria-live="polite" aria-atomic="true">${esc(feedback)}</div>
    <div id="update-toast" class="toast" hidden><span>A fresh station update is ready.</span><button data-action="apply-update">Update now</button></div>
  `;
}

function setupView(): string {
  return shell(`
    <section class="setup-grid">
      <div class="setup-copy">
        <p class="eyebrow">Offline activities for shared Linux computers</p>
        <h1 tabindex="-1">Start offline learning activities</h1>
        <p class="lede">For parents and teachers setting up a shared computer for children aged 5–10.</p>
        <button class="button primary demo-button" data-action="try-demo">Try it with sample data</button>
        <p class="action-note">Opens all six activities with ages 7–8 sample progress. Nothing is saved to your real station.</p>
        <ul class="fact-list" aria-label="Key facts"><li>Six core activities are free</li><li>Progress stays on this computer</li><li>Works offline after the first visit</li><li>Optional bundle: ₹499 once</li></ul>
        <fieldset class="age-picker">
          <legend>Choose an age range</legend>
          ${AGE_BANDS.map((age) => `<button class="age-slab" data-action="finish-setup" data-age="${age}"><span>Start activities for ages</span><strong>${age}</strong><small>Open the station board</small></button>`).join('')}
        </fieldset>
      </div>
      <figure class="hero-figure">
        <img src="/assets/station-hero.webp" width="1200" height="800" alt="A rugged concrete computer desk with moss, a keyboard, paper objects, and a blank screen" fetchpriority="high" decoding="async" />
        <figcaption>Patterns, typing, logic, spelling, numbers, and drawing.</figcaption>
      </figure>
    </section>
    <section class="landing-section how-section" aria-labelledby="how-heading">
      <p class="eyebrow">Three steps</p><h2 id="how-heading">How it works</h2>
      <ol class="step-list"><li><strong>Choose an age range.</strong><span>Pick ages 5–6, 7–8, or 9–10.</span></li><li><strong>Start any activity.</strong><span>Five guided activities have three short rounds. Drawing is one open session.</span></li><li><strong>Keep progress locally.</strong><span>Adults can print, export, import, or erase it.</span></li></ol>
    </section>
    <section class="landing-section limits-section" aria-labelledby="privacy-heading">
      <div><p class="eyebrow">Privacy</p><h2 id="privacy-heading">No child account or tracking</h2><p>The station does not send activity progress to us. It has no ads, chat, cloud profile, or third-party scripts.</p><a href="/privacy/">Read the privacy details</a></div>
      <div class="price-slab"><p class="eyebrow">Optional bundle</p><h2>Optional activity bundle — ₹499 once</h2><p>Adds five-round sessions and detailed printouts. Every core activity stays free.</p><a class="button primary" href="${CHECKOUT_URL}" rel="external">Buy workshop bundle — ₹499</a><p class="quiet checkout-note">Opens secure Sociobot checkout. After payment, return here to use the bundle.</p><p>Already bought it? Restore the license in Adult tools.</p></div>
    </section>
    ${footer()}
  `, 'setup');
}

function demoBanner(): string {
  return isDemoMode() ? `<aside class="demo-banner" aria-label="Demo mode"><strong>Demo — sample data, nothing is saved</strong><span>Try every activity safely.</span><div><button class="text-button" data-action="reset-demo">Reset demo</button><button class="text-button" data-action="start-real">Start for real</button></div></aside>` : '';
}

function progressSummary(): { done: number; days: number; points: number; code: string } {
  return {
    done: station.attempts.filter((attempt) => attempt.correct).length,
    days: activeDays(station.attempts),
    points: todayPoints(station.attempts),
    code: progressCode(station.settings.ageBand, station.attempts),
  };
}

function adultPanel(): string {
  const summary = progressSummary();
  return `
    <aside class="adult-panel ${adultOpen ? 'is-open' : ''}" aria-label="Adult tools" ${adultOpen ? '' : 'hidden'}>
      <div class="adult-head"><div><p class="eyebrow">For a grown-up</p><h2>Station controls</h2></div><button class="icon-button" data-action="toggle-adult" aria-label="Close adult tools">×</button></div>
      ${feedback ? `<p class="feedback-banner" role="status">${esc(feedback)}</p>` : ''}
      <section><h3>Age range</h3><div class="segmented" role="group" aria-label="Age range">${AGE_BANDS.map((age) => `<button data-action="set-age" data-age="${age}" aria-pressed="${station.settings.ageBand === age}">${age}${station.settings.ageBand === age ? '<span class="sr-only"> selected</span>' : ''}</button>`).join('')}</div></section>
      <section><h3>Progress that stays here</h3><div class="mini-stats"><span><strong>${summary.done}</strong> wins</span><span><strong>${summary.days}</strong> days</span><span><strong>${summary.points}</strong> points today</span></div><p class="code-label">Printable progress code <strong>${summary.code}</strong></p><div class="button-row"><button class="button secondary" data-action="print">Print progress</button><button class="button secondary" data-action="export">Export data</button><input id="import-file" class="file-input" type="file" accept="application/json" /><label for="import-file" class="button secondary file-button">Import data</label></div></section>
      <section class="bundle-box"><span class="bundle-tab">Optional bundle</span><h3>${license.unlocked ? 'Workshop bundle unlocked' : 'Workshop bundle'}</h3>${license.unlocked ? '<p>Thank you. Extended five-round sessions and detailed printouts are ready.</p>' : `<p>₹499 one time. Adds extended five-round practice and detailed printable week sheets. Every core activity stays free.</p><a class="button primary" href="${CHECKOUT_URL}" rel="external">Buy workshop bundle — ₹499</a><p class="quiet checkout-note">Opens secure Sociobot checkout in this tab. An internet connection is required.</p><details open><summary>Have a license?</summary><form id="license-form"><label for="license-token">Paste license token</label><div class="input-row"><input id="license-token" name="token" autocomplete="off" required /><button class="button secondary" type="submit">Verify license</button></div></form></details>`}<p class="quiet">${license.notice ? `${esc(license.notice)} ` : ''}For purchase help, email <a href="mailto:support@sociobot.in">support@sociobot.in</a>.</p></section>
      <section><h3>Install & data</h3><p>After the first visit, activities and saved progress work without internet.</p><button class="button secondary" data-action="install" ${installPrompt ? '' : 'disabled'}>${installPrompt ? 'Install this station' : 'Install from your browser menu'}</button><button class="text-button danger" data-action="confirm-reset">Erase progress on this computer</button></section>
      <nav class="legal-links" aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
    </aside>
    <dialog id="reset-dialog"><form method="dialog"><h2>Erase all local progress?</h2><p>This removes every activity result and restores setup. Export first if you may need it.</p><div class="button-row"><button class="button secondary" value="cancel">Keep progress</button><button class="button danger-button" value="erase" data-action="reset">Erase progress</button></div></form></dialog>
  `;
}

function homeView(): string {
  const summary = progressSummary();
  const recent = [...station.attempts].reverse().find((attempt) => attempt.correct);
  const content = `
    <div class="station-layout screen-only">
      <section class="intro-block">
        <div><p class="eyebrow">Ages ${station.settings.ageBand} · ${navigator.onLine ? 'saved on this computer' : 'working offline'}</p><h1 tabindex="-1">Choose an activity</h1><p class="lede">Short activities. Clear endings. Pick any slab to begin.</p></div>
        <div class="today-stamp" aria-label="Today: ${summary.points} points"><span>Today</span><strong>${summary.points}</strong><small>points</small></div>
      </section>
      ${station.attempts.length === 0 ? '<section class="empty-note"><span aria-hidden="true">↳</span><p><strong>A fresh station.</strong> Pick any activity. The first win will appear here — no account needed.</p></section>' : `<section class="return-note"><span aria-hidden="true">✓</span><p><strong>Welcome back.</strong> Last win: ${recent ? esc(activityName(recent.activity)) : 'keep exploring'}.</p><span>${summary.done} ${summary.done === 1 ? 'win' : 'wins'} saved</span></section>`}
      <section class="activity-board" aria-labelledby="activity-heading"><h2 id="activity-heading" class="sr-only">Learning activities</h2>
        ${activities.map((item, index) => `<article class="activity-slab tone-${item.tone}">
          ${index === station.attempts.length % activities.length ? '<span class="next-tab">Try next</span>' : ''}
          <div class="activity-number" aria-hidden="true">0${index + 1}</div>
          <div class="activity-symbol" aria-hidden="true">${item.symbol}</div>
          <p class="kicker">${item.kicker}</p><h3>${item.title}</h3><p>${item.description}</p>
          <button class="slab-action" data-action="open-activity" data-id="${item.id}"><span>Start ${item.title}</span><span aria-hidden="true">→</span></button>
        </article>`).join('')}
      </section>
      ${footer()}
      ${adultPanel()}
    </div>
    ${printSheet()}
  `;
  return shell(`${demoBanner()}${content}`);
}

function printSheet(): string {
  const summary = progressSummary();
  const byActivity = activities.map((item) => ({ title: item.title, count: station.attempts.filter((attempt) => attempt.activity === item.id && attempt.correct).length }));
  const details = license.unlocked ? `<h3>Recent practice</h3><ul>${station.attempts.slice(-10).reverse().map((item) => `<li>${activityName(item.activity)} — ${esc(item.detail)} — ${new Date(item.createdAt).toLocaleDateString()}</li>`).join('') || '<li>No practice yet.</li>'}</ul>` : '';
  return `<section class="print-sheet"><p class="eyebrow">Linux Learning Station</p><h2>Progress field note</h2><p>Age range: ${station.settings.ageBand}</p><div class="print-code">${summary.code}</div><p>${summary.days} active day${summary.days === 1 ? '' : 's'} · ${summary.done} successful rounds</p><table><thead><tr><th>Activity</th><th>Wins</th></tr></thead><tbody>${byActivity.map((item) => `<tr><td>${item.title}</td><td>${item.count}</td></tr>`).join('')}</tbody></table>${details}<p class="print-date">Printed ${new Date().toLocaleDateString()}</p></section>`;
}

function roundCount(): number { return license.unlocked ? 5 : 3; }

function optionButtons(options: string[]): string {
  return `<div class="answer-grid">${options.map((option) => `<button class="answer-button" data-action="answer-option" data-value="${esc(option)}">${esc(option)}</button>`).join('')}</div>`;
}

function activityTask(id: ActivityId, round: number): string {
  const age = station.settings.ageBand;
  const result = activityState?.result;
  if (result) return `<div class="result-panel ${result.correct ? 'correct' : 'try-again'}" role="status"><span class="result-mark" aria-hidden="true">${result.correct ? '✓' : '↗'}</span><h2>${result.correct ? 'Good noticing!' : 'A useful try'}</h2><p>${result.correct ? 'That fits.' : `The answer is ${esc(result.answer)}.`}</p><button class="button primary" data-action="next-round">${round + 1 >= roundCount() ? 'Finish session' : 'Next round'}</button></div>`;
  if (id === 'patterns') {
    const task = patternRounds[age][round % 3];
    return `<p class="task-prompt">What comes next?</p><div class="pattern-line" aria-label="Pattern: ${task.sequence.join(', ')}">${task.sequence.map((shape) => `<span>${shape}</span>`).join('')}<span class="missing">?</span></div>${optionButtons(task.options)}`;
  }
  if (id === 'logic') {
    const task = logicRounds[age][round % 3];
    return `<p class="task-prompt logic-clue">${esc(task.clue)}</p>${optionButtons(task.options)}`;
  }
  if (id === 'numbers') {
    const task = numberRounds[age][round % 3];
    return `<p class="task-prompt number-question">${esc(task.question)}</p>${optionButtons(task.options)}`;
  }
  if (id === 'spelling') {
    const task = spellingRounds[age][round % 3];
    return `<p class="clue-label">Clue: ${esc(task.clue)}</p><div class="scramble" aria-label="Mixed letters ${task.scramble}">${task.scramble}</div><form id="word-form" class="task-form"><label for="word-answer">Build the word</label><div class="input-row"><input id="word-answer" name="answer" autocapitalize="none" autocomplete="off" spellcheck="false" required /><button class="button primary" type="submit">Check word</button></div></form>`;
  }
  if (id === 'keys') {
    const phrase = keyPhrases[age][round % 3];
    return `<p class="task-prompt">Type this trail exactly:</p><div class="target-phrase">${esc(phrase)}</div><form id="key-form" class="task-form"><label for="key-answer">Your typing</label><textarea id="key-answer" name="answer" rows="2" autocomplete="off" autocapitalize="off" spellcheck="false" required></textarea><div class="typing-meta"><span id="char-count">0 of ${phrase.length} characters</span><button class="button primary" type="submit">Check typing</button></div></form>`;
  }
  return `<div class="draw-layout"><div><p class="task-prompt">Draw a place where a tiny creature could live.</p><p>There is no wrong answer. Try a thin and a thick line. Keyboard users can add shapes.</p><div class="draw-tools" aria-label="Drawing tools"><button class="color-tool is-selected" data-action="draw-color" data-color="#1d211c" aria-label="Charcoal color" aria-pressed="true"></button><button class="color-tool green" data-action="draw-color" data-color="#315c3a" aria-label="Moss color" aria-pressed="false"></button><button class="color-tool yellow" data-action="draw-color" data-color="#b18b18" aria-label="Lichen color" aria-pressed="false"></button><button class="color-tool clay" data-action="draw-color" data-color="#a5422e" aria-label="Clay color" aria-pressed="false"></button><button class="tool-button" data-action="draw-size">Line: thick</button><button class="tool-button" data-action="draw-shape" data-shape="dot">Add dot</button><button class="tool-button" data-action="draw-shape" data-shape="square">Add square</button><button class="tool-button" data-action="draw-undo">Undo</button><button class="tool-button" data-action="draw-clear">Clear</button></div></div><canvas id="sketch" width="700" height="420" aria-label="Drawing canvas. Use a pointer or touch to draw." tabindex="0"></canvas><button class="button primary save-drawing" data-action="save-drawing">Save this drawing session</button></div>`;
}

function activityView(id: ActivityId): string {
  const info = activities.find((item) => item.id === id)!;
  const current = activityState ?? { id, round: 0, score: 0 };
  const complete = current.round >= roundCount();
  const content = `<section class="play-page">
    <div class="play-top"><button class="back-button" data-action="home"><span aria-hidden="true">←</span> Station board</button><span>Ages ${station.settings.ageBand}</span></div>
    <header class="activity-header"><p class="eyebrow">${info.kicker}</p><h1 tabindex="-1">${info.title}</h1>${!complete && id !== 'drawing' ? `<div class="round-meter" aria-label="Round ${current.round + 1} of ${roundCount()}"><span>Round ${current.round + 1} / ${roundCount()}</span><div><i data-progress="${(current.round / roundCount()) * 100}"></i></div></div>` : ''}</header>
    <section class="task-slab" tabindex="-1" data-round-focus>${complete ? `<div class="session-complete"><span class="big-stamp" aria-hidden="true">${current.score >= 20 ? '✓' : '↗'}</span><p class="eyebrow">Activity complete</p><h2>${current.score} points saved</h2><p>That practice is stored on this computer. Choose another activity, or take a break.</p><div class="button-row"><button class="button primary" data-action="restart-activity">Play again</button><button class="button secondary" data-action="home">Choose another activity</button></div></div>` : activityTask(id, current.round)}</section>
    ${!license.unlocked && !complete ? '<p class="core-note">Core session · 3 rounds. Adult tools has an optional five-round bundle.</p>' : ''}
  </section>${footer()}`;
  return shell(`${demoBanner()}${content}`, 'activity');
}

function render(focusHeading = false): void {
  if (!station) return;
  if (!station.settings.setupDone) app.innerHTML = setupView();
  else {
    const currentRoute = route();
    if (currentRoute.page === 'activity' && currentRoute.id) {
      if (!activityState || activityState.id !== currentRoute.id) activityState = { id: currentRoute.id, round: 0, score: 0 };
      app.innerHTML = activityView(currentRoute.id);
      if (currentRoute.id === 'drawing') requestAnimationFrame(setupCanvas);
    } else app.innerHTML = homeView();
  }
  document.body.classList.toggle('panel-open', adultOpen);
  document.querySelectorAll<HTMLElement>('.round-meter i[data-progress]').forEach((meter) => { meter.style.width = `${meter.dataset.progress}%`; });
  updateMetadata();
  if (focusHeading) requestAnimationFrame(() => {
    const heading = document.querySelector<HTMLElement>('main h1');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    heading?.focus({ preventScroll: true });
    const announcer = document.querySelector('#announcer');
    if (announcer && routeMessage) announcer.textContent = routeMessage;
    routeMessage = '';
  });
}

function setMeta(selector: string, content: string): void {
  document.head.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content);
}

function updateMetadata(): void {
  const current = route();
  const path = location.pathname === '/' && isDemoMode() ? '/demo' : location.pathname;
  const canonical = `${SITE_URL}${path}`;
  let title = 'Linux Learning Station — offline activities for ages 5–10';
  let description = 'Six offline learning activities for children aged 5–10. No child accounts, ads, or tracking.';
  if (current.page === 'activity' && current.id) {
    title = `${activityName(current.id)} — Linux Learning Station`;
    description = `${activityName(current.id)} is an offline learning activity for children aged 5–10.`;
  } else if (isDemoMode()) {
    title = 'Demo — Linux Learning Station';
    description = 'Try all six offline learning activities with isolated sample progress.';
  }
  document.title = title;
  document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:url"]', canonical);
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
}

function announce(message: string): void {
  feedback = message;
  const region = document.querySelector('#announcer');
  if (region) region.textContent = message;
}

async function record(correct: boolean, detail: string): Promise<void> {
  if (!activityState) return;
  const attempt: Attempt = { id: crypto.randomUUID(), activity: activityState.id, correct, points: correct ? 10 : 2, detail, createdAt: new Date().toISOString() };
  station.attempts.push(attempt);
  await saveAttempt(attempt);
  activityState.score += attempt.points;
}

async function answer(value: string): Promise<void> {
  if (!activityState || activityState.result) return;
  const { id, round } = activityState;
  const age = station.settings.ageBand;
  let expected = '';
  if (id === 'patterns') expected = patternRounds[age][round % 3].answer;
  if (id === 'logic') expected = logicRounds[age][round % 3].answer;
  if (id === 'numbers') expected = numberRounds[age][round % 3].answer;
  if (id === 'spelling') expected = spellingRounds[age][round % 3].answer;
  if (id === 'keys') expected = keyPhrases[age][round % 3];
  const normalized = id === 'spelling' ? value.trim().toLowerCase() : value;
  const correct = normalized === expected;
  await record(correct, correct ? 'Solved a round' : `Practised; answer: ${expected}`);
  activityState.result = { correct, answer: expected };
  announce(correct ? 'Correct. Good noticing!' : `Good try. The answer is ${expected}.`);
  render();
  document.querySelector<HTMLButtonElement>('[data-action="next-round"]')?.focus();
}

let drawingColor = '#1d211c';
let drawingSize = 10;
let canvasHistory: ImageData[] = [];
let shapeIndex = 0;

function setupCanvas(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#sketch');
  if (!canvas) return;
  const context = canvas.getContext('2d', { willReadFrequently: true })!;
  context.fillStyle = '#f7f4ea'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineCap = 'round'; context.lineJoin = 'round';
  canvasHistory = [context.getImageData(0, 0, canvas.width, canvas.height)];
  let drawing = false;
  const point = (event: PointerEvent) => { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height }; };
  canvas.addEventListener('pointerdown', (event) => { drawing = true; canvas.setPointerCapture(event.pointerId); const p = point(event); context.beginPath(); context.moveTo(p.x, p.y); });
  canvas.addEventListener('pointermove', (event) => { if (!drawing) return; const p = point(event); context.strokeStyle = drawingColor; context.lineWidth = drawingSize; context.lineTo(p.x, p.y); context.stroke(); });
  canvas.addEventListener('pointerup', () => { if (!drawing) return; drawing = false; canvasHistory.push(context.getImageData(0, 0, canvas.width, canvas.height)); if (canvasHistory.length > 12) canvasHistory.shift(); });
}

function downloadExport(): void {
  const blob = new Blob([JSON.stringify({ ...station, updatedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `learning-station-${new Date().toISOString().slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(link.href);
  announce('Progress export downloaded.');
}

app.addEventListener('click', async (event) => {
  const button = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'finish-setup' || action === 'set-age') {
    station.settings = { ...station.settings, ageBand: button.dataset.age as AgeBand, setupDone: true };
    await saveSettings(station.settings); adultOpen = false; feedback = `Age range set to ${station.settings.ageBand}.`;
    const requested = route();
    navigate(action === 'finish-setup' && requested.page === 'activity' && requested.id ? `/activity/${requested.id}` : '/', requested.page === 'activity' ? `${activityName(requested.id!)} opened.` : 'Station board opened.');
  }
  if (action === 'try-demo') location.assign('/?demo=1');
  if (action === 'start-real') { await discardDemoStation(); location.assign('/'); }
  if (action === 'reset-demo') { await clearStation(); station = await loadStation(); feedback = 'Demo reset to its sample progress.'; render(); }
  if (action === 'toggle-adult') {
    adultOpen = !adultOpen;
    render();
    if (adultOpen) document.querySelector<HTMLElement>('.adult-panel .icon-button')?.focus();
    else document.querySelector<HTMLElement>('.site-header [data-action="toggle-adult"], .site-footer [data-action="toggle-adult"]')?.focus();
  }
  if (action === 'open-activity') { const id = button.dataset.id as ActivityId; activityState = { id, round: 0, score: 0 }; navigate(`/activity/${id}`, `${activityName(id)} opened.`); }
  if (action === 'home') { event.preventDefault(); activityState = null; navigate('/', 'Station board opened.'); }
  if (action === 'answer-option') await answer(button.dataset.value ?? '');
  if (action === 'next-round' && activityState) { activityState.round++; delete activityState.result; render(); document.querySelector<HTMLElement>('[data-round-focus]')?.focus(); }
  if (action === 'restart-activity' && activityState) { activityState = { id: activityState.id, round: 0, score: 0 }; render(); }
  if (action === 'print') window.print();
  if (action === 'export') downloadExport();
  if (action === 'confirm-reset') document.querySelector<HTMLDialogElement>('#reset-dialog')?.showModal();
  if (action === 'reset') { await clearStation(); station = await loadStation(); adultOpen = false; render(); }
  if (action === 'install' && installPrompt) { const prompt = installPrompt as Event & { prompt(): Promise<void> }; await prompt.prompt(); installPrompt = null; render(); }
  if (action === 'draw-color') { drawingColor = button.dataset.color!; document.querySelectorAll('[data-action="draw-color"]').forEach((node) => { node.classList.toggle('is-selected', node === button); node.setAttribute('aria-pressed', String(node === button)); }); }
  if (action === 'draw-size') { drawingSize = drawingSize === 10 ? 3 : 10; button.textContent = `Line: ${drawingSize === 10 ? 'thick' : 'thin'}`; }
  if (action === 'draw-shape') { const canvas = document.querySelector<HTMLCanvasElement>('#sketch'); if (canvas) { const context = canvas.getContext('2d', { willReadFrequently: true })!; const x = 70 + (shapeIndex * 83) % 550; const y = 70 + (shapeIndex * 61) % 270; context.fillStyle = drawingColor; if (button.dataset.shape === 'dot') { context.beginPath(); context.arc(x, y, 24, 0, Math.PI * 2); context.fill(); } else context.fillRect(x - 24, y - 24, 48, 48); shapeIndex++; canvasHistory.push(context.getImageData(0, 0, canvas.width, canvas.height)); announce(`${button.dataset.shape === 'dot' ? 'Dot' : 'Square'} added to the drawing.`); } }
  if (action === 'draw-undo') { const canvas = document.querySelector<HTMLCanvasElement>('#sketch'); if (canvas && canvasHistory.length > 1) { canvasHistory.pop(); canvas.getContext('2d')!.putImageData(canvasHistory.at(-1)!, 0, 0); } }
  if (action === 'draw-clear') { const canvas = document.querySelector<HTMLCanvasElement>('#sketch'); if (canvas) { const context = canvas.getContext('2d')!; context.fillStyle = '#f7f4ea'; context.fillRect(0, 0, canvas.width, canvas.height); canvasHistory.push(context.getImageData(0, 0, canvas.width, canvas.height)); } }
  if (action === 'save-drawing' && activityState) { await record(true, 'Saved a creative drawing session'); activityState.round = roundCount(); announce('Drawing session saved.'); render(); }
  if (action === 'apply-update') { const registration = await navigator.serviceWorker.getRegistration(); registration?.waiting?.postMessage({ type: 'SKIP_WAITING' }); }
  if (action === 'reload') location.reload();
});

app.addEventListener('submit', async (event) => {
  const form = event.target as HTMLFormElement;
  if (form.closest('dialog')) return;
  event.preventDefault();
  if (form.id === 'word-form' || form.id === 'key-form') await answer(new FormData(form).get('answer')?.toString() ?? '');
  if (form.id === 'license-form') { const token = new FormData(form).get('token')?.toString().trim(); if (token) { storeLicense(token); license = { unlocked: false, checking: true, notice: 'Checking license…' }; render(); license = await checkLicense(); render(); } }
});

app.addEventListener('input', (event) => {
  const input = event.target as HTMLTextAreaElement;
  if (input.id === 'key-answer' && activityState) { const phrase = keyPhrases[station.settings.ageBand][activityState.round % 3]; const count = document.querySelector('#char-count'); if (count) count.textContent = `${input.value.length} of ${phrase.length} characters`; }
});

app.addEventListener('change', async (event) => {
  const input = event.target as HTMLInputElement;
  if (input.id !== 'import-file' || !input.files?.[0]) return;
  try { station = validateImport(JSON.parse(await input.files[0].text())); await replaceStation(station); adultOpen = false; feedback = 'Progress imported successfully.'; render(); }
  catch (error) { feedback = error instanceof Error ? error.message : 'Could not import that file.'; input.value = ''; render(); document.querySelector<HTMLElement>('.feedback-banner')?.focus(); }
});

window.addEventListener('popstate', () => { activityState = null; routeMessage = 'Page changed.'; render(true); });
window.addEventListener('online', () => { feedback = 'Connection restored. The station still works offline.'; render(); });
window.addEventListener('offline', () => { feedback = 'You are offline. Activities and progress remain available.'; render(); });
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); installPrompt = event; render(); });
window.addEventListener('keydown', (event) => {
  if (!adultOpen) return;
  if (event.key === 'Escape') { adultOpen = false; render(); document.querySelector<HTMLElement>('[data-action="toggle-adult"]')?.focus(); return; }
  if (event.key !== 'Tab') return;
  const panel = document.querySelector<HTMLElement>('.adult-panel');
  const controls = [...(panel?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), summary') ?? [])].filter((item) => !item.hidden);
  if (!controls.length) return;
  const first = controls[0]; const last = controls.at(-1)!;
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator) || import.meta.env.DEV) return;
  const hadController = Boolean(navigator.serviceWorker.controller);
  const registration = await navigator.serviceWorker.register('/sw.js');
  const showUpdateNotice = () => document.querySelector<HTMLElement>('#update-toast')?.removeAttribute('hidden');
  window.addEventListener('station:update-ready', showUpdateNotice);
  if (registration.waiting && hadController) showUpdateNotice();
  registration.addEventListener('updatefound', () => registration.installing?.addEventListener('statechange', () => {
    if (registration.waiting && hadController) showUpdateNotice();
  }));
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadController) location.reload(); });
  const active = await navigator.serviceWorker.ready;
  if (active.active && navigator.serviceWorker.controller) { offlineReady = true; render(); }
}

async function start(): Promise<void> {
  captureLicense();
  license = cachedLicense();
  try { station = await loadStation(); render(); }
  catch { app.innerHTML = shell('<section class="fatal-state"><h1>The station could not open</h1><p>This browser blocked local storage. Allow site data, then reload.</p><button class="button primary" data-action="reload">Try again</button></section>'); return; }
  registerServiceWorker();
  if (license.checking) { license = await checkLicense(); render(); }
}

start();
