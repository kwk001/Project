#!/bin/bash

# 开物低代码项目脚本
# 项目目录: /Users/apple/Desktop/文件/kaiwu-project/02-guqirongcai/docs/kaiwu-code/kaiwu-app

PROJECT_DIR="/Users/apple/Desktop/文件/kaiwu-project/02-guqirongcai/docs/kaiwu-code/kaiwu-app"
KAIWU_CODE_DIR="/Users/apple/Desktop/文件/kaiwu-project/02-guqirongcai/docs/kaiwu-code"

echo "=================================="
echo "  开物低代码项目脚本"
echo "=================================="
echo ""

# 显示帮助信息
show_help() {
    echo "用法: ./start-kaiwu.sh [命令] [选项]"
    echo ""
    echo "可用命令:"
    echo "  generate    生成低代码页面 (需要需求描述)"
    echo "  analyze     分析需求文件"
    echo "  schema      生成数据模型"
    echo "  preview     启动本地预览服务器"
    echo "  deploy      部署到开物平台"
    echo "  help        显示帮助信息"
    echo ""
    echo "示例:"
    echo "  ./start-kaiwu.sh generate '商品档案管理页面'"
    echo "  ./start-kaiwu.sh preview"
    echo ""
}

# 如果没有参数，显示帮助
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

COMMAND=$1
shift

case $COMMAND in
    generate|gen)
        echo "正在生成低代码页面..."
        if [ $# -eq 0 ]; then
            echo "错误: 请提供需求描述"
            echo "示例: ./start-kaiwu.sh generate '商品档案管理页面'"
            exit 1
        fi
        REQUIREMENT="$1"
        echo "需求: $REQUIREMENT"
        echo "项目目录: $PROJECT_DIR"
        echo ""
        kagent-generator "$REQUIREMENT" --project-dir "$KAIWU_CODE_DIR" --skip-confirm
        ;;

    analyze)
        echo "正在分析需求..."
        if [ $# -eq 0 ]; then
            echo "错误: 请提供需求文件路径"
            exit 1
        fi
        FILE_PATH="$1"
        kagent-analyzer "$FILE_PATH" --project-dir "$KAIWU_CODE_DIR"
        ;;

    schema)
        echo "正在生成数据模型..."
        kagent-schema --project-dir "$KAIWU_CODE_DIR"
        ;;

    preview)
        echo "启动本地预览服务器..."
        echo "预览地址: http://localhost:8080/preview-static.html"
        echo ""
        cd "$KAIWU_CODE_DIR" && python3 -m http.server 8080
        ;;

    deploy)
        echo "部署到开物平台..."
        echo "应用ID: 8458f839b9260c7487315662282d1818"
        echo "平台地址: https://app.kaiwu.cloud/"
        echo ""
        echo "请手动在开物平台中导入代码文件:"
        echo "  $PROJECT_DIR/定价中枢/基础数据/商品/商品档案/index.jsx"
        ;;

    help|-h|--help)
        show_help
        ;;

    *)
        echo "未知命令: $COMMAND"
        show_help
        exit 1
        ;;
esac
