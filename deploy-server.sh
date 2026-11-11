#!/bin/bash
set -euo pipefail

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="${DEPLOY_DIR:-$SCRIPT_DIR}"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.yml"

log "🚀 Kapibala 静态站启动..."

if [ ! -f "$COMPOSE_FILE" ]; then
  log "❌ 未找到 compose 文件: $COMPOSE_FILE"
  exit 1
fi

cd "$DEPLOY_DIR"

# 静态文件由 GitHub Actions 构建并 rsync 到 ./public；服务器不再构建镜像。
mkdir -p ./public ./privacy

if [ ! -f ./public/index.html ]; then
  log "⚠️  ./public/index.html 不存在，挂载后站点会返回 404。"
  log "    请先触发一次 GitHub Actions（push 到 3.0.0 或手动 workflow_dispatch），"
  log "    或本地执行 npm run generate 后 rsync 到 $DEPLOY_DIR/public/。"
fi

# 配置变更（nginx.conf / compose / ssl）需要手动同步到本目录后重跑此脚本。
if docker container inspect kapibala-web >/dev/null 2>&1; then
  log "🧹 检测到旧容器 kapibala-web，正在移除..."
  docker rm -f kapibala-web
fi

log "🐳 拉取官方 nginx:alpine 并启动容器..."
docker compose pull
docker compose up -d --force-recreate --remove-orphans

log "✅ 完成！访问 https://kapibala.uno"
