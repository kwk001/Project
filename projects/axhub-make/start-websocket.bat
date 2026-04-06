@echo off

REM 启动 WebSocket 服务脚本
REM 此脚本会启动 Vite 开发服务器，WebSocket 服务会作为插件自动启动

echo === 启动 WebSocket 服务 ===

REM 检查是否在项目根目录
if not exist "package.json" (
  echo 错误：请在项目根目录运行此脚本
  pause
  exit /b 1
)

REM 检查依赖是否安装
if not exist "node_modules" (
  echo 依赖未安装，正在安装...
  npm install
  if %errorlevel% neq 0 (
    echo 依赖安装失败
    pause
    exit /b 1
  )
  echo 依赖安装完成
)

REM 启动开发服务器
echo 启动 Vite 开发服务器...
echo WebSocket 服务会作为插件自动启动
echo.
echo 服务地址：
echo - 本地：http://localhost:51720
echo - WebSocket：ws://localhost:51720/ws
echo - WebSocket API：http://localhost:51720/api/ws/clients
echo.
echo 按 Ctrl+C 停止服务
echo.

REM 启动服务
npm run dev

pause