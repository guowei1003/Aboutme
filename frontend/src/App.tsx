import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, NavLink, Route, Routes, useParams } from 'react-router-dom'
import { PenLine, Wrench, BookOpenText, Globe, UserRound } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

type Item = Record<string, unknown>

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) throw new Error(`API error: ${response.status}`)
  return response.json() as Promise<T>
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <header className="topbar">
        <h1>CC8789 Modern</h1>
        <nav>
          <NavLink to="/">Tools</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/nav">Nav</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/editor">Editor</NavLink>
        </nav>
      </header>
      <main className="content">{children}</main>
    </div>
  )
}

function Hero() {
  return (
    <section className="heroCard">
      <p className="chip">React + Django + Docker</p>
      <h2>极具现代化的工具与内容平台</h2>
      <p>以沉浸式深色玻璃风为基础，强化信息密度、可读性和触达速度。</p>
      <div className="heroStats">
        <span><Wrench size={16} /> Tools</span>
        <span><BookOpenText size={16} /> Blog</span>
        <span><Globe size={16} /> Nav</span>
      </div>
    </section>
  )
}

function ToolsPage() {
  const { data } = useQuery({
    queryKey: ['tools-home'],
    queryFn: () => apiGet<{ new_tool_list: Item[]; like_most_list: Item[]; use_most_list: Item[] }>('/tools/home/'),
  })
  const groups = useMemo(
    () => [
      { title: '最新工具', list: data?.new_tool_list ?? [] },
      { title: '最受欢迎', list: data?.like_most_list ?? [] },
      { title: '使用最多', list: data?.use_most_list ?? [] },
    ],
    [data],
  )
  return (
    <>
      <Hero />
      <section className="grid3">
        {groups.map((group) => (
          <article className="card" key={group.title}>
            <h3>{group.title}</h3>
            <ul>
              {group.list.map((tool) => {
                const ename = String(tool.tool_ename ?? '')
                return (
                  <li key={String(tool.id)}>
                    <Link to={`/tools/${ename}`} className="linkRow">
                      <span>{String(tool.tool_name ?? '未命名工具')}</span>
                      <small>{ename}</small>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </article>
        ))}
      </section>
    </>
  )
}

function ToolDetailPage() {
  const { ename = '' } = useParams()
  const { data } = useQuery({
    queryKey: ['tool', ename],
    queryFn: () => apiGet<Item>(`/tools/${ename}/`),
  })
  return (
    <section className="card">
      <h3>{String(data?.tool_name ?? ename)}</h3>
      <p>{String(data?.tool_dec ?? '暂无描述')}</p>
    </section>
  )
}

function BlogPage() {
  const { data } = useQuery({ queryKey: ['blog'], queryFn: () => apiGet<{ results: Item[] }>('/blog/articles/') })
  return (
    <section className="card">
      <h3>博客列表</h3>
      <ul>
        {(data?.results ?? []).map((article) => (
          <li key={String(article.id)}>
            <Link className="linkRow" to={`/blog/${article.id}`}>
              <span>{String(article.title)}</span>
              <small>{String(article.publish_time ?? '')}</small>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function BlogDetailPage() {
  const { id = '' } = useParams()
  const { data } = useQuery({ queryKey: ['blog-detail', id], queryFn: () => apiGet<Item>(`/blog/articles/${id}/`) })
  return (
    <article className="card proseLike">
      <h3>{String(data?.title ?? '文章')}</h3>
      <p>{String(data?.article_lead ?? '')}</p>
    </article>
  )
}

function NavPage() {
  const { data } = useQuery({ queryKey: ['nav'], queryFn: () => apiGet<{ site_list: Item[] }>('/nav/sites/home/') })
  return (
    <section className="card">
      <h3>导航站点</h3>
      <ul>
        {(data?.site_list ?? []).map((site) => (
          <li key={String(site.id)}>
            <a className="linkRow" href={String(site.url)} target="_blank" rel="noreferrer">
              <span>{String(site.name)}</span>
              <small>{String(site.url_class ?? '')}</small>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function AboutPage() {
  return (
    <section className="card">
      <h3>关于项目</h3>
      <p>该页面由旧版 Django 模板站升级为现代 SPA，后端 API 与容器化部署保持可扩展能力。</p>
    </section>
  )
}

function EditorPage() {
  const [content, setContent] = useState('')
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    alert(`编辑器草稿长度: ${content.length}`)
  }
  return (
    <section className="card">
      <h3><PenLine size={18} /> 写作工作台</h3>
      <form onSubmit={onSubmit} className="editorForm">
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="在这里输入文章..." />
        <button type="submit">保存草稿</button>
      </form>
    </section>
  )
}

function LoginPage() {
  return (
    <section className="card">
      <h3><UserRound size={18} /> 登录</h3>
      <p>调用后端 `POST /api/auth/token/` 完成 JWT 登录。</p>
    </section>
  )
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<ToolsPage />} />
        <Route path="/tools/:ename" element={<ToolDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/nav" element={<NavPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/editor" element={<EditorPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Shell>
  )
}
