import { chromium } from "playwright";

// On Replit the browser is at a fixed path (detected via REPL_ID env var).
// On Render/Railway Playwright manages the path after `npx playwright install chromium`.
const CHROMIUM_EXEC = process.env.CHROMIUM_EXEC_PATH
  || (process.env.REPL_ID
    ? "/home/runner/workspace/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome"
    : undefined);

const PAN_URL =
  "https://www.protean-tinpan.com/services/pan/pan-status.html";

function evaluateWithTimeout(page, fn, ms = 5000) {
  return Promise.race([
    page.evaluate(fn),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("evaluate timeout")), ms)
    ),
  ]);
}

export async function runPanTask(input = {}) {
  const logs = [];

  const launchOpts = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    ...(CHROMIUM_EXEC ? { executablePath: CHROMIUM_EXEC } : {}),
  };

  const browser = await chromium.launch(launchOpts);

  try {
    const page = await browser.newPage();

    logs.push("Opening PAN portal...");
    try {
      await page.goto(PAN_URL, { waitUntil: "domcontentloaded", timeout: 20000 });
      logs.push("Page loaded.");
    } catch {
      logs.push("Site unreachable.");
      return {
        status: "error",
        logs,
        error: "Could not reach the PAN portal. Run backend outside Replit for real browser access.",
      };
    }

    if (!input.ack_number) {
      return {
        status: "success",
        logs,
        next: {
          type: "input",
          field: "ack_number",
          message: "Enter your 15-digit acknowledgement number",
        },
      };
    }

    try {
      await page.fill('input[name="ackNo"]', input.ack_number, { timeout: 5000 });
    } catch { /* field not found — page structure may differ */ }

    let pageText = "";
    try {
      pageText = await evaluateWithTimeout(
        page,
        () => document.body.innerText ?? "",
        5000
      );
    } catch { /* ignore */ }

    if (pageText.toLowerCase().includes("captcha")) {
      return {
        status: "input_required",
        logs,
        next: {
          type: "input",
          field: "captcha",
          message: "Enter the CAPTCHA shown on the page",
        },
      };
    }

    try {
      await page.click('input[type="submit"], button[type="submit"]', { timeout: 5000 });
      await page.waitForTimeout(3000);
    } catch { /* ignore */ }

    let result = "";
    try {
      result = await evaluateWithTimeout(
        page,
        () => document.body.innerText.slice(0, 1000),
        5000
      );
    } catch { /* ignore */ }

    return {
      status: "success",
      logs,
      result: result || "No result extracted.",
    };

  } finally {
    await browser.close();
  }
}
