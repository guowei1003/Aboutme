#!/bin/bash
set -euo pipefail

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="${DEPLOY_DIR:-$SCRIPT_DIR}"
COMPOSE_FILE="$DEPLOY_DIR/docker-compose.yml"

log "🚀 Kapibala Docker 部署开始..."

if [ ! -d "$DEPLOY_DIR" ]; then
  log "❌ 部署目录不存在: $DEPLOY_DIR"
  exit 1
fi

if [ ! -f "$COMPOSE_FILE" ]; then
  log "❌ 未找到 compose 文件: $COMPOSE_FILE"
  exit 1
fi

cd "$DEPLOY_DIR"

# 2. 创建必要目录
mkdir -p ./public ./privacy ./waline/data ./nginx

# 3. 在服务器构建镜像（包含 Hexo 编译）
# 默认强制无缓存重建，确保每次都执行 Dockerfile 中的 Hexo 编译步骤
log "🏗️ 开始构建镜像（先 build 再 up，强制重编译）..."

build_start_ms=$(date +%s%3N)
if awk '/^[[:space:]]*build:[[:space:]]*/{found=1} END{exit !found}' "$COMPOSE_FILE"; then
  docker compose --progress plain build --pull --no-cache
elif [ -f "$DEPLOY_DIR/Dockerfile" ]; then
  log "ℹ️ compose 未配置 build，回退使用 docker build 构建 kapibala-web:latest"
  docker build --pull --no-cache -t kapibala-web:latest -f "$DEPLOY_DIR/Dockerfile" "$DEPLOY_DIR"
else
  log "❌ 既未检测到 compose build 配置，也未找到 Dockerfile，无法执行容器内编译。"
  exit 1
fi
build_end_ms=$(date +%s%3N)
build_elapsed_ms=$((build_end_ms - build_start_ms))
log "⏱️ 镜像构建耗时: ${build_elapsed_ms}ms"
log "✅ 镜像构建完成（已在 Dockerfile 构建阶段执行 Hexo 编译）"

# 4. 清理同名旧容器（避免名称冲突）
if docker container inspect kapibala-web >/dev/null 2>&1; then
  log "🧹 检测到旧容器 kapibala-web，正在移除..."
  docker rm -f kapibala-web
fi

# 5. 启动容器
log "🐳 启动容器..."
docker compose up -d --force-recreate --remove-orphans

# 6. 清理旧镜像
docker image prune -f

log "✅ 部署完成！访问 https://kapibala.uno"
