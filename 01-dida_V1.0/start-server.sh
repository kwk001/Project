#!/bin/bash

# 静态 HTML 项目本地预览脚本
# 启动 kaiwu_dida 项目的本地预览服务器（静态 HTML 页面）

echo "正在启动 kaiwu_dida 项目的本地预览服务器..."
echo "项目目录: /Users/apple/Desktop/文件/kaiwu-project/kaiwu_dida"
echo ""

# 检查是否有 Python3
if command -v python3 &> /dev/null; then
    echo "使用 Python3 启动静态文件服务器..."
    echo "访问地址: http://localhost:8080"
    echo ""
    cd /Users/apple/Desktop/文件/kaiwu-project/kaiwu_dida && python3 -m http.server 8080
elif command -v python &> /dev/null; then
    echo "使用 Python 启动静态文件服务器..."
    echo "访问地址: http://localhost:8080"
    echo ""
    cd /Users/apple/Desktop/文件/kaiwu-project/kaiwu_dida && python -m http.server 8080
else
    echo "未找到 Python，尝试使用 Node.js..."
    if command -v npx &> /dev/null; then
        echo "使用 npx serve 启动服务器..."
        echo "访问地址: http://localhost:8080"
        echo ""
        cd /Users/apple/Desktop/文件/kaiwu-project/kaiwu_dida && npx serve -p 8080
    else
        echo "错误: 未找到 Python 或 Node.js，无法启动服务器"
        exit 1
    fi
fi
