#!/bin/bash
set -e

echo "🚀 Kapibala Docker 部署开始..."

cd /data/aboutme


# 2. 创建必要目录
mkdir -p ./public ./waline/data ./nginx

# 3. 启动容器
docker compose pull
docker compose up -d

# 4. 清理旧镜像
docker image prune -f

echo "✅ 部署完成！访问 https://kapibala.uno"
