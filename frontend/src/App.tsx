import { useQuery } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import { Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom"
import "./App.css"

const API_BASE = import.meta.env.VITE_API_BASE || ""

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}
function NavBar() {
  return (
    <header className="top-nav">
      <div className="container nav-inner">
        <Link to="/" className="logo">爱窝啦 AI 日报</Link>
        <nav className="flex items-center gap-2 rounded-xl bg-[#f2f4f7] p-1">
          <NavLink to="/" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>AI 日报</NavLink>
          <NavLink to="/biz" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>AI 商机</NavLink>
          <NavLink to="/profile" className={({ isActive }) => `tab ${isActive ? "active" : ""}`}>个人主页</NavLink>
        </nav>
        <Link to="/admin/dashboard" className="admin-btn">后台管理</Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© 2026 爱窝啦 AI 日报</p>
        <p>日报通常每天 9:00 更新</p>
      </div>
    </footer>
  )
}

function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith("/admin/")
  if (isAdminPage) return <>{children}</>
  return (
    <div className="page-shell">
      <NavBar />
      <main className="container page-main">{children}</main>
      <Footer />
    </div>
  )
}

type DailyIssue = {
  issue_date: string
  title: string
  one_line: string
  keywords: string[]
  top10: { rank: number; title: string; summary: string }[]
}

function DailyPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["daily-issues"],
    queryFn: () => apiGet<{ results: DailyIssue[] }>("/api/daily/issues"),
  })
  const list = data?.results ?? []
  const latest = list[0]
  return (
    <section className="layout-two-col">
      <div>
        <h1 className="hero-title">爱窝啦 AI 日报</h1>
        <p className="hero-subtitle">今日 AI 资讯、关键词、趋势预测与重磅 TOP 10。</p>
        {isLoading && <div className="panel">加载中...</div>}
        {isError && <div className="panel">加载失败，请检查后端服务。</div>}
        {latest && (
          <article className="panel">
            <h2 className="issue-title">{latest.title}</h2>
            <p className="issue-oneline">{latest.one_line}</p>
            <div className="chips">
              {latest.keywords.map((k) => <span key={k} className="chip">#{k}</span>)}
            </div>
            <h3 className="section-title">重磅 TOP 10</h3>
            <ol className="top-list">
              {latest.top10.map((item) => (
                <li key={item.rank}>
                  <Link to={`/daily/${latest.issue_date}`}>{item.rank}. {item.title}</Link>
                </li>
              ))}
            </ol>
          </article>
        )}
      </div>
      <aside className="panel">
        <h3 className="section-title">归档</h3>
        <ul className="archive-list">
          {list.map((issue) => <li key={issue.issue_date}><Link to={`/daily/${issue.issue_date}`}>{issue.issue_date}</Link></li>)}
        </ul>
      </aside>
    </section>
  )
}

function DailyDetailPage() {
  const { date = "" } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["daily-detail", date],
    queryFn: () => apiGet<DailyIssue>(`/api/daily/issues/${date}`),
  })
  if (isLoading) return <div className="panel">加载中...</div>
  if (isError || !data) return <div className="panel">日报不存在或加载失败。</div>

  return (
    <section className="panel">
      <h1 className="issue-title">{data.title}</h1>
      <p className="issue-oneline">{data.one_line}</p>
      <ol className="top-list">{data.top10.map((x) => <li key={x.rank}>{x.rank}. {x.title}</li>)}</ol>
    </section>
  )
}

type BizItem = { id: number; title: string; summary: string; tags: string[]; score: number; issue_date: string }

function BizPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["biz-issues"],
    queryFn: () => apiGet<{ results: BizItem[] }>("/api/biz/issues"),
  })
  return (
    <section>
      <h1 className="hero-title">AI 商机</h1>
      {isLoading && <div className="panel">加载中...</div>}
      {isError && <div className="panel">加载失败，请检查后端服务。</div>}
      <div className="biz-grid">
        {(data?.results ?? []).map((item) => (
          <article className="panel" key={item.id}>
            <h2 className="biz-title"><Link to={`/biz/${item.id}`}>{item.title}</Link></h2>
            <p>{item.summary}</p>
            <div className="chips">{item.tags.map((x) => <span key={x} className="chip">{x}</span>)}</div>
            <p className="score">评分 {item.score}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function BizDetailPage() {
  const { id = "" } = useParams()
  const { data } = useQuery({
    queryKey: ["biz-detail", id],
    queryFn: () => apiGet<BizItem>(`/api/biz/issues/${id}`),
  })
  if (!data) return <div className="panel">加载中...</div>
  return <article className="panel"><h1 className="issue-title">{data.title}</h1><p>{data.summary}</p></article>
}

function ProfilePage() {
  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: () => apiGet<{ display_name: string; bio: string; avatar: string; location: string }>("/api/profile"),
  })
  if (!data) return <div className="panel">加载中...</div>
  return (
    <section className="panel">
      <h1 className="hero-title">{data.display_name}</h1>
      <p>{data.bio}</p>
      <p>{data.location}</p>
    </section>
  )
}

function AdminDashboardPage() {
  const [form, setForm] = useState({
    name: "daily-bot-01",
    schedule_cron: "0 9 * * *",
    source_urls: "https://news.aivora.cn/",
    ai_model: "gpt-4o-mini",
    prompt_template: "请基于抓取内容生成 AI 日报。",
    max_items: 20,
  })
  const [message, setMessage] = useState("")
  return (
    <section className="admin-grid">
      <article className="panel">
        <h2 className="section-title">机器人配置</h2>
        <input className="admin-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="admin-input" value={form.schedule_cron} onChange={(e) => setForm({ ...form, schedule_cron: e.target.value })} />
        <textarea className="admin-input" value={form.source_urls} onChange={(e) => setForm({ ...form, source_urls: e.target.value })} />
        <button
          type="button"
          className="admin-btn"
          onClick={async () => {
            await fetch("/api/daily/robots", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: form.name,
                enabled: true,
                schedule_cron: form.schedule_cron,
                source_urls: form.source_urls.split("\n").filter(Boolean),
                ai_model: form.ai_model,
                prompt_template: form.prompt_template,
                max_items: form.max_items,
                auto_publish: true,
              }),
            })
            setMessage("机器人已保存")
          }}
        >
          保存配置
        </button>
        {message && <p>{message}</p>}
      </article>
      <RobotJobs />
      <PublishRecords />
    </section>
  )
}

function RobotJobs() {
  const { data, refetch } = useQuery({
    queryKey: ["robot-jobs"],
    queryFn: () => apiGet<{ results: { id: number; status: string; message: string }[] }>("/api/daily/jobs"),
  })
  return (
    <article className="panel">
      <h2 className="section-title">抓取任务状态</h2>
      <button type="button" className="admin-btn" onClick={() => refetch()}>刷新</button>
      <ul>{(data?.results ?? []).map((x) => <li key={x.id}>#{x.id} {x.status} - {x.message}</li>)}</ul>
    </article>
  )
}

function PublishRecords() {
  const { data } = useQuery({
    queryKey: ["publish-records"],
    queryFn: () => apiGet<{ results: DailyIssue[] }>("/api/daily/issues"),
  })
  return (
    <article className="panel">
      <h2 className="section-title">发布记录</h2>
      <ul>{(data?.results ?? []).map((x) => <li key={x.issue_date}>{x.issue_date} - {x.title}</li>)}</ul>
    </article>
  )
}

function NotFound() {
  return (
    <section className="panel">
      <h1 className="issue-title">页面不存在</h1>
      <Link to="/">回到首页</Link>
    </section>
  )
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DailyPage />} />
        <Route path="/daily/:date" element={<DailyDetailPage />} />
        <Route path="/biz" element={<BizPage />} />
        <Route path="/biz/:id" element={<BizDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  )
}
