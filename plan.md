# 🚀 Kapibala 博客完整方案（开发 +Docker 部署）

这是一份**从本地开发到 Docker 容器化部署**的完整方案，确保**零宿主机污染**，所有服务均运行在容器内。

---

## 📋 方案总览

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   本地开发      │      │   GitHub        │      │   你的服务器    │
│                 │      │                 │      │                 │
│  写 Markdown    │ ───► │  代码托管       │ ───► │  Docker 容器    │
│  hexo g 构建    │      │  Actions 构建   │      │  Nginx+Waline   │
│  git push       │      │  同步文件       │      │  静态文件服务   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                        │                        │
         └────────────────────────┴────────────────────────┘
                              ↓
                    https://kapibala.uno
```

---

## 🛠️ 第一部分：本地开发环境

### 1.1 安装必要工具

| 工具 | 版本要求 | 下载链接 |
| :--- | :--- | :--- |
| **Node.js** | v18+ LTS | [nodejs.org](https://nodejs.org/) |
| **Git** | 最新 | [git-scm.com](https://git-scm.com/) |
| **VS Code** | 最新 | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Docker Desktop** | 最新 (可选) | [docker.com](https://docker.com/) |

**验证安装：**
```bash
node -v          # 应显示 v18.x.x
npm -v           # 应显示 9.x.x
git --version    # 应显示 git version 2.x.x
```

### 1.2 初始化博客项目

```bash
# 1. 创建项目目录（目前就是项目目录）
cd ~/code/Aboutme

# 2. 初始化 Hexo
hexo init .
npm install

# 3. 安装主题 (Fluid)
git clone https://github.com/fluid-dev/hexo-theme-fluid.git themes/fluid

# 4. 初始化 Git 仓库(git 仓库已经存在)
git add .
git commit -m "init: kapibala blog"
```

### 1.3 项目目录结构

```
Aboutme/
├── .github/
│   └── workflows/
│       └── deploy.yml          # 【部署】GitHub Actions 配置
├── source/
│   ├── _posts/                 # 【开发】博客文章
│   ├── evolution/
│   │   └── index.md            # 【开发】进化页面
│   ├── img/                    # 【开发】静态图片
│   └── js/                     # 【开发】自定义 JS
├── themes/
│   └── fluid/                  # 主题源码 (不修改)
├── .gitignore                  # 【部署】Git 忽略规则
├── _config.yml                 # 【开发】站点配置
├── _config.fluid.yml           # 【开发】主题配置
├── docker-compose.yml          # 【部署】服务器 Docker 配置
├── nginx/
│   └── nginx.conf              # 【部署】Nginx 配置
└── package.json
```

---

## ⚙️ 第二部分：开发配置

### 2.1 站点配置 (`_config.yml`)

```yaml
# 站点信息
title: Kapibala
subtitle: AI 加持下的人类进化
description: 记录 AI 时代的人类进化历程
author: Your Name
language: zh-CN
timezone: Asia/Shanghai

# 网址
url: https://kapibala.uno
root: /

# 文章设置
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true

# 部署配置 (GitHub Pages 或 跳过)
deploy:
  type: ''
```

### 2.2 主题配置 (`_config.fluid.yml`)

**注意：** 在根目录创建此文件，会覆盖主题默认配置。

```yaml
# 导航菜单
menu:
  - { name: "博客", link: "/", icon: "icon-home" }
  - { name: "AI 日报", link: "/categories/AI-Daily/", icon: "icon-calendar" }
  - { name: "进化", link: "/evolution/", icon: "icon-star" }

# 页面配置
page:
  evolution:
    layout: page

# 页脚
footer:
  content: 'Powered by <a href="https://hexo.io">Hexo</a> & <a href="https://github.com/fluid-dev/hexo-theme-fluid">Fluid</a> | © 2024 Kapibala'

# 评论系统 (Waline)
waline:
  enable: true
  serverURL: https://kapibala.uno/comments
  path: window.location.pathname
  meta: ["nick", "mail", "link"]
  requiredMeta: ["nick", "mail"]
```

### 2.3 Git 忽略规则 (`.gitignore`)

```gitignore
# 依赖
node_modules/
package-lock.json

# 生成的静态文件 (服务器会重新构建)
public/
.db.json

# 系统文件
.DS_Store
Thumbs.db

# 日志
*.log

# 本地配置 (敏感信息)
_config.local.yml
```

---

## 📝 第三部分：内容创作

### 3.1 博客文章 (Blog)

```bash
# 创建新文章
hexo new post "文章标题"
```

**文件：** `source/_posts/文章标题.md`

```markdown
---
title: 文章标题
date: 2024-01-15 10:00:00
tags: [AI, 技术]
categories: [技术]
---
这里是正文内容...
```

### 3.2 AI 日报 (AI Daily)

**核心逻辑：** 使用分类 `AI-Daily`，所有日报自动归集到菜单。

```bash
hexo new post "2024-01-15 AI 日报"
```

**文件：** `source/_posts/2024-01-15-AI-日报.md`

```markdown
---
title: 2024-01-15 AI 日报
date: 2024-01-15 08:00:00
categories:
  - AI-Daily
tags: [日报，AI]
---
## 📰 今日要闻
1. ...
2. ...

## 💡 思考
...
```

### 3.3 进化页面 (Evolution)

**文件：** `source/evolution/index.md`

```markdown
---
title: 进化
layout: page
---

<div class="evolution-container">
  <div class="mission">
    <h2>🧬 AI 加持下的人类进化</h2>
    <p>记录人类与 AI 共生的每一步</p>
  </div>

  <div class="timeline">
    <div class="item">
      <span class="date">2024.01</span>
      <p>网站上线，确立进化主旨</p>
    </div>
    <div class="item">
      <span class="date">2024.02</span>
      <p>AI 工作流整合完成</p>
    </div>
  </div>
</div>

<style>
.evolution-container{max-width:800px;margin:40px auto;padding:0 20px}
.mission{text-align:center;margin-bottom:50px}
.mission h2{color:#007bff}
.timeline{border-left:2px solid #e0e0e0;padding-left:30px}
.item{margin-bottom:30px;position:relative}
.item::before{content:'';position:absolute;left:-36px;top:5px;width:14px;height:14px;background:#007bff;border-radius:50%}
.date{font-weight:bold;color:#007bff}
</style>
```

### 3.4 本地预览

```bash
# 启动本地服务器
hexo clean && hexo generate && hexo server

# 访问 http://localhost:4000
```

---

## 🐳 第四部分：Docker 容器化部署

### 4.1 服务器准备

**前提：** 服务器已安装 Docker 和 Docker Compose

```bash
# 检查 Docker
docker --version
docker compose version

# 创建部署目录
sudo mkdir -p /data/aboutme/{nginx,ssl,waline,public}
cd /data/aboutme
```

### 4.2 Docker Compose 配置

**文件：** 根目录 `docker-compose.yml` (需要提交到 Git)

```yaml
version: '3.8'

services:
  # Web 服务器
  nginx:
    image: nginx:alpine
    container_name: kapibala-web
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./public:/usr/share/nginx/html:ro
      - ./ssl:/etc/ssl/certs:ro
    networks:
      - kapibala-net
    depends_on:
      - waline

  # 评论系统
  waline:
    image: waline/waline:latest
    container_name: kapibala-waline
    restart: always
    environment:
      - SITE_NAME=Kapibala
      - AUTHOR_EMAIL=cdivid1003@gmail.com
      - SERVER_NAME=kapibala.uno
    volumes:
      - ./waline/data:/waline/data
    networks:
      - kapibala-net

networks:
  kapibala-net:
    driver: bridge
```

### 4.3 Nginx 配置

**文件：** `nginx/nginx.conf`

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    server {
        listen 80;
        server_name kapibala.uno www.kapibala.uno;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name kapibala.uno www.kapibala.uno;
        
        ssl_certificate /etc/ssl/certs/kapibala.crt;
        ssl_certificate_key /etc/ssl/certs/kapibala.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        
        root /usr/share/nginx/html;
        index index.html;
        
        # 评论系统代理
        location /comments/ {
            proxy_pass http://waline:2333/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        location / {
            try_files $uri $uri/ =404;
        }
    }
}
```

### 4.4 服务器部署脚本

**文件：** `deploy-server.sh` (在服务器上运行)

```bash
#!/bin/bash
set -e

echo "🚀 Kapibala Docker 部署开始..."

cd /data/aboutme

# 1. 生成自签名证书 (首次运行)
if [ ! -f ./ssl/kapibala.crt ]; then
    echo "📜 生成 SSL 证书..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ./ssl/kapibala.key \
        -out ./ssl/kapibala.crt \
        -subj "/CN=kapibala.uno"
fi

# 2. 创建必要目录
mkdir -p ./public ./waline/data

# 3. 拉取最新代码 (如果源码在服务器)
# git pull origin main

# 4. 启动容器
docker compose pull
docker compose up -d

# 5. 清理旧镜像
docker image prune -f

echo "✅ 部署完成！访问 https://kapibala.uno"
```

---

## 🔄 第五部分：自动化部署 (GitHub Actions)

### 5.1 Workflow 配置

**文件：** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Kapibala Server

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Dependencies
        run: npm install

      - name: Generate Static Files
        run: npx hexo clean && npx hexo generate

      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v4
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_USER: ${{ secrets.SERVER_USER }}
          TARGET: /opt/kapibala/public
          SOURCE: "public/"
          ARGS: "-avz --delete"
```

### 5.2 GitHub Secrets 配置(已经配置完成)

在 GitHub 仓库 `Settings → Secrets and variables → Actions` 添加：

| Secret 名 | 值 | 说明 |
| :--- | :--- | :--- |
| `SERVER_HOST` | `你的服务器 IP` | 服务器地址 |
| `SERVER_USER` | `root` | 服务器用户 |
| `SERVER_SSH_KEY` | `私钥内容` | SSH 私钥 (全文) |

**生成 SSH 密钥：**
```bash
# 本地生成
ssh-keygen -t ed25519 -C "github-actions"

# 复制私钥到 GitHub Secrets
cat ~/.ssh/id_ed25519

# 公钥添加到服务器
ssh-copy-id root@你的服务器 IP
```

---

## 📅 第六部分：日常开发部署流程

### 6.1 完整工作流

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 创建新文章
hexo new post "2024-01-16 AI 日报"

# 3. 编辑文章 (VS Code)
code source/_posts/2024-01-16-AI-日报.md

# 4. 本地预览
hexo clean && hexo generate && hexo server
# 访问 http://localhost:4000 检查

# 5. 提交代码
git add .
git commit -m "feat: 更新 2024-01-16 AI 日报"

# 6. 推送 (触发自动部署)
git push origin main

# 7. 等待 2-5 分钟，访问 https://kapibala.uno 查看更新
```

### 6.2 手动部署 (备用)

```bash
# 本地构建后手动同步到服务器
hexo clean && hexo generate

# 使用 rsync 同步
rsync -avz --delete ./public/ root@你的服务器 IP:/data/aboutme/public/

# 服务器重启容器
ssh root@你的服务器 IP "cd /data/aboutme && docker compose restart nginx"
```

---

## 🛡️ 第七部分：Cloudflare 配置

### 7.1 DNS 解析

| 类型 | 名称 | 内容 | 代理状态 |
| :--- | :--- | :--- | :--- |
| A | @ | 服务器 IP | 🟠 已代理 |
| A | www | 服务器 IP | 🟠 已代理 |

### 7.2 SSL/TLS 设置

1. 进入 Cloudflare 面板 → SSL/TLS
2. 加密模式选择 **Full** (服务器有自签名证书即可)
3. 开启 **Always Use HTTPS**
4. 开启 **Auto Rewrite HTTPS**

---

## ✅ 第八部分：验收清单

### 开发验收
- [ ] 本地 `hexo s` 可以正常预览
- [ ] 三个菜单都可以点击并正常跳转
- [ ] AI 日报按日期倒序排列
- [ ] 进化页面时间轴显示正常
- [ ] 评论系统可以加载

### 部署验收
- [ ] `docker compose up -d` 容器正常启动
- [ ] `https://kapibala.uno` 可以访问
- [ ] SSL 证书正常 (浏览器显示锁图标)
- [ ] `git push` 后自动部署生效
- [ ] 评论可以正常提交

### 安全验收
- [ ] SSH 密钥登录 (禁用密码)
- [ ] 防火墙只开放 80/443/22
- [ ] Docker 容器非 root 运行 (可选)
- [ ] 定期备份 `/data/aboutme/waline/data`

---

## 📊 完整文件清单

| 文件 | 位置 | 用途 | 修改频率 |
| :--- | :--- | :--- | :--- |
| `_config.yml` | 根目录 | 站点配置 | 低 |
| `_config.fluid.yml` | 根目录 | 主题配置 | 低 |
| `source/_posts/*.md` | source | 文章/日报 | **高** |
| `source/evolution/index.md` | source | 进化页面 | 中 |
| `docker-compose.yml` | 根目录 | Docker 配置 | 极低 |
| `nginx/nginx.conf` | nginx | Nginx 配置 | 极低 |
| `.github/workflows/deploy.yml` | .github | 自动部署 | 极低 |
| `.gitignore` | 根目录 | Git 忽略 | 极低 |

---

## 🎯 总结

这套方案实现了：

1. **本地开发**：Hexo + Markdown 写作，本地预览
2. **Docker 部署**：所有服务容器化，零宿主机污染
3. **自动部署**：Git Push 触发 GitHub Actions 自动同步
4. **三个菜单**：博客、AI 日报 (分类)、进化 (自定义页面)
5. **评论系统**：Waline 容器化部署
6. **SSL 证书**：Cloudflare + 自签名证书

**现在就开始：**
```bash
cd ~/code/Aboutme
hexo new post "Hello Kapibala"
hexo s
```