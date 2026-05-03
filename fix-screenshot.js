#!/usr/bin/env node
const { chromium } = require('playwright');
const { spawn, execSync } = require('child_process');
const path = require('path');

const WORKSPACE = '/Users/frankyuan/.openclaw/workspace/snooker-world-2026';
const IMG_DIR = '/Users/frankyuan/dev/wst-2026-img';

(async () => {
  // Kill existing server
  try { execSync('pkill -f "node server.js"'); } catch(e) {}
  await new Promise(r => setTimeout(r, 1000));
  
  // Start server
  const server = spawn('node', ['server.js'], {
    cwd: WORKSPACE,
    stdio: 'ignore',
    detached: true
  });
  console.log('Server started, waiting...');
  await new Promise(r => setTimeout(r, 3000));
  
  // Verify server
  try {
    const res = await fetch('http://localhost:8080/bracket-data.json');
    console.log('Server check:', res.status);
  } catch(e) {
    console.error('Server not responding:', e.message);
    process.exit(1);
  }
  
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 2340 } });
  
  await page.goto('http://localhost:8080/bracket.html', { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 5000));
  
  const outFile = path.join(IMG_DIR, `snooker-world-2026-${Date.now()}.png`);
  await page.screenshot({ path: outFile, fullPage: true });
  console.log('Screenshot saved:', outFile);
  console.log('MEDIA:' + outFile);
  
  await browser.close();
  server.kill();
})();
