# 应急离线构建（生产不使用）
# 生产链路：GitHub Actions 生成 public/ → rsync 到服务器 → compose bind mount 进官方 nginx:alpine。
# 仅当 CI 不可用时使用：先 npm ci && npm run generate，再
#   docker build -t kapibala-web:emergency .
#   docker run --rm -p 8080:80 kapibala-web:emergency
# .dockerignore 已排除 ssl/ 私钥与 .git，应急镜像不含任何敏感文件。
FROM nginx:alpine
COPY public/ /usr/share/nginx/html/
