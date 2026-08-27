import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GREMLINS_PATH = path.resolve(__dirname, '../node_modules/gremlins.js/dist/gremlins.min.js');

const PAGES = [
  { path: '/submit', name: 'SubmitPage' },
  { path: '/history', name: 'HistoryPage' },
  { path: '/components', name: 'ComponentsPage' },
];

for (const { path: pagePath, name } of PAGES) {
  test(`Monkey test: ${name}`, async ({ page }) => {
    const jsErrors = [];
    let stopped = false;

    page.on('pageerror', (err) => {
      if (!err.message.includes('horde.stop is not a function') && !err.message.includes('horde.halt is not a function')) {
        jsErrors.push(err.message);
      }
    });
    page.on('console', (msg) => {
      const text = msg.text();
      if (msg.type() === 'error' && !text.includes('Failed to load resource') && !text.includes('mogwai')) {
        jsErrors.push(text);
      }
    });

    await page.goto(pagePath, { waitUntil: 'networkidle' });
    await page.addScriptTag({ path: GREMLINS_PATH });

    await page.evaluate(() => {
      window.__monkeyDone = false;
      const horde = gremlins.createHorde({
        log: false,
        randomizer: new gremlins.Chance(),
        species: [
          gremlins.species.clicker(),
          gremlins.species.toucher(),
          gremlins.species.formFiller(),
          gremlins.species.scroller(),
          gremlins.species.typer(),
        ],
      });
      horde.unleash();
      setTimeout(() => {
        try { horde.stop(); } catch (e) {}
        window.__monkeyDone = true;
      }, 30000);
    });

    const deadline = Date.now() + 45_000;
    while (Date.now() < deadline) {
      const done = await page.evaluate(() => window.__monkeyDone).catch(() => {
        stopped = true;
        return true;
      });
      if (done) break;
      try { await page.waitForTimeout(500); } catch { stopped = true; }
      if (stopped) break;
    }

    console.log(`\n  [${name}] Monkey test selesai. JS errors: ${jsErrors.length}`);
    if (jsErrors.length > 0) {
      console.log(`  Errors:`);
      jsErrors.forEach((e, i) => console.log(`    ${i + 1}. ${e}`));
    }

    expect(jsErrors, `JS errors di ${name}: ${jsErrors.join(' | ')}`).toHaveLength(0);
  });
}
