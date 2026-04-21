#!/bin/bash
# 斯诺克每日截图任务 - 完整流程包装脚本
# 执行：bash daily-screenshot-wrapper.sh

set -e

WORKSPACE="/Users/frankyuan/.openclaw/workspace/snooker-world-2026"
IMG_DIR="/Users/frankyuan/dev/wst-2026-img"
GIT_REPO="$WORKSPACE"

echo "=== 斯诺克每日截图任务 ==="
echo "开始时间: $(date -Iseconds)"

# 1. 执行截图脚本
echo ""
echo "1. 执行截图脚本..."
OUTPUT=$(node "$WORKSPACE/daily-screenshot.js" 2>&1)
echo "$OUTPUT"

# 2. 提取图片路径 (从 MEDIA: 行)
IMG_PATH=$(echo "$OUTPUT" | grep "^MEDIA:" | sed 's/^MEDIA://')

if [ -z "$IMG_PATH" ]; then
    echo "❌ 未找到图片路径"
    exit 1
fi

echo ""
echo "2. 图片路径：$IMG_PATH"

# 3. 提交并推送代码
echo ""
echo "3. 提交代码到 GitHub..."
cd "$GIT_REPO"
git add -A
if git diff --staged --quiet; then
    echo "没有代码变更，跳过提交"
else
    git commit -m "更新比赛数据 ($(date '+%m-%d %H:%M'))"
    git push origin main
    echo "✅ 代码已推送"
fi

# 4. 通过微信发送图片
echo ""
echo "4. 发送微信..."
# 尝试通过 openclaw-weixin 发送，如果失败则本地打开
if openclaw message send --channel openclaw-weixin --target "frankyuan" --media "$IMG_PATH" --message "🏆 斯诺克每日截图 - $(date '+%m-%d %H:%M')

✅ 自动抓取 WST 比分
✅ 更新比赛数据
✅ 生成晋级树截图

详情见 GitHub: https://github.com/yufengyuanx/snooker-world-2026" 2>/dev/null; then
    echo "✅ 微信发送成功"
else
    echo "⚠️ 微信发送失败 (target 未配置)，图片已保存在：$IMG_PATH"
    echo "正在本地打开图片..."
    open "$IMG_PATH"
fi
