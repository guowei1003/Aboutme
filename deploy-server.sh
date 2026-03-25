#!/bin/bash
set -e

echo "🚀 Kapibala Docker 部署开始..."

cd /data/aboutme

# 1. 生成自签名证书 (首次运行)
if [ ! -f ./ssl/kapibala.crt ]; then
    echo "📜 生成 SSL 证书..."
    mkdir -p ./ssl
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./ssl/kapibala.key \
        -out ./ssl/kapibala.crt \
        -subj "/CN=kapibala.uno"
fi

# 2. 创建必要目录
mkdir -p ./public ./waline/data ./nginx

# 3. 启动容器
docker compose pull
docker compose up -d

# 4. 清理旧镜像
docker image prune -f

echo "✅ 部署完成！访问 https://kapibala.uno"
