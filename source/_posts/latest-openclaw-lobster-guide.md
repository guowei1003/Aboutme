---
title: 最新“龙虾”养殖方法：普通人也能跑通的 OpenClaw 一条龙部署指南
date: 2026-04-03 20:00:00
tags: [OpenClaw, Agents, 部署指南, 新手入门, AI 工具]
categories: [芝士力量]
description: 面向新手梳理 OpenClaw 的定位、部署路线、模型入口与首轮验证流程，帮助普通人尽快跑通一套可用的自托管 Agent 系统。
keywords: [OpenClaw 部署, OpenClaw 教程, Agent 部署指南, Qwen Portal, Ollama, 自托管 Agent]
cover: /img/posts/latest-openclaw-lobster-guide/lobster-guide-cover.svg
index_img: /img/posts/latest-openclaw-lobster-guide/lobster-guide-cover.svg
---

如果你第一次听到 OpenClaw，先别被名字吓到。它不是一只会自己长大的“龙虾”，也不是装完就自动通灵的万能机器人。先说清楚：本文里的“龙虾”不是麻辣十三香那位，而是 [OpenClaw](https://docs.openclaw.ai/start/getting-started) 这套自托管 Agent 系统。

更准确地说，它是一套把模型、消息渠道、工作区、工具和规则串起来的个人 AI 助手框架。你可以把它理解成一套“养殖系统”：模型是“脑子”，渠道是“投喂口”，Dashboard 是“观察窗”，Gateway 才是那个把水泵、阀门、池子全接起来的中控。很多人一上来就盯着模型参数，结果系统没跑稳，像是虾苗没下水，先把海报贴出去了。

截至 `2026-04-03` 的公开资料，如果你的目标是“普通人尽快跑通一套真正能工作的 OpenClaw”，最顺的主线不是先折腾企业级平台，也不是一头扎进重型私有化，而是先按 [OpenClaw 官方安装与入门流程](https://docs.openclaw.ai/install) 跑通本地闭环，再根据预算与折腾意愿，选 `Qwen Portal` 免费层或 `Ollama` 本地模型做第一批“饲料”。

![OpenClaw 不是一只虾，而是一整套养殖系统](/img/posts/latest-openclaw-lobster-guide/lobster-guide-cover.svg)

## 一、先说人话：这只“龙虾”到底是什么

[OpenClaw](https://docs.openclaw.ai/start/getting-started) 官方把自己定义成一套面向个人助手场景的自托管系统。你可以把它理解成：

- `Gateway`：中控层，负责接模型、接渠道、管会话、管工具。
- `Dashboard / Control UI`：管理面，方便你在浏览器里观察和操作。
- `Agent Workspace`：助手平时活动和沉淀记忆的目录，不是硬沙箱。
- `Model Provider`：真正出推理结果的模型来源，比如 `Qwen Portal`、`Ollama`、`OpenAI`。
- `Channels`：Telegram、WhatsApp 之类的外部入口。

这里最容易搞混的三个点，先打掉：

1. 浏览器里能聊，不等于你已经“部署完成”。那通常只是管理面打通了。
2. OpenClaw 不是模型本体，它更像把模型、工具、渠道和记忆装进同一个系统的“龙虾养殖箱”。
3. `workspace` 不是硬隔离环境，官方安全文档明确提醒过，不要把默认工作目录误当成沙箱。

## 二、先别急着下池子：你其实有 3 种养法

如果把今天市面上的 Agent 平台都放在同一个水族馆里，大致能分成三种“养法”：

1. `原生自托管型`
代表：`OpenClaw`、`Coze Studio`
特点：你自己养系统，控制力更强，但也要自己管运行、权限、模型和安全。

2. `云端发布型`
代表：`扣子 Coze`、`腾讯元器`、`腾讯云 ADP`、`阿里云百炼`
特点：平台帮你养系统，你主要负责配置、调试、发布和接入。

3. `托管衍生型`
代表：`ArkClaw`
特点：更像托管版 OpenClaw 或平台化包装后的专用形态，省运维，但选择权通常更少。

本文主线为什么选 `OpenClaw 原生自托管`？因为你要的是“部署的一条龙”，而不是“快速发布一个能分享的智能体页面”。这两个目标像“自己搭鱼池”和“租一间餐厅后厨”，都能出菜，但不是同一个技能树。

![先决定你是要自己养系统，还是要快速上桌](/img/posts/latest-openclaw-lobster-guide/lobster-guide-decision.svg)

## 三、一张表看懂：字节、腾讯、阿里、OpenClaw 到底差在哪

先看主表，小白只要盯住 `本质`、`最快闭环` 和 `适合谁` 这三列，基本就不会下错池子。

| 平台 | 本质 | 是不是自己养系统 | 最快闭环 | 免费入口 | 适合谁 | 一句话结论 |
| --- | --- | --- | --- | --- | --- | --- |
| `OpenClaw` | 自托管 Agent 运行时 | 是 | 本机跑起 Gateway + Dashboard | `Qwen Portal`、`Ollama`、订阅型 OAuth | 想真正拥有一套自己的 Agent 系统的人 | 最像“自己养龙虾” |
| `扣子 Coze` | 云端智能体发布平台 | 否 | 控制台里创建后直接发布 | 官网可见“免费开始” | 想最快上线一个可分享智能体的人 | 更像“租一个现成餐位” |
| `腾讯元器` | 轻量云端智能体发布平台 | 否 | 创建后发布到元器或 API | 官方文档可见月度额度 | 想零代码快速做应用的人 | 腾讯系里最像“快开张” |
| `腾讯云 ADP` | 企业级智能体开发与发布平台 | 否 | 测试环境调试后发布正式环境 | 有免费版套餐，但和部署 OpenClaw 不是一回事 | 团队、企业、正式业务场景 | 更重、更正规，也更不适合当第一只练手虾 |
| `阿里云百炼` | 智能体/工作流应用平台 | 否 | 创建应用后发布并分享/API 集成 | 新用户免费 tokens 较清晰 | 想快做智能体、也想保留一定平台能力的人 | 云平台里资料透明度较高 |

再补三位容易被忽略的“旁支亲戚”：

- [`Coze Studio`](https://github.com/coze-dev/coze-studio/wiki/2.-Quickstart)：是开源自托管路线，确实能“自己养”，但它更像自己部署一套扣子式平台，而且按官方 Wiki，起服务后还要继续做[模型配置](https://github.com/coze-dev/coze-studio/wiki/3.-Model-configuration)，并不是容器一跑就万事大吉。
- [`火山方舟 Ark`](https://www.volcengine.com/docs/82379/1159200?lang=zh)：更偏模型与推理资源平台，它更像“饲料供应商”，不是完整养殖箱。
- [`ArkClaw`](https://www.volcengine.com/docs/87732)：更接近“字节托管版 OpenClaw”思路，目前公开口径更偏付费托管而不是通用免费部署。

![云发布、自托管、轻运维、重运维，不是一个维度的吵架](/img/posts/latest-openclaw-lobster-guide/lobster-guide-comparison.svg)

## 四、普通人最容易跑通的一条龙：我推荐这条主线

如果你问我：“普通人今天最容易成功养出一只能动的 OpenClaw，到底走哪条线？”

我的推荐是：

`OpenClaw 原生部署 + Qwen Portal 免费层 + 本机 Dashboard 首次验证 + Telegram 作为第一个外部渠道`

为什么是它？

1. `OpenClaw 原生部署` 是官方主路径，概念最直，学到的东西最不容易跑偏。
2. `Qwen Portal` 在 [OpenClaw 官方 Provider 文档](https://docs.openclaw.ai/providers/qwen) 里明确给了 `free-tier OAuth flow`，截至 `2026-04-03` 公开口径是 `2,000 requests/day`，对初次试跑很友好。
3. 官方 [FAQ](https://docs.openclaw.ai/help/faq) 和 [Telegram 文档](https://docs.openclaw.ai/channels/telegram) 都把 `Telegram` 放在“相对最容易接”的渠道里，它适合作为第一条外部消息链路。

备选主线是：

`OpenClaw 原生部署 + Ollama 本地模型`

这条线的优点是模型调用成本理论上可以做到 `$0`；缺点是你把“token 成本”换成了“本地机器、模型大小、稳定性和效果调优”。省了钱，不等于省了命。

为什么不把 `扣子 / 元器 / 百炼` 直接列为本文主推荐？

因为它们更适合“快速发布一个能访问的智能体”，而不是“真正搭出一套 OpenClaw”。这就像你想学养鱼，结果我把你领去海鲜市场，说看，缸里也有鱼。逻辑上不能算错，体验上多少有点耍赖。

## 五、最新 OpenClaw 养殖流程：选择、搭建、配置、运行、测试

下面是本文最重要的一段。目标不是炫技，而是让你在最少弯路下跑通第一套闭环。

### 第 1 步：选择

你先只做两个选择，不要一次把全部高级功能都点亮：

1. `模型入口`
- 推荐起步：`Qwen Portal`
- 备选：`Ollama`
- 已有订阅再考虑：`OpenAI / Codex OAuth`

2. `验证目标`
- 第一个目标：本机里看到 Dashboard 正常工作
- 第二个目标：让外部渠道能收发消息

完成标志：

- 你已经决定第一阶段先求“跑通”，不求“全渠道、全工具、全自动化”。

### 第 2 步：搭建

按 [OpenClaw 官方安装文档](https://docs.openclaw.ai/install) 的主路径，先把系统装起来。

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

然后执行 onboarding，并安装后台守护进程：

```bash
openclaw onboard --install-daemon
```

这里的 onboarding 可以理解成“第一次把池子注水、通电、接过滤器”。它不是为了显得专业，而是为了让后面的 Gateway、Dashboard、模型认证、工作目录都能站在一条可维护的链路上。

完成标志：

- 命令执行完成，没有中断在缺依赖或缺权限上。
- 你已经能在本机调用 `openclaw` 命令。

### 第 3 步：配置

这一阶段只配置最影响成败的三样东西：

1. `模型来源`
- 如果走 `Qwen Portal`，按 [Provider 文档](https://docs.openclaw.ai/providers/qwen) 走 OAuth 流程。
- 如果走 `Ollama`，按 [Provider 文档](https://docs.openclaw.ai/providers/ollama) 让本地模型先能单独跑起来。

2. `工作目录`
- 理解 `workspace` 是助手的默认工作区，而不是保险箱。

3. `安全边界`
- [OpenClaw 安全文档](https://docs.openclaw.ai/gateway/security) 明确提醒：`Dashboard / Control UI` 不应该直接裸露到公网。

完成标志：

- 至少一个模型入口已经可用。
- 你知道本机管理面不是拿来直接公开给陌生人访问的。

### 第 4 步：运行

先确认 Gateway 是否在线：

```bash
openclaw gateway status
```

如果状态正常，再打开 Dashboard：

```bash
openclaw dashboard
```

这里的正确姿势是：先在本机浏览器里确认这套系统活着，再决定要不要接 Telegram、WhatsApp 或其他渠道。别一上来就试图“手机里直接聊”，那样出问题时你会分不清到底是模型挂了、Gateway 没起来，还是渠道配置没对。

完成标志：

- Gateway 状态正常。
- Dashboard 能打开并可操作。

### 第 5 步：测试

第一轮测试要非常保守，不要写成全功能验收。

建议只测三件事：

1. `本机会话能否正常返回`
2. `模型提供方是否真的在工作`
3. `如果接了 Telegram，是否能完成第一次外部收发`

为什么推荐把 [Telegram](https://docs.openclaw.ai/channels/telegram) 放成“第一个外部渠道”而不是“第一步必做项”？

- 因为它是一个很好的外部验证点。
- 但它不是系统最早的生命体征。
- 对新手来说，最稳的顺序永远是：本机活了，再接外部。

完成标志：

- 你能在本机得到正常回复。
- 你能明确知道当前消息到底走的是哪一个模型入口。
- 如果接了 Telegram，你能完成一次 pairing 和一次真实收发。

到这里，才算“第一只龙虾已经下水会动了”。不是年产百万斤，但足够证明这套池子不是装饰工程。

## 六、如果你不想自己养：字节、腾讯、阿里各自怎么发

如果你读到这里心里已经出现一句“算了我还是租厨房吧”，那下面这节就是给你的。

### 1. 扣子 Coze

根据 [扣子官网概览](https://www.coze.cn/overview)，它主打的是云端环境、零门槛一键部署、默认域名和自定义域名。通俗讲就是：

- 入口：官网登录控制台
- 前置：账号登录
- 发布后：可以用默认域名访问，也可以接自定义域名
- 不适合替代 OpenClaw 的地方：它更像云端发布智能体，不是你自己养一套 Gateway

### 2. 腾讯元器

看 [腾讯元器介绍](https://yuanqi.tencent.com/guide/yuanqi-introduction) 和 [API 服务发布文档](https://yuanqi.tencent.com/guide/publish-agent-api-service)，它的路径很像“轻量版 Agent 发布平台”：

- 入口：创建智能体
- 前置：腾讯系账号与平台内配置
- 发布后：可以发到元器侧或作为 API 服务暴露
- 不适合替代 OpenClaw 的地方：它更偏“把应用发出去”，不是“把一套自托管系统养起来”

### 3. 腾讯云 ADP

按 [腾讯云 ADP 文档](https://cloud.tencent.com/document/product/1759/107504) 和 [应用发布概述](https://cloud.tencent.com/document/product/1759/104209)，它的语义更企业化：

- 入口：在测试环境创建和调试应用
- 前置：腾讯云账号、资源包、平台配置
- 发布后：可走体验链接、API 与更正式的业务接入
- 不适合替代 OpenClaw 的地方：它不是给你练手第一只虾的，尤其不是免费把 OpenClaw 原样托给你；即便官方提供了[一键部署 OpenClaw](https://cloud.tencent.com/document/product/1759/128832)，当前公开口径也要求 `专业版或企业版`

### 4. 阿里云百炼

按 [百炼智能体应用](https://help.aliyun.com/zh/model-studio/single-agent-application) 和 [分享与发布文档](https://help.aliyun.com/zh/model-studio/share-an-application/)，它的流程是：

- 入口：控制台创建智能体或工作流应用
- 前置：阿里云账号与模型服务开通
- 发布后：可网页分享、API 集成，也可接钉钉、微信等渠道
- 不适合替代 OpenClaw 的地方：它擅长的是平台化应用发布，不是 OpenClaw 那种原生自托管运行时

一句话总结这节：

如果你想“最快上线一个能分享的智能体”，这些平台很好用；如果你想“真正拥有自己的 OpenClaw 系统”，那它们不是本文主线。

## 七、哪里能拿到免费 token、免费试用、免费入口

这一节建议你拿笔画重点，因为小白最容易在这里被“免费”两个字喂得热血上头。

先记住一句总原则：

`OpenClaw 自己不发 token。`

它像养殖箱，真正的“饲料”来自你接入的模型或平台。

### 1. OpenClaw 侧可用的低成本入口

- `Qwen Portal`
根据 [官方 Provider 文档](https://docs.openclaw.ai/providers/qwen)，截至 `2026-04-03` 公开口径是 `2,000 requests/day`。注意单位是 `requests/day`，不是 tokens。

- `Ollama`
根据 [官方 Provider 文档](https://docs.openclaw.ai/providers/ollama)，本地模型成本可以视为 `$0`。但它不是“白嫖一切”，只是把账单从云平台转移到你的电脑上。

- `OpenAI / Codex OAuth`
根据 [OpenAI Provider 文档](https://docs.openclaw.ai/providers/openai) 与 [OAuth 文档](https://docs.openclaw.ai/oauth)，可复用订阅型入口。它不等于“官方送你免费 token”，而是“你已有订阅时，接入成本可能更顺”。

### 2. 云平台侧的公开免费入口

- `阿里云百炼`
根据 [产品页](https://cn.aliyun.com/product/bailian?from_alibabacloud=&userCode=t1dwdo7u) 与 [免费额度文档](https://help.aliyun.com/zh/model-studio/new-free-quota)，当前公开信息里，新用户免费 tokens 口径最清晰，常见说法是超 `7000万` 免费 tokens。

- `腾讯元器`
根据 [API 服务发布文档](https://yuanqi.tencent.com/guide/publish-agent-api-service)，可见月度 `100w token` 模型调用额度。注意它是元器场景下的额度，不是 OpenClaw 可直接继承的 token 池。

- `腾讯云 ADP`
根据 [计费概述](https://cloud.tencent.com/document/product/1759/127342)，免费版是 `15,000 PU/月`，有效期 `1 个月`。注意单位是 `PU`，而且它不等于“你就能免费部署 OpenClaw”。

- `火山方舟 Ark`
根据 [开通管理文档](https://www.volcengine.com/docs/82379/1159200?lang=zh)，未开通过模型服务的新用户，在安心体验模式下可使用 `50w token` 免费额度。这个更像模型试用额度。

- `扣子 Coze`
官网层面我目前能稳定确认的是 [“免费开始”](https://www.coze.cn/overview)。但截至 `2026-04-03`，我没有锁到一份和前几家同等清晰、长期稳定、无邀请参数的统一免费额度总表，所以这里不硬写死数字，免得把你带进旧活动页里。

![免费不是一个单位，别拿 requests 和 tokens 互相抡板凳](/img/posts/latest-openclaw-lobster-guide/lobster-guide-free-tier.svg)

## 八、最容易翻车的 8 个坑

1. 把 `部署` 当 `发布`
本机跑起来，只说明池子通水了，不说明你已经开门营业。

2. 把 `平台` 当 `模型`
OpenClaw、百炼、元器这些是系统或平台，不是统一的“模型本体”。

3. 把 `workspace` 当 `沙箱`
[官方文档](https://docs.openclaw.ai/agent-workspace) 说得很明确，它只是默认工作区。

4. 把 `免费试用` 当 `长期成本`
今天白送，不代表下个月不扣费。

5. 把 `Dashboard` 当公网产品页
[安全文档](https://docs.openclaw.ai/gateway/security) 已经提醒过，不建议裸奔公开。

6. 把“能聊天”当“稳定运行”
能回一句“你好”，不代表你的渠道、记忆、权限、工具链都稳定。

7. 把云平台智能体当 OpenClaw 替身
它们能满足很多需求，但不是同一种系统形态。

8. 把 Telegram 接入当必选第一步
它是很好的第一外部渠道，不是最早的生命体征。

## 九、小结：到底该养哪种“龙虾”

如果你想要的是：

- `真正拥有一套自己的 Agent 系统`
- `理解 Gateway、模型、渠道、权限到底怎么拼起来`
- `以后还想继续往自托管、工具调用、多渠道扩展走`

那就养 `OpenClaw`。并且对普通人来说，当前最容易跑通的顺序就是：

`OpenClaw 原生部署 -> 先接 Qwen Portal 免费层或 Ollama -> 本机 Dashboard 验证 -> 再接 Telegram`

如果你想要的是：

- `尽快上线一个能分享、能给别人用的智能体`
- `尽量少碰本地运维`
- `更关心发布速度，而不是拥有完整运行时`

那你更适合看 `扣子 Coze`、`腾讯元器`、`阿里云百炼`，企业场景再考虑 `腾讯云 ADP`。

回头看一遍你会发现，所谓 OpenClaw 一条龙部署，难点并不在“命令有多长”，而在于脑子里有没有把角色分清楚：谁是入口，谁是 Agent，谁负责记忆，谁负责扩展，谁又只是控制面。只要这些关系理顺了，后面的选择、搭建、配置、运行和测试，其实就不是玄学，更不是碰运气，而是一条可以重复、可以排查、可以稳定复现的流程。

最后给一句不拐弯的结论：截至 `2026-04-03` 的公开资料，**普通人最容易真正跑通的 OpenClaw 一条龙路径，仍然是 OpenClaw 官方原生部署，而不是去别的平台绕一圈再说自己“养过龙虾”。** 先把池子搭稳，再谈规模化养殖；不然最后你养出来的，很可能不是龙虾，而是一缸配置文件。
