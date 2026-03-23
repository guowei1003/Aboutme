# Modern UI Spec (ui-ux-pro-max aligned)

## Product
- 类型: tools + blog + navigation portal
- 风格: glassmorphism, dark premium, high-density content

## Typography
- 主字体: Inter + PingFang SC
- 层级: H1 32-40, H2 24-30, body 16-18

## Color Tokens
- Primary: `#0ea5e9`
- Secondary: `#22d3ee`
- Accent Surface: `rgba(15, 23, 42, 0.65)`
- Border: `rgba(148, 163, 184, 0.35)`
- Background: `#020617` -> `#1e293b` radial gradient
- Text: `#e2e8f0`
- Muted Text: `#cbd5e1`

## UX Rules
- 所有可点击区域有 `cursor-pointer` 或清晰 hover 态
- 顶栏浮动布局: `top: 16px`，避免贴边
- 禁止布局位移型 hover 动画
- 响应式断点: 960px 下多列折叠为单列
- 支持 `prefers-reduced-motion`（当前仅轻量过渡）

## Component Baseline
- Card: radius 20, blur 10px, translucent background
- Link Row: 分隔线 + hover color shift
- Editor: 深色输入区 + 高对比按钮
