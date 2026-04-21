# 2026 世界斯诺克锦标赛追踪

斯诺克世锦赛签表数据追踪工具。

## 快速开始

```bash
# 安装依赖
npm install

# 启动本地服务器
python3 -m http.server 8080
# 访问 http://localhost:8080/bracket.html
```

## 每日更新

```bash
node scrape.js
```

执行后会：
1. 抓取 WST 官网最新比赛数据
2. 更新 `bracket-data.json`
3. 生成截图保存到 `/Users/frankyuan/dev/wst-2026-img/`

## 文件说明

```
.
├── bracket.html         # 签表页面
├── bracket-data.json    # 签表数据
├── player-profiles.json # 选手资料
├── scrape.js            # 抓取脚本
└── package.json         # 依赖
```

## 截图输出

截图保存在：`/Users/frankyuan/dev/wst-2026-img/`
