#!/bin/bash
set -euo pipefail

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

log "🚀 Kapibala Docker 部署开始..."

cd /data/aboutme


# 2. 创建必要目录
mkdir -p ./public ./waline/data ./nginx

# 3. 在服务器构建镜像（包含 Hexo 编译）
# 默认强制无缓存重建，确保每次都执行 Dockerfile 中的 Hexo 编译步骤
log "🏗️ 开始构建镜像（强制重编译，显示详细构建日志）..."
build_start_ts=$(date +%s)
docker compose --progress plain build --pull --no-cache 2>&1 | while IFS= read -r line; do
  log "$line"
done
build_elapsed=$(( $(date +%s) - build_start_ts ))
log "⏱️ 镜像构建耗时: ${build_elapsed}s"
if [ "$build_elapsed" -lt 20 ]; then
  log "⚠️ 构建耗时异常短，请确认 /data/aboutme 的 Dockerfile 与 compose 文件是否为最新版本。"
fi
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
