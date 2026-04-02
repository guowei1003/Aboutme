# 阶段1: 构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package.json ./
RUN npm install --registry=https://registry.npmmirror.com

# 安装主题
RUN npm install hexo-theme-fluid --no-save --registry=https://registry.npmmirror.com && \
    mkdir -p themes && \
    cp -r node_modules/hexo-theme-fluid themes/fluid

# 复制源代码
COPY . .

# 构建
RUN npx hexo clean && npx hexo generate

# 阶段2: 生产镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/public /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
