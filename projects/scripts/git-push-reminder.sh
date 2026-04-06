#!/bin/bash

# Git 推送提醒脚本
# 每小时检查是否有未推送的提交

PROJECT_DIR="/Users/apple/Desktop/文件/kaiwu-richang"
cd "$PROJECT_DIR"

# 检查是否有未推送的提交
UNPUSHED=$(git log origin/main..main --oneline 2>/dev/null | wc -l)

if [ "$UNPUSHED" -gt 0 ]; then
    # 有未推送的提交，显示提醒
    osascript -e "display notification \"您有 $UNPUSHED 个提交未推送，请及时同步代码\" with title \"Git推送提醒\" sound name \"default\""
else
    # 没有未推送的提交，显示确认提醒
    osascript -e "display notification \"代码已同步，继续保持！\" with title \"Git推送提醒\" sound name \"default\""
fi
