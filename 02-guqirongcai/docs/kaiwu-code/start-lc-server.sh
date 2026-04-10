#!/bin/bash

# 开物低代码服务器启动脚本
# 执行 start-lc-server 命令

PROJECT_DIR="/Users/apple/Desktop/文件/kaiwu-project/02-guqirongcai/docs/kaiwu-code/kaiwu-app"
KAIWU_CODE_DIR="/Users/apple/Desktop/文件/kaiwu-project/02-guqirongcai/docs/kaiwu-code"

echo "=================================="
echo "  开物低代码服务器启动脚本"
echo "=================================="
echo ""

# 检查 start-lc-server 命令是否存在
if ! command -v start-lc-server &> /dev/null; then
    echo "错误: start-lc-server 命令未找到"
    echo "请确保开物低代码服务器CLI已正确安装"
    echo ""
    echo "尝试查找替代命令..."

    # 尝试查找可能的替代命令
    if command -v kaiwu-server &> /dev/null; then
        echo "找到 kaiwu-server 命令"
        SERVER_CMD="kaiwu-server"
    elif command -v kagent-server &> /dev/null; then
        echo "找到 kagent-server 命令"
        SERVER_CMD="kagent-server"
    elif command -v lc-server &> /dev/null; then
        echo "找到 lc-server 命令"
        SERVER_CMD="lc-server"
    else
        echo "未找到可用的服务器命令"
        echo "尝试使用 npm 启动..."

        # 检查是否有 package.json
        if [ -f "$KAIWU_CODE_DIR/package.json" ]; then
            echo "发现 package.json，尝试 npm run dev..."
            cd "$KAIWU_CODE_DIR" && npm run dev
            exit 0
        else
            echo "未找到 package.json，无法启动服务器"
            exit 1
        fi
    fi
else
    SERVER_CMD="start-lc-server"
fi

echo ""
echo "项目目录: $PROJECT_DIR"
echo "执行命令: $SERVER_CMD --project-dir $PROJECT_DIR"
echo ""
echo "=================================="
echo ""

# 执行 start-lc-server 命令
cd "$KAIWU_CODE_DIR"
$SERVER_CMD --project-dir "$PROJECT_DIR"

# 检查执行结果
if [ $? -eq 0 ]; then
    echo ""
    echo "=================================="
    echo "  服务器启动成功!"
    echo "=================================="
else
    echo ""
    echo "=================================="
    echo "  服务器启动失败"
    echo "=================================="
    exit 1
fi
