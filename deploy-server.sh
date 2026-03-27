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
mkdir -p ./public ./waline/data ./nginx

# 3. 在服务器构建镜像（包含 Hexo 编译）
# 默认强制无缓存重建，确保每次都执行 Dockerfile 中的 Hexo 编译步骤
log "🏗️ 开始构建镜像（强制重编译，显示详细构建日志）..."

if ! awk '/^[[:space:]]*build:[[:space:]]*($|#)/{found=1} END{exit !found}' "$COMPOSE_FILE"; then
  log "❌ 当前 compose 未检测到 build 配置，无法执行容器内编译。"
  log "   请检查: $COMPOSE_FILE"
  exit 1
fi

build_start_ms=$(date +%s%3N)
docker compose --progress plain build --pull --no-cache
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
