#!/usr/bin/env node
/**
 * 斯诺克每日截图任务
 * 1. 启动本地服务 (如果没运行)
 * 2. 执行 scrape.js 抓取数据并生成截图
 * 3. 发送最新截图给用户
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const IMG_DIR = '/Users/frankyuan/dev/wst-2026-img';
const WORKSPACE = '/Users/frankyuan/.openclaw/workspace/snooker-world-2026';

console.log('=== 斯诺克每日截图任务 ===');
console.log('开始时间:', new Date().toISOString());

try {
  // 1. 检查本地服务是否运行
  console.log('\n1. 检查本地服务...');
  try {
    execSync('curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8765/bracket.html', { stdio: 'pipe' });
    console.log('本地服务已在 8765 端口运行');
  } catch (e) {
    console.log('本地服务未运行，启动中...');
    execSync(`node ${WORKSPACE}/server.js &`, { stdio: 'ignore', detached: true });
    console.log('等待服务启动...');
    execSync('sleep 3', { stdio: 'ignore' });
  }

  // 2. 执行 scrape.js
  console.log('\n2. 执行 scrape.js 抓取数据并生成截图...');
  execSync(`node ${WORKSPACE}/scrape.js`, { 
    cwd: WORKSPACE,
    stdio: 'inherit',
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  // 3. 找到最新生成的图片
  console.log('\n3. 查找最新截图...');
  const files = fs.readdirSync(IMG_DIR)
    .filter(f => f.endsWith('.png'))
    .sort()
    .reverse();
  
  if (files.length === 0) {
    console.error('❌ 未找到生成的截图');
    process.exit(1);
  }

  const latestImg = files[0];
  const latestImgPath = path.join(IMG_DIR, latestImg);
  console.log('最新截图:', latestImgPath);

  // 4. 输出图片路径供 cron 任务后续发送
  console.log('\n✅ 任务完成');
  console.log('图片路径:', latestImgPath);
  console.log('MEDIA:' + latestImgPath);

} catch (error) {
  console.error('❌ 任务失败:', error.message);
  process.exit(1);
}
