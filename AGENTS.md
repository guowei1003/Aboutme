# Kapibala 博客项目 - AI Agent 上下文

## 项目概述

**AI芝士** 是一个基于 Hexo 的中文静态博客，副标题「慢慢熟成的知识实验室」。Fluid 1.9.9 主题已完整 fork 到 `themes/fluid/` 并深度定制（16 个 ejs + `source/css/custom.css`）。静态文件由 GitHub Actions 构建，服务器只运行官方 Nginx 容器并挂载产物目录。

- **站点地址**: https://kapibala.uno
- **技术栈**: Hexo 7.3.0 + Fluid 1.9.9 (本地 fork) + GitHub Actions + Nginx (Docker)
- **当前开发分支**: `3.0.0`（`master` 停留在 2016 年的历史提交）
- **评论系统**: 配置中保留 Waline，但当前未渲染，服务器也无 Waline 后端
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
│   │   └── index.md            # 进化记录页面 (自定义页面)
│   ├── _data/                  # 站点文案/排期数据 (未被模板引用，坏链已修正)
│   ├── privacy/                # 遗留副本 (被 Nginx alias 遮蔽，勿改)
│   ├── css/
│   │   └── custom.css          # 定制视觉样式 (约 1600 行)
│   └── js/
│       └── custom.js           # 自定义脚本
├── themes/fluid/               # Fluid 主题本地 fork，已入库并定制
├── privacy/                    # 唯一生效的隐私页来源 (index.html + Nginx alias)
├── nginx/
│   └── nginx.conf              # Nginx 配置
├── ssl/                        # SSL 证书目录 (当前已入库，见「注意事项」)
│   ├── kapibala.uno.key
│   └── kapibala.uno.pem
├── _config.yml                 # Hexo 站点配置
├── _config.fluid.yml           # Fluid 主题配置 (覆盖默认)
├── docker-compose.yml          # 官方 nginx:alpine + 挂载 ./public
├── Dockerfile                  # 应急离线构建 (生产不用)
├── .dockerignore               # 排除 ssl/ 私钥、.git 等
├── .gitignore                  # 忽略 ssl/；锁文件已入库
├── deploy-server.sh            # 服务器上启动/重启容器
├── package.json                # Node.js 依赖
└── package-lock.json           # 已入库，全部指向 registry.npmjs.org
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
# 发布内容：push 到 3.0.0（或在 GitHub Actions 手动 workflow_dispatch）
# CI 构建 public/ 并 rsync 到服务器 /data/aboutme/public，容器实时挂载，无需重启

# 仅在首次部署、或 nginx.conf / docker-compose.yml / ssl 变更后，在服务器执行
./deploy-server.sh

# 服务器目录（compose 以该目录为基准做相对挂载）
# /data/aboutme/{docker-compose.yml,nginx/,ssl/,public/,privacy/}
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
- 导航菜单: 首页、AI 日报、观点与方法、进化记录
- 评论: 已在 `post.comments` 显式关闭（`type: ''`）；Waline 参数保留备用，后端未部署
- 搜索功能: 本地搜索
- 夜间模式: 自动切换

---

## 部署流程

### 自动发布内容 (推荐)

1. 推送代码到 `3.0.0`（`main` / `master` 同样触发），或在 Actions 里手动 `workflow_dispatch`
2. GitHub Actions 检出仓库、`npm ci`（锁文件已入库，全部指向公共源）、`hexo clean && hexo generate`
3. rsync 把 `public/` 同步到 `/data/aboutme/public`（`--delete`），把 `privacy/` 同步到 `/data/aboutme/privacy`
4. 容器以 bind mount 读取这两个目录，**内容发布无需重启容器**

> CI 是唯一的构建源。`themes/fluid/` 已入库，Hexo 优先加载该目录，工作流不会额外安装官方主题包。

**GitHub Secrets 配置**:
- `SERVER_SSH_KEY`: SSH 私钥
- `SERVER_HOST`: 服务器 IP
- `SERVER_USER`: 服务器用户名

### 手动发布 / 首次部署

```bash
# 1. 本地构建
npm run clean && npm run generate

# 2. 同步到服务器
rsync -avz --delete ./public/ root@SERVER_IP:/data/aboutme/public/

# 3. 首次部署或配置变更后，在服务器启动容器
ssh root@SERVER_IP "cd /data/aboutme && ./deploy-server.sh"
```

> 顺序要求：`./public/index.html` 必须先存在；若容器先挂载了空目录，站点会 404。
> nginx.conf、docker-compose.yml、SSL 证书不在 CI 同步范围内，修改后需手动拷贝并重跑 `deploy-server.sh`。
> 静态文件名不带内容哈希，Nginx 对 HTML 设 `no-cache`、静态资源最长缓存 1 小时，避免发布后读者看到旧样式。

---

## Docker 服务

### 架构

生产环境**不构建站点镜像**：`docker-compose.yml` 直接使用官方 `nginx:alpine`，静态文件由 CI 同步到服务器后挂载进容器。根目录的 `Dockerfile`（旧的多阶段 Hexo 构建）已不被 compose 引用，保留仅为历史参考，不要再用它发布。

```
GitHub Actions ──rsync──> /data/aboutme/public ──bind mount──> nginx:alpine :8888
                    └────> /data/aboutme/privacy ──alias────> /privacy/
```

### docker-compose.yml 服务

- **web**: `nginx:alpine`，宿主 `8888` → 容器 `80`（HTTP）；容器 `443` 仍监听 TLS 但默认不对外映射
- 端口选择原因: 服务器 80 已被 collectcar-nginx 占用；如需 HTTPS，追加 `"8443:443"` 并用前置反代终结域名流量
- 挂载: `nginx.conf`、`ssl/`、`public/`（→ `/usr/share/nginx/html`）、`privacy/`

---

## 注意事项

### 写作规范

1. 文章使用 UTF-8 编码的 Markdown 格式
2. 图片放置在文章同名的资源文件夹中 (开启 `post_asset_folder`)
3. 文件名使用英文，标题可使用中文

### Git 规范

- 忽略文件: `node_modules/`, `public/`, `db.json`, `.DS_Store`, `ssl/`
- `package-lock.json` 已入库（246 条 `resolved` 全部指向 `registry.npmjs.org`），CI 用 `npm ci` 保证可复现
- **待处理**: `ssl/kapibala.uno.key`（私钥）仍在 Git 历史中，需轮换证书并清理历史；`.gitignore` / `.dockerignore` 只能防止新增文件
- 隐私页以顶层 `privacy/` 为唯一生效来源；`source/privacy/` 为遗留副本，被 Nginx alias 遮蔽

### 常见问题

1. **主题未生效**: 检查 `_config.fluid.yml` 是否在根目录
2. **样式异常**: 运行 `hexo clean` 后重新生成
3. **部署失败**: 检查 GitHub Secrets 配置和服务器 SSH 连接
4. **内容没更新**: 确认 CI 已同步 `public/` 到 `/data/aboutme/public`，且服务器 compose 已挂载 `./public`；配置类改动需手动同步后重跑 `deploy-server.sh`
5. **`/privacy/` 403**: 顶层 `privacy/index.html` 必须存在（Nginx alias 不会回退到镜像内 `public/privacy/`）

---

## 快速参考

| 任务 | 命令 |
|------|------|
| 本地预览 | `npm run server` |
| 新建文章 | `npm run new "标题"` |
| 构建站点 | `npm run generate` |
| 清理缓存 | `npm run clean` |
| 发布内容 | `git push origin 3.0.0` 或 Actions 手动触发 |
| 应急离线构建 | `npm ci && npm run generate && docker build -t kapibala-web:emergency .` |
