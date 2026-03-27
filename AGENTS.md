# Kapibala 博客项目 - AI Agent 上下文

## 项目概述

**Kapibala** 是一个基于 Hexo 的静态博客网站，主题为"AI 加持下的人类进化"。项目使用 Fluid 主题，通过 Docker 容器化部署，并借助 GitHub Actions 实现自动化 CI/CD。

- **站点地址**: https://kapibala.uno
- **技术栈**: Hexo 7.3.0 + Fluid 主题 + Docker + Nginx
- **评论系统**: Waline
- **语言**: 中文 (zh-CN)

---

## 项目结构

```
Aboutme/
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 自动部署配置
├── source/
│   ├── _posts/                 # 博客文章 (Markdown)
│   ├── evolution/
│   │   └── index.md            # 进化页面 (自定义页面)
│   ├── css/
│   │   └── custom.css          # 自定义样式
│   └── js/
│       └── custom.js           # 自定义脚本
├── nginx/
│   └── nginx.conf              # Nginx 配置
├── ssl/                        # SSL 证书目录
│   ├── kapibala.uno.key
│   └── kapibala.uno.pem
├── _config.yml                 # Hexo 站点配置
├── _config.fluid.yml           # Fluid 主题配置 (覆盖默认)
├── docker-compose.yml          # Docker Compose 配置
├── Dockerfile                  # Docker 构建文件
├── deploy-server.sh            # 服务器部署脚本
└── package.json                # Node.js 依赖
```

---

## 开发命令

### 本地开发

```bash
# 安装依赖
npm install

# 创建新文章
npm run new "文章标题"

# 本地预览 (http://localhost:4000)
npm run server

# 清理缓存
npm run clean

# 生成静态文件
npm run generate

# 完整启动 (清理 + 生成 + 预览)
npm run start
```

### 部署相关

```bash
# 服务器上执行部署
./deploy-server.sh

# Docker 构建
docker build -t kapibala-web .

# Docker Compose 启动
docker compose up -d
```

---

## 内容类型

### 1. 博客文章

位置: `source/_posts/`

Front-matter 格式:
```yaml
---
title: 文章标题
date: 2024-01-15 10:00:00
tags: [标签1, 标签2]
categories: [分类]
---
```

### 2. AI 日报

使用特定分类 `AI-Daily`，自动归集到菜单。

```yaml
---
title: 2024-01-15 AI 日报
date: 2024-01-15 08:00:00
categories:
  - AI-Daily
tags: [日报, AI]
---
```

### 3. 自定义页面

如 `source/evolution/index.md`，支持内嵌 HTML 和 CSS。

---

## 写作教程

### 创建新文章

```bash
# 方式一：使用 npm 命令
npm run new "我的第一篇文章"

# 方式二：直接使用 hexo
npx hexo new "我的第一篇文章"
```

这会在 `source/_posts/` 目录下生成 `我的第一篇文章.md` 文件。

### 文章完整格式

```markdown
---
title: 我的第一篇文章
date: 2024-01-20 10:00:00
tags: [标签1, 标签2]
categories: [分类]
cover: /img/my-cover.jpg    # 可选：封面图片
---

这里是正文内容...

## 一级标题

正文段落...

### 二级标题

更多内容...
```

### 文章类型模板

**普通博客**
```yaml
---
title: 技术分享
date: 2024-01-20 10:00:00
tags: [技术, 教程]
categories: [技术分享]
---
```

**AI 日报** (自动归类到菜单)
```yaml
---
title: 2024-01-20 AI 日报
date: 2024-01-20 08:00:00
categories:
  - AI-Daily
tags: [日报, AI]
---
```

**自定义页面**
```bash
# 创建页面
npx hexo new page "about"
# 生成 source/about/index.md
```

### 本地预览流程

```bash
# 完整流程：清理 → 生成 → 预览
npm run start

# 访问 http://localhost:4000 检查效果
```

---

## 图片配置

### 所需图片清单

| 图片文件 | 用途 | 建议尺寸 | 配置位置 |
|----------|------|----------|----------|
| `banner.jpg` | 页面横幅 | 1920×400px | `_config.fluid.yml` |
| `default-cover.jpg` | 文章默认封面 | 800×400px | `_config.fluid.yml` |
| `favicon.ico` | 网站图标 | 32×32 或 64×64 | `_config.fluid.yml` |
| `loading.gif` | 图片加载占位 | 可选 | `_config.fluid.yml` |

### 图片目录结构

```
source/
├── img/                      # 全局图片目录
│   ├── banner.jpg
│   ├── default-cover.jpg
│   ├── favicon.ico
│   └── loading.gif
└── _posts/
    ├── 文章标题.md
    └── 文章标题/              # 文章资源文件夹
        └── screenshot.png
```

### 文章中添加图片

**方式一：资源文件夹（推荐）**

在 `_config.yml` 中确认 `post_asset_folder: true`，创建文章时会自动生成同名文件夹：

```
source/_posts/
├── 我的第一篇文章.md
└── 我的第一篇文章/
    └── screenshot.png
```

引用方式：
```markdown
# Hexo 标签语法（推荐）
{% asset_img screenshot.png 图片描述 %}

# 标准 Markdown（需开启 marked 配置）
![图片描述](screenshot.png)
```

**方式二：全局图片目录**

将图片放入 `source/img/` 目录，引用方式：
```markdown
![图片描述](/img/screenshot.png)
```

### 图片配置问题排查

1. **图片不显示**：检查文件是否存在于 `source/img/` 目录
2. **路径错误**：确保路径以 `/img/` 开头，不要用相对路径
3. **缓存问题**：运行 `hexo clean` 后重新生成

---

## 配置文件说明

### _config.yml (站点配置)

关键配置项:
- `url`: https://kapibala.uno
- `theme`: fluid
- `language`: zh-CN
- `timezone`: Asia/Shanghai

### _config.fluid.yml (主题配置)

关键配置项:
- 导航菜单: 博客、AI 日报、进化
- 评论系统: Waline (`serverURL: https://kapibala.uno/comments`)
- 搜索功能: 本地搜索
- 夜间模式: 自动切换

---

## 部署流程

### 自动部署 (推荐)

1. 推送代码到 `main` 或 `master` 分支
2. GitHub Actions 自动触发
3. 构建 Hexo 静态文件
4. 通过 SSH 同步到服务器 `/data/aboutme/public`

**GitHub Secrets 配置**:
- `SERVER_SSH_KEY`: SSH 私钥
- `SERVER_HOST`: 服务器 IP
- `SERVER_USER`: 服务器用户名

### 手动部署

```bash
# 1. 本地构建
hexo clean && hexo generate

# 2. 同步到服务器
rsync -avz --delete ./public/ root@SERVER_IP:/data/aboutme/public/

# 3. 重启服务
ssh root@SERVER_IP "cd /data/aboutme && docker compose restart"
```

---

## Docker 服务

### 架构

Dockerfile 采用多阶段构建:
1. **构建阶段**: Node.js 18 Alpine，安装依赖并构建 Hexo
2. **运行阶段**: Nginx Alpine，托管静态文件

### docker-compose.yml 服务

- **web**: Nginx 容器，端口 80/443
- 挂载: nginx.conf、SSL 证书、静态文件

---

## 注意事项

### 写作规范

1. 文章使用 UTF-8 编码的 Markdown 格式
2. 图片放置在文章同名的资源文件夹中 (开启 `post_asset_folder`)
3. 文件名使用英文，标题可使用中文

### Git 规范

- 忽略文件: `node_modules/`, `public/`, `db.json`, `.DS_Store`
- 敏感文件: SSL 证书不应提交到仓库

### 常见问题

1. **主题未生效**: 检查 `_config.fluid.yml` 是否在根目录
2. **样式异常**: 运行 `hexo clean` 后重新生成
3. **部署失败**: 检查 GitHub Secrets 配置和服务器 SSH 连接

---

## 快速参考

| 任务 | 命令 |
|------|------|
| 本地预览 | `npm run server` |
| 新建文章 | `npm run new "标题"` |
| 构建站点 | `npm run generate` |
| 清理缓存 | `npm run clean` |
| 部署触发 | `git push origin main` |
