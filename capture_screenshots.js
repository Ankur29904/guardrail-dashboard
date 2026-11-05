import puppeteer from 'puppeteer-core';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching Chrome with 1920x1080 @ 2x DPI...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080'],
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2,
    },
  });

  const page = await browser.newPage();
  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await sleep(1500);

  // --- SCENARIO 1: PR #104 (Vulnerable) ---
  console.log('Step 1: Simulating Scenario 1 (PR #104 - Vulnerable)...');
  const simBtn = await page.waitForSelector('button.btn-primary');
  await simBtn.click();
  console.log('Simulating... waiting 6s for entire LangGraph pipeline & gate completion...');
  await sleep(6000);

  // Optional: open AST tree
  try {
    const astBtn = await page.$('button.w-full.flex');
    if (astBtn) {
      await astBtn.click();
      await sleep(500);
    }
  } catch (e) {
    console.log('AST toggle note:', e.message);
  }

  // 1. screen_diff_sast.png -> Column 1
  console.log('Capturing screen_diff_sast.png...');
  const col1 = await page.$('main > div.grid > div:nth-child(1)');
  if (col1) {
    await col1.screenshot({ path: path.join(OUT_DIR, 'screen_diff_sast.png') });
    console.log('✓ Saved screen_diff_sast.png');
  }

  // 2. screen_agent_mesh.png -> Column 2, child 2 (AgentMeshArena)
  console.log('Capturing screen_agent_mesh.png...');
  const agentMesh = await page.$('main > div.grid > div:nth-child(2) > div:nth-child(2)');
  if (agentMesh) {
    await agentMesh.screenshot({ path: path.join(OUT_DIR, 'screen_agent_mesh.png') });
    console.log('✓ Saved screen_agent_mesh.png');
  }

  // 3. screen_consensus_node.png -> Column 2, child 3 (ConsensusCard)
  console.log('Capturing screen_consensus_node.png...');
  const consensusNode = await page.$('main > div.grid > div:nth-child(2) > div:nth-child(3)');
  if (consensusNode) {
    await consensusNode.screenshot({ path: path.join(OUT_DIR, 'screen_consensus_node.png') });
    console.log('✓ Saved screen_consensus_node.png');
  }

  // 4. screen_github_comment.png -> Column 3, child 2 (GitHubReviewDeliverable)
  console.log('Capturing screen_github_comment.png...');
  const ghComment = await page.$('main > div.grid > div:nth-child(3) > div:nth-child(2)');
  if (ghComment) {
    await ghComment.screenshot({ path: path.join(OUT_DIR, 'screen_github_comment.png') });
    console.log('✓ Saved screen_github_comment.png');
  }

  // 5. screen_gate_blocked.png -> Column 3, child 3 (MergeGateBox blocked)
  console.log('Capturing screen_gate_blocked.png...');
  const gateBlocked = await page.$('main > div.grid > div:nth-child(3) > div:nth-child(3)');
  if (gateBlocked) {
    await gateBlocked.screenshot({ path: path.join(OUT_DIR, 'screen_gate_blocked.png') });
    console.log('✓ Saved screen_gate_blocked.png');
  }

  // --- SCENARIO 2: PR #105 (Clean) ---
  console.log('\nStep 2: Switching to Scenario 2 (PR #105 - Clean Refactor)...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cleanBtn = buttons.find(b => b.textContent && b.textContent.includes('PR #105'));
    if (cleanBtn) cleanBtn.click();
  });
  await sleep(1000);

  const simBtn2 = await page.waitForSelector('button.btn-primary');
  await simBtn2.click();
  console.log('Simulating Clean PR... waiting 6s for passing gate & confetti burst...');
  await sleep(6000);

  // 6. screen_gate_approved.png -> Column 3, child 3 (MergeGateBox approved)
  console.log('Capturing screen_gate_approved.png...');
  const gateApproved = await page.$('main > div.grid > div:nth-child(3) > div:nth-child(3)');
  if (gateApproved) {
    await gateApproved.screenshot({ path: path.join(OUT_DIR, 'screen_gate_approved.png') });
    console.log('✓ Saved screen_gate_approved.png');
  }

  console.log('\nAll 6 high-resolution modular screenshots captured successfully!');
  await browser.close();
}

run().catch((err) => {
  console.error('Fatal error capturing screenshots:', err);
  process.exit(1);
});
