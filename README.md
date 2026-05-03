# 2026 世界斯诺克锦标赛追踪

用于追踪 2026 Halo World Snooker Championship 的签表、比分和每日截图。页面会读取 `bracket-data.json` 渲染晋级树，并根据比分自动高亮胜者、推进后续轮次。

## 快速开始

```bash
npm install
node server.js
```

然后打开：

```text
http://localhost:8080/bracket.html
```

也可以用任意静态服务器预览，例如：

```bash
python3 -m http.server 8080
```

## 更新比分

```bash
npm run scrape
```

`npm run scrape` 会执行本地的 `scrape.js`：

1. 从 live score 数据源抓取当前比分。
2. 更新 `bracket-data.json` 里的半决赛比分和 `lastUpdated`。
3. 打开本地签表页面并生成 PNG 截图。
4. 将截图保存到 `/Users/frankyuan/dev/wst-2026-img/`，并在输出中打印 `MEDIA:` 路径。

注意：`scrape.js` 在 `.gitignore` 中，本仓库默认不提交这个本地抓取脚本。如果换机器运行，需要确保本地有对应脚本。

## 每日截图流程

```bash
node daily-screenshot.js
```

这个脚本是日常任务入口：

1. 检查本地服务是否可访问。
2. 调用 `scrape.js` 更新数据并截图。
3. 从 `/Users/frankyuan/dev/wst-2026-img/` 找到最新 PNG。
4. 输出最终图片路径和 `MEDIA:` 行，方便自动化任务或消息发送工具读取。

完整包装流程：

```bash
bash daily-screenshot-wrapper.sh
```

`daily-screenshot-wrapper.sh` 会在每日截图之后继续执行提交、推送和微信发送。运行前请确认 Git 远端、登录态和 `openclaw message` 命令可用。

## 主要文件

```text
.
├── bracket.html                  # 签表页面，读取 JSON 并渲染晋级树
├── bracket-data.json             # 核心签表和比分数据
├── player-profiles.json          # 选手头像、中文名、WST 资料链接等
├── server.js                     # 本地静态服务器，默认端口 8080
├── daily-screenshot.js           # 每日更新和截图入口
├── daily-screenshot-wrapper.sh   # 截图、提交、推送、发送的完整包装脚本
├── package.json                  # npm 脚本和依赖
├── index.html                    # 跳转到 bracket.html
└── champain.jpg                  # 页面使用的本地图片资源
```

本地存在但默认不提交的文件：

```text
scrape.js          # 实际抓取与截图脚本
scrape-wst.js      # 早期 WST 页面抓取实验脚本
node_modules/
package-lock.json
wst-2026-img-*.png
```

## 数据约定

`bracket-data.json` 是页面的单一数据源。常用字段：

- `tournament.lastUpdated`：页面展示的数据更新时间，使用 Asia/Shanghai。
- `rounds[].key`：轮次标识，例如 `last32`、`last16`、`quarter`、`semi`、`final`。
- `matches[].status`：`pending`、`live` 或 `finished`。
- `matches[].bestOf`：比赛局数，例如半决赛为 BO33。
- `players[].score`：当前比分。比分达到胜局数后页面会识别胜者。

后续轮次如果没有手动填球员，页面会从上一轮已结束比赛自动推导晋级者。

## 截图输出

截图目录：

```text
/Users/frankyuan/dev/wst-2026-img/
```

`daily-screenshot.js` 会按文件修改时间选择最新截图，而不是按文件名排序，避免旧命名格式的图片被误选。

## 常见问题

### 抓取时报 `ENOTFOUND`

说明当前环境不能访问外部 live score 数据源。需要允许脚本联网后重跑：

```bash
npm run scrape
```

### 截图失败或浏览器无法启动

确认已经安装依赖：

```bash
npm install
```

如果 Puppeteer 默认浏览器不可用，可以安装或使用系统 Chrome。当前本地脚本会优先尝试 `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`。

### 最新截图路径不对

请运行：

```bash
node daily-screenshot.js
```

脚本末尾输出的 `MEDIA:` 行就是最终图片路径。
