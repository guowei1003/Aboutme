# Aivora Clone Multi-Service Stack

本项目按「AI日报 + AI商机 + 个人主页」重构为 React 前端 + Python 多服务后端。

## 服务架构

- `frontend`：React + Vite，页面复刻入口
- `api-gateway`：统一 `/api/*` 入口（BFF）
- `daily-service`：日报、机器人配置、任务状态
- `biz-service`：AI 商机内容
- `profile-service`：个人主页内容
- `scheduler-worker`：定时抓取与 AI 生成任务
- `c-mysql`：MySQL
- `redis`：任务与缓存依赖

## 目录

- `frontend/` 前端工程
- `services/` 多服务后端
- `services/db/schema.sql` 数据库表结构
- `deploy/nginx.conf` 网关转发配置
- `docker-compose.yml` 多容器编排

## 快速启动

```bash
cp .env.example .env
docker compose up --build -d
```

访问：

- 站点：`http://localhost`
- API：`http://localhost/api/`

## 核心接口

- 日报：`GET /api/daily/issues`
- 日报详情：`GET /api/daily/issues/{date}`
- 机器人配置：`POST /api/daily/robots`
- 抓取任务：`GET /api/daily/jobs`
- 商机列表：`GET /api/biz/issues`
- 个人主页：`GET /api/profile`

## 说明

- 当前抓取与 AI 生成使用可替换管道实现，已预留真实 LLM 接入配置。
- 如需持久化生产数据，请将 `services/db/schema.sql` 导入 MySQL，并替换内存仓储实现。