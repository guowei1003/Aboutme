#!/bin/bash
set -e

echo "🚀 Kapibala Docker 部署开始..."

cd /data/aboutme


# 2. 创建必要目录
mkdir -p ./public ./waline/data ./nginx

# 3. 在服务器构建镜像（包含 Hexo 编译）
echo "🏗️ 开始构建镜像（在 Dockerfile 中执行 Hexo 编译）..."
docker compose build --pull

# 4. 启动容器
echo "🐳 启动容器..."
docker compose up -d --force-recreate

# 5. 清理旧镜像
docker image prune -f

echo "✅ 部署完成！访问 https://kapibala.uno"
