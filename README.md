# Aboutme Modern Stack

本项目已重构为前后端分离架构：

- 后端：Django 4 + DRF + MySQL（容器 `c-service`）
- 前端：React + Vite（容器 `c-web`）
- 数据库：MySQL 8（容器 `c-mysql`）

## 目录结构

- `backend/` Django API 服务
- `frontend/` React SPA
- `deploy/nginx.conf` 反向代理与 SPA 回退
- `docker-compose.yml` 三容器编排
- `scripts/build.sh` / `scripts/deploy.sh` 构建部署脚本

## 快速开始

1. 复制环境变量：

```bash
cp .env.example .env
```

2. 构建镜像：

```bash
./scripts/build.sh
```

3. 启动服务：

```bash
./scripts/deploy.sh
```

4. 访问：

- 前端：`http://localhost`
- Django Admin：`http://localhost/admin/`
- API 入口：`http://localhost/api/`

## 关键 API

- 登录：`POST /api/auth/token/`
- 博客：`/api/blog/articles/`
- 工具：`/api/tools/home/`
- 导航：`/api/nav/sites/home/`
- 图片上传：`POST /api/uploads/images/`

## 注意事项

- 首次启动时 `c-service` 会自动执行 `migrate`。
- 生产环境务必修改 `DJANGO_SECRET_KEY`、数据库密码和 `ALLOWED_HOSTS`。
- 旧版 `UEditor` 路径和 Django 模板页面已不再作为主流程依赖。 