import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import {
  Wrench, BookOpenText, Globe,
  Zap, TrendingUp, Star, ArrowUpRight, Tag,
  Layers, Radio, ChevronRight, Code2, Lock, Database,
  Package, Cpu, ScanSearch, RefreshCw, Sun, Moon,
} from 'lucide-react'

// ─────────────── API ───────────────
const API_BASE = import.meta.env.VITE_API_BASE || '/api'
type Item = Record<string, unknown>

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json() as Promise<T>
}

// ─────────────── AURORA ───────────────
function AuroraBg() {
  return (
    <div className="aurora" aria-hidden>
      <div className="aurora__blob aurora__blob--1" />
      <div className="aurora__blob aurora__blob--2" />
      <div className="aurora__blob aurora__blob--3" />
    </div>
  )
}

// ─────────────── NAV ───────────────
function Nav() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const initial = saved === 'light' ? 'light' : 'dark'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  return (
    <header className="nav">
      <div className="nav__left">
        <Link to="/" className="nav__brand" style={{ textDecoration: 'none' }}>
          CC8789
        </Link>
        <nav className="nav__links">
          <NavLink className="nav__link" to="/tools" end>Tools</NavLink>
          <NavLink className="nav__link" to="/blog">Blog</NavLink>
          <NavLink className="nav__link" to="/nav">Nav</NavLink>
          <NavLink className="nav__link" to="/about">About</NavLink>
        </nav>
      </div>
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label="切换主题"
        title={theme === 'dark' ? '切换到亮色' : '切换到暗色'}
      >
        <span className="theme-toggle__thumb" />
        <span className="theme-toggle__icon theme-toggle__icon--sun"><Sun size={14} /></span>
        <span className="theme-toggle__icon theme-toggle__icon--moon"><Moon size={14} /></span>
      </button>
    </header>
  )
}

// ─────────────── SHELL ───────────────
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuroraBg />
      <div className="page">
        <Nav />
        {children}
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════
//  HOME PAGE
// ═══════════════════════════════════════════════════
const FEATURES = [
  {
    to: '/tools',
    icon: <Wrench size={22} />,
    iconClass: 'icon-box--cyan',
    accent: 'rgba(6,182,212,0.08)',
    accentBorder: 'rgba(6,182,212,0.2)',
    label: 'Tools',
    title: '开发工具箱',
    desc: '加密解密、哈希计算、编码转换、文件处理——覆盖日常开发全流程。',
    stat: '20+',
    statLabel: '工具',
  },
  {
    to: '/blog',
    icon: <BookOpenText size={22} />,
    iconClass: 'icon-box--violet',
    accent: 'rgba(139,92,246,0.08)',
    accentBorder: 'rgba(139,92,246,0.2)',
    label: 'Blog',
    title: '技术博客',
    desc: 'Python · 前端工程 · 系统设计 · 工程实践，持续更新的原创内容。',
    stat: '∞',
    statLabel: '文章',
  },
  {
    to: '/nav',
    icon: <Globe size={22} />,
    iconClass: 'icon-box--blue',
    accent: 'rgba(59,130,246,0.08)',
    accentBorder: 'rgba(59,130,246,0.2)',
    label: 'Nav',
    title: '精选导航',
    desc: '筛选优质资源，分类整理的开发者导航，告别无效搜索。',
    stat: '100+',
    statLabel: '站点',
  },
]

const STACK = [
  { icon: <Code2    size={14} />, label: 'React 19 + Vite' },
  { icon: <Database size={14} />, label: 'Django 4 + DRF' },
  { icon: <Package  size={14} />, label: 'MySQL 8' },
  { icon: <Lock     size={14} />, label: 'JWT Auth' },
  { icon: <Cpu      size={14} />, label: 'Docker Compose' },
]

function HomePage() {
  const navigate = useNavigate()
  const { data: toolsData } = useQuery({
    queryKey: ['tools-home'],
    queryFn: () => apiGet<{ new_tool_list: Item[] }>('/tools/home/'),
    retry: 1,
  })
  const { data: blogData } = useQuery({
    queryKey: ['blog'],
    queryFn: () => apiGet<{ results: Item[] }>('/blog/articles/'),
    retry: 1,
  })

  const recentTools   = toolsData?.new_tool_list?.slice(0, 6)  ?? []
  const recentArticles = blogData?.results?.slice(0, 3)         ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── HERO ── */}
      <section className="home-hero card card--flat">
        {/* Grid lines decoration */}
        <div className="home-hero__grid" aria-hidden />

        <div className="home-hero__body">
          <p className="hero__eyebrow">
            <Radio size={11} />
            个人技术平台 · React + Django + Docker
          </p>

          <h1 className="hero__title" style={{ marginBottom: 20 }}>
            <span className="hero__title--white">工欲善其事，<br /></span>
            <span className="hero__title--glow">必先利其器。</span>
          </h1>

          <p className="hero__desc" style={{ maxWidth: 560 }}>
            集工具、博客、导航于一体的个人技术空间——快速的工具集、深度的原创文章、精选的开发者资源。
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
            <button className="btn btn--primary" onClick={() => navigate('/tools')}>
              <Wrench size={15} /> 浏览工具
              <ChevronRight size={14} style={{ marginLeft: 2 }} />
            </button>
            <button
              className="btn"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}
              onClick={() => navigate('/blog')}
            >
              <BookOpenText size={15} /> 读博客
            </button>
          </div>

          <div className="home-hero__stack">
            {STACK.map(s => (
              <span key={s.label} className="badge">
                {s.icon} {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Floating stat orbs */}
        <div className="home-hero__orbs" aria-hidden>
          <div className="orb orb--1"><span>AES</span></div>
          <div className="orb orb--2"><span>SHA</span></div>
          <div className="orb orb--3"><span>JWT</span></div>
          <div className="orb orb--4"><span>API</span></div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="bento">
        {FEATURES.map(f => (
          <Link key={f.to} to={f.to} style={{ textDecoration: 'none' }}>
            <article
              className={`card feature-card card--${f.iconClass.replace('icon-box--', '')}`}
              style={{
                background: `linear-gradient(140deg, ${f.accent} 0%, rgba(12,18,38,0.55) 60%)`,
                borderColor: f.accentBorder,
                height: '100%',
              }}
            >
              <div className="icon-box feature-card__icon-box">{f.icon}</div>
              <span className="badge feature-card__label" style={{ marginBottom: 12, alignSelf: 'flex-start' }}>
                {f.label}
              </span>
              <h3 className="card__title" style={{ fontSize: 22, letterSpacing: '-0.5px', marginBottom: 10 }}>
                {f.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65, flex: 1 }}>{f.desc}</p>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-2px', lineHeight: 1 }} className="hero__title--glow">
                    {f.stat}
                  </div>
                  <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}>{f.statLabel}</div>
                </div>
                <ArrowUpRight size={20} style={{ color: '#334155' }} />
              </div>
            </article>
          </Link>
        ))}
      </section>

      {/* ── RECENT ── */}
      <section className="bento">

        {/* Recent Tools */}
        <div className="card span-2">
          <p className="card__eyebrow"><Zap size={11} />最新工具</p>
          {recentTools.length > 0 ? (
            <ul className="item-list">
              {recentTools.map(t => (
                <li key={String(t.id)}>
                  <Link className="item-list__row" to={`/tools/${t.tool_ename}`}>
                    <span className="item-list__name">{String(t.tool_name)}</span>
                    <span className="item-list__meta">{String(t.tool_class ?? '')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptySlot icon={<Zap size={20} />} label="暂无工具数据" />
          )}
          <Link to="/tools" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 13, color: '#22d3ee', textDecoration: 'none', fontWeight: 600 }}>
            查看全部工具 <ChevronRight size={14} />
          </Link>
        </div>

        {/* Recent Blog */}
        <div className="card card--violet">
          <p className="card__eyebrow"><BookOpenText size={11} />最新文章</p>
          {recentArticles.length > 0 ? (
            <ul className="item-list">
              {recentArticles.map(a => (
                <li key={String(a.id)}>
                  <Link className="item-list__row" to={`/blog/${a.id}`}>
                    <span className="item-list__name">{String(a.title)}</span>
                    <span className="item-list__meta">{String(a.publish_time ?? '').slice(0, 10)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptySlot icon={<BookOpenText size={20} />} label="暂无文章" />
          )}
          <Link to="/blog" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, fontSize: 13, color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>
            阅读博客 <ChevronRight size={14} />
          </Link>
        </div>

      </section>

      {/* ── BOTTOM INFO ── */}
      <section className="bento" style={{ marginBottom: 0 }}>

        <div className="card" style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.06),rgba(139,92,246,0.05))' }}>
          <p className="card__eyebrow"><Layers size={11} />架构</p>
          <ul style={{ paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              ['前端', 'React 19 + Vite + TS'],
              ['后端', 'Django 4 + DRF'],
              ['网关', 'Nginx SPA Proxy'],
              ['部署', 'Docker Compose × 3'],
            ].map(([k, v]) => (
              <li key={k} style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                <span style={{ color: '#334155', minWidth: 40 }}>{k}</span>
                <span style={{ color: '#64748b' }}>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card">
          <p className="card__eyebrow"><ScanSearch size={11} />API 入口</p>
          {['/api/tools/home/', '/api/blog/articles/', '/api/nav/sites/home/', '/api/auth/token/'].map(ep => (
            <div key={ep} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: '#475569', padding: '5px 8px', borderRadius: 7, marginBottom: 3, background: 'rgba(255,255,255,0.03)' }}>
              {ep}
            </div>
          ))}
        </div>

        <div className="card card--flat" style={{ background: 'linear-gradient(140deg,rgba(139,92,246,0.08),rgba(12,18,38,0.55))' }}>
          <p className="card__eyebrow"><RefreshCw size={11} />版本</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
            {[
              { label: 'React',   ver: '19.2',  cls: 'icon-box--cyan'   },
              { label: 'Django',  ver: '4.2 LTS', cls: 'icon-box--violet' },
              { label: 'Vite',    ver: '8.0',   cls: 'icon-box--blue'   },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>{item.label}</span>
                <span style={{ color: '#334155', fontFamily: 'ui-monospace,monospace', fontSize: 12 }}>v{item.ver}</span>
              </div>
            ))}
          </div>
        </div>

      </section>
    </div>
  )
}

// ─────────────── SHARED EMPTY ───────────────
function EmptySlot({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="empty" style={{ padding: '24px 0' }}>
      <span style={{ opacity: 0.2 }}>{icon}</span>
      {label}
    </div>
  )
}

// ═══════════════════════════════════════════════════
//  TOOLS PAGE
// ═══════════════════════════════════════════════════
function ToolsPage() {
  const { data, isError } = useQuery({
    queryKey: ['tools-home'],
    queryFn: () => apiGet<{ new_tool_list: Item[]; like_most_list: Item[]; use_most_list: Item[] }>('/tools/home/'),
    retry: 1,
  })

  const newList  = data?.new_tool_list  ?? []
  const likeList = data?.like_most_list ?? []
  const useList  = data?.use_most_list  ?? []

  return (
    <div className="bento">
      {/* HEADER */}
      <div className="card card--flat span-3" style={{ padding: '36px 44px' }}>
        <div className="icon-box icon-box--cyan"><Wrench size={18} /></div>
        <h2 className="hero__title" style={{ fontSize: 'clamp(32px,4vw,56px)', marginBottom: 12 }}>
          <span className="hero__title--white">工具 </span>
          <span className="hero__title--glow">集合</span>
        </h2>
        <p className="hero__desc">加密解密、哈希、编码、文件处理——覆盖日常开发全流程。</p>
      </div>

      {/* NEW — tall */}
      <div className="card row-2">
        <p className="card__eyebrow"><Zap size={12} />最新收录</p>
        {newList.length > 0 ? (
          <ul className="item-list">
            {newList.map(t => (
              <li key={String(t.id)}>
                <Link className="item-list__row" to={`/tools/${t.tool_ename}`}>
                  <span className="item-list__name">{String(t.tool_name)}</span>
                  <span className="item-list__meta">{String(t.tool_class ?? '')}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptySlot icon={<Zap size={22} />} label={isError ? '后端未连接' : '暂无数据'} />
        )}
      </div>

      {/* LIKED */}
      <div className="card">
        <div className="icon-box icon-box--violet"><Star size={18} /></div>
        <p className="card__eyebrow"><Star size={12} />最受喜欢</p>
        {likeList.length > 0 ? (
          <ul className="item-list">
            {likeList.slice(0, 6).map(t => (
              <li key={String(t.id)}>
                <Link className="item-list__row" to={`/tools/${t.tool_ename}`}>
                  <span className="item-list__name">{String(t.tool_name)}</span>
                  <span className="item-list__meta">♥ {String(t.like_count ?? 0)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <EmptySlot icon={<Star size={20} />} label="" />}
      </div>

      {/* USED */}
      <div className="card card--violet">
        <div className="icon-box icon-box--cyan"><TrendingUp size={18} /></div>
        <p className="card__eyebrow"><TrendingUp size={12} />使用最多</p>
        {useList.length > 0 ? (
          <ul className="item-list">
            {useList.slice(0, 6).map(t => (
              <li key={String(t.id)}>
                <Link className="item-list__row" to={`/tools/${t.tool_ename}`}>
                  <span className="item-list__name">{String(t.tool_name)}</span>
                  <span className="item-list__meta">{String(t.usage_count ?? 0)}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : <EmptySlot icon={<TrendingUp size={20} />} label="" />}
      </div>

      {/* STAT */}
      <div className="card span-2" style={{ background: 'linear-gradient(135deg,rgba(6,182,212,0.05),rgba(139,92,246,0.05))' }}>
        <p className="card__eyebrow"><Layers size={11} />工具概览</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginTop: 8 }}>
          {[
            { n: newList.length  || '—', l: '最新工具数' },
            { n: likeList.length || '—', l: '喜欢排行' },
            { n: useList.length  || '—', l: '使用排行' },
          ].map(s => (
            <div key={s.l}>
              <div className="stat__number" style={{ fontSize: 44 }}>{s.n}</div>
              <p className="stat__label">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card__eyebrow"><Globe size={11} />快速跳转</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
          {[
            { to: '/blog', label: '博客', icon: <BookOpenText size={14} /> },
            { to: '/nav',  label: '导航', icon: <Globe size={14} /> },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ textDecoration: 'none' }}>
              <div className="item-list__row" style={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                {item.icon}
                <span className="item-list__name">{item.label}</span>
                <ArrowUpRight size={13} style={{ color: '#334155' }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
//  TOOL DETAIL
// ═══════════════════════════════════════════════════
function ToolDetailPage() {
  const { ename = '' } = useParams()
  const { data, isError, isLoading } = useQuery({
    queryKey: ['tool', ename],
    queryFn: () => apiGet<Item>(`/tools/${ename}/`),
    retry: 1,
  })

  return (
    <div className="bento">
      <div className="card span-3 card--flat">
        <div className="icon-box icon-box--cyan"><Wrench size={18} /></div>
        <h2 style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-1.5px', color: '#f1f5f9', marginBottom: 12 }}>
          {isLoading ? '加载中…' : String(data?.tool_name ?? ename)}
        </h2>
        <p style={{ color: '#64748b', lineHeight: 1.65, maxWidth: 600 }}>
          {isError ? '无法获取工具信息，请确认后端服务已启动。' : String(data?.tool_dec ?? '暂无描述')}
        </p>
      </div>
      <div className="card">
        <p className="card__eyebrow"><TrendingUp size={12} />使用次数</p>
        <div className="stat__number">{String(data?.usage_count ?? '—')}</div>
      </div>
      <div className="card">
        <p className="card__eyebrow"><Star size={12} />喜欢数</p>
        <div className="stat__number">{String(data?.like_count ?? '—')}</div>
      </div>
      <div className="card">
        <p className="card__eyebrow"><Tag size={12} />分类</p>
        <p style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 18 }}>{String(data?.tool_class ?? '—')}</p>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
//  BLOG LIST
// ═══════════════════════════════════════════════════
function BlogPage() {
  const { data, isError } = useQuery({
    queryKey: ['blog'],
    queryFn: () => apiGet<{ results: Item[] }>('/blog/articles/'),
    retry: 1,
  })
  const articles = data?.results ?? []

  return (
    <div className="bento">
      <div className="card span-3 card--flat" style={{ padding: '36px 44px' }}>
        <div className="icon-box icon-box--violet"><BookOpenText size={18} /></div>
        <h2 className="hero__title" style={{ fontSize: 'clamp(32px,4vw,56px)', marginBottom: 12 }}>
          <span className="hero__title--white">技术 </span>
          <span className="hero__title--glow">博客</span>
        </h2>
        <p className="hero__desc">记录与分享——Python、前端、系统设计与工程实践。</p>
      </div>

      {isError && (
        <div className="card span-3"><EmptySlot icon={<BookOpenText size={24} />} label="后端未连接" /></div>
      )}

      {!isError && articles.length === 0 && (
        <div className="card span-3"><EmptySlot icon={<BookOpenText size={24} />} label="暂无文章" /></div>
      )}

      {articles.map(a => (
        <Link key={String(a.id)} to={`/blog/${a.id}`} style={{ textDecoration: 'none' }}>
          <article className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {a.cornerite === 'H' && <span className="hero__eyebrow" style={{ fontSize: 10, marginBottom: 12, alignSelf: 'flex-start' }}>热门</span>}
            {a.cornerite === 'C' && <span className="hero__eyebrow" style={{ fontSize: 10, marginBottom: 12, alignSelf: 'flex-start', borderColor: 'rgba(167,139,250,0.4)', color: '#a78bfa', background: 'rgba(139,92,246,0.1)' }}>原创</span>}
            <p className="card__eyebrow"><Tag size={11} />{String(a.article_class ?? '未分类')}</p>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.3px', marginBottom: 10, flex: 1 }}>
              {String(a.title)}
            </h3>
            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.55, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
              {String(a.article_lead ?? '')}
            </p>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: '#334155' }}>
              <span>{String(a.author ?? '')}</span>
              <span>{String(a.publish_time ?? '').slice(0, 10)}</span>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════
//  BLOG DETAIL
// ═══════════════════════════════════════════════════
function BlogDetailPage() {
  const { id = '' } = useParams()
  const { data, isError } = useQuery({
    queryKey: ['blog-detail', id],
    queryFn: () => apiGet<Item>(`/blog/articles/${id}/`),
    retry: 1,
  })

  return (
    <div className="bento">
      <div className="card span-3 card--flat">
        {isError ? <EmptySlot icon={<BookOpenText size={24} />} label="无法加载文章" /> : (
          <article>
            <p className="card__eyebrow"><Tag size={11} />{String(data?.article_class ?? '')}</p>
            <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 900, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: 16, color: '#f1f5f9' }}>
              {String(data?.title ?? '加载中…')}
            </h1>
            <div style={{ display: 'flex', gap: 16, marginBottom: 28, fontSize: 13, color: '#334155' }}>
              <span>{String(data?.author ?? '')}</span>
              <span>{String(data?.publish_time ?? '').slice(0, 10)}</span>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
              <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 16 }}>{String(data?.article_lead ?? '')}</p>
            </div>
          </article>
        )}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
//  NAV PAGE
// ═══════════════════════════════════════════════════
function NavPage() {
  const { data, isError } = useQuery({
    queryKey: ['nav'],
    queryFn: () => apiGet<{ site_list: Item[]; champion_reads: Item[] }>('/nav/sites/home/'),
    retry: 1,
  })
  const sites = data?.site_list       ?? []
  const reads = data?.champion_reads?.slice(0, 8) ?? []

  return (
    <div className="bento">
      <div className="card card--flat span-3" style={{ padding: '36px 44px' }}>
        <div className="icon-box icon-box--blue"><Globe size={18} /></div>
        <h2 className="hero__title" style={{ fontSize: 'clamp(32px,4vw,56px)', marginBottom: 12 }}>
          <span className="hero__title--white">精选 </span>
          <span className="hero__title--glow">导航</span>
        </h2>
        <p className="hero__desc">汇集优质网站与工具，分类整理，随时直达你需要的资源。</p>
      </div>

      {isError && <div className="card span-3"><EmptySlot icon={<Globe size={24} />} label="后端未连接" /></div>}

      {sites.length > 0 && (
        <div className="card span-2">
          <p className="card__eyebrow"><Star size={11} />首页精选</p>
          <ul className="item-list">
            {sites.map(s => (
              <li key={String(s.id)}>
                <a className="item-list__row" href={String(s.url)} target="_blank" rel="noreferrer">
                  <span className="item-list__name">{String(s.name)}</span>
                  <ArrowUpRight size={13} style={{ color: '#334155', flexShrink: 0 }} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {reads.length > 0 && (
        <div className="card">
          <p className="card__eyebrow"><TrendingUp size={11} />热门点击</p>
          <ul className="item-list">
            {reads.map(s => (
              <li key={String(s.id)}>
                <a className="item-list__row" href={String(s.url)} target="_blank" rel="noreferrer">
                  <span className="item-list__name">{String(s.name)}</span>
                  <span className="item-list__meta">{String(s.url_reads ?? 0)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isError && sites.length === 0 && reads.length === 0 && (
        <div className="card span-3"><EmptySlot icon={<Globe size={24} />} label="暂无导航数据" /></div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════
//  ABOUT
// ═══════════════════════════════════════════════════
function AboutPage() {
  return (
    <div className="bento">
      <div className="card card--flat span-3" style={{ padding: '36px 44px' }}>
        <div className="icon-box icon-box--cyan"><Layers size={18} /></div>
        <h2 className="hero__title" style={{ fontSize: 'clamp(32px,4vw,56px)', marginBottom: 12 }}>
          <span className="hero__title--white">关于这个 </span>
          <span className="hero__title--glow">项目</span>
        </h2>
        <p className="hero__desc">从 Python 2 + 老版 Django 模板站，全面重构为前后端分离 SPA，保持功能对等并引入现代工程规范。</p>
      </div>

      <div className="card span-2">
        <p className="card__eyebrow"><Wrench size={11} />技术栈</p>
        <ul className="item-list">
          {[
            ['后端',   'Django 4.2 LTS + DRF'],
            ['前端',   'React 19 + Vite + TypeScript'],
            ['样式',   'Tailwind CSS v4'],
            ['认证',   'JWT (simplejwt)'],
            ['数据库', 'MySQL 8 + PyMySQL'],
            ['网关',   'Nginx (SPA + /api proxy)'],
            ['部署',   'Docker Compose (3 containers)'],
          ].map(([k, v]) => (
            <li key={k}>
              <div className="item-list__row" style={{ cursor: 'default' }}>
                <span className="item-list__meta" style={{ flexShrink: 0 }}>{k}</span>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>{v}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="card card--violet">
        <p className="card__eyebrow"><Radio size={11} />API 端点</p>
        {[
          'POST /api/auth/token/',
          'GET  /api/blog/articles/',
          'POST /api/blog/articles/create/',
          'GET  /api/tools/home/',
          'GET  /api/nav/sites/home/',
          'POST /api/uploads/images/',
        ].map(ep => (
          <div key={ep} style={{ fontFamily: 'ui-monospace,monospace', fontSize: 11, color: '#64748b', padding: '6px 10px', borderRadius: 8, marginBottom: 4, background: 'rgba(255,255,255,0.03)' }}>
            {ep}
          </div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════
//  APP
// ═══════════════════════════════════════════════════
export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/"             element={<HomePage />}       />
        <Route path="/tools"        element={<ToolsPage />}      />
        <Route path="/tools/:ename" element={<ToolDetailPage />} />
        <Route path="/blog"         element={<BlogPage />}       />
        <Route path="/blog/:id"     element={<BlogDetailPage />} />
        <Route path="/nav"          element={<NavPage />}        />
        <Route path="/about"        element={<AboutPage />}      />
      </Routes>
    </Shell>
  )
}
