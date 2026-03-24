import { useQuery } from "@tanstack/react-query"
import { EditorContent, useEditor, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useMemo, useState, type ReactNode } from "react"
import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom"
import "./App.css"

const API_BASE = import.meta.env.VITE_API_BASE || "/api"

type ArticleListItem = {
  id: number
  title: string
  article_class: string
  article_lead: string
  author: string
  publish_time: string
  cover_image: string
  read_time: number
}
type ArticleDetail = ArticleListItem & { article_body: string }
type WorkshopItem = {
  id: number
  name: string
  description: string
  url: string
  icon_url: string
  category: string
  sort_order: number
  is_active: boolean
}
type LoginRes = { access: string; refresh: string }

function token(): string {
  return localStorage.getItem("admin_access_token") || ""
}
function isLoggedIn(): boolean {
  return Boolean(token())
}
function formatDate(value: string): string {
  if (!value) return "未知日期"
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value.slice(0, 10) : d.toLocaleDateString("zh-CN")
}
function fallbackCover(seed: number): string {
  return `https://picsum.photos/seed/aboutme-${seed}/1200/800`
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}
async function apiAuthed<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  if (res.status === 204) return {} as T
  return res.json() as Promise<T>
}

function NavBar() {
  const logged = isLoggedIn()
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 md:px-8">
        <Link to="/blog" className="font-[Manrope] text-2xl font-extrabold tracking-tight text-slate-900">Aboutme</Link>
        <nav className="flex items-center gap-2 rounded-xl bg-[#f2f4f7] p-1">
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive ? "bg-white text-[#004ac6]" : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            博客
          </NavLink>
          <NavLink
            to="/workshop"
            className={({ isActive }) =>
              `rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive ? "bg-white text-[#004ac6]" : "text-slate-600 hover:text-slate-900"
              }`
            }
          >
            工坊
          </NavLink>
        </nav>
        <Link
          to={logged ? "/admin/dashboard" : "/admin/login"}
          className="rounded-xl bg-gradient-to-r from-[#004ac6] to-[#2563eb] px-4 py-2 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(25,28,30,0.06)]"
        >
          {logged ? "后台管理" : "登录"}
        </Link>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 bg-[#f2f4f7]">
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between gap-2 px-5 py-7 text-sm text-slate-500 md:flex-row md:px-8">
        <p>© {new Date().getFullYear()} Aboutme. All rights reserved.</p>
        <p>Personal blog & workshop.</p>
      </div>
    </footer>
  )
}

function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith("/admin/")
  if (isAdminPage) return <>{children}</>
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <NavBar />
      <main className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8">{children}</main>
      <Footer />
    </div>
  )
}

function Pagination({ page, setPage, total }: { page: number; setPage: (v: number) => void; total: number }) {
  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => setPage(p)}
          className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold ${
            p === page ? "bg-[#004ac6] text-white" : "bg-white text-slate-600 hover:text-slate-900"
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

function BlogPage() {
  const [page, setPage] = useState(1)
  const pageSize = 6
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog-list"],
    queryFn: () => apiGet<{ results: ArticleListItem[] }>("/blog/articles/"),
  })
  const list = data?.results || []
  const featured = list[0]
  const totalPage = Math.max(1, Math.ceil(list.length / pageSize))
  const pageList = list.slice((page - 1) * pageSize, page * pageSize)

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <h1 className="font-[Manrope] text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">Editorial Blog</h1>
        <p className="text-slate-600">记录我的开发实践、产品思考与 AI 工作流沉淀。</p>
      </div>

      {isLoading && <div className="rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">加载中...</div>}
      {isError && <div className="rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">加载失败，请检查后端服务。</div>}

      {featured && (
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <Link to={`/blog/${featured.id}`} className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
            <img
              src={featured.cover_image || fallbackCover(featured.id)}
              alt={featured.title}
              className="aspect-[16/9] w-full object-cover grayscale transition duration-300 hover:grayscale-0"
            />
            <div className="space-y-3 p-6">
              <span className="inline-flex rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-medium text-[#004ac6]">{featured.article_class || "未分类"}</span>
              <h2 className="font-[Manrope] text-2xl font-bold">{featured.title}</h2>
              <p className="text-slate-600">{featured.article_lead}</p>
            </div>
          </Link>
          <aside className="rounded-2xl bg-gradient-to-br from-[#004ac6] to-[#2563eb] p-6 text-white shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
            <p className="mb-2 text-sm font-semibold">Newsletter</p>
            <h3 className="font-[Manrope] text-2xl font-extrabold">保持更新</h3>
            <p className="mt-3 text-sm text-white/90">获取最新文章与工具动态，持续迭代你的技术视野。</p>
          </aside>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {pageList.map((item) => (
          <Link key={item.id} to={`/blog/${item.id}`} className="group overflow-hidden rounded-2xl bg-white shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
            <img
              src={item.cover_image || fallbackCover(item.id)}
              alt={item.title}
              className="aspect-[4/3] w-full object-cover grayscale transition duration-300 group-hover:-translate-y-0.5 group-hover:grayscale-0"
            />
            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-medium text-[#004ac6]">{item.article_class || "未分类"}</span>
                <span className="text-xs text-slate-500">{item.read_time || 5} min read</span>
              </div>
              <h3 className="line-clamp-2 font-[Manrope] text-xl font-bold">{item.title}</h3>
              <p className="line-clamp-3 text-sm text-slate-600">{item.article_lead}</p>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>{formatDate(item.publish_time)}</span>
                <span className="material-symbols-outlined">arrow_outward</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} setPage={setPage} total={totalPage} />
    </section>
  )
}

function BlogDetailPage() {
  const { id = "" } = useParams()
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog-detail", id],
    queryFn: () => apiGet<ArticleDetail>(`/blog/articles/${id}/`),
  })
  if (isLoading) return <div className="rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">加载中...</div>
  if (isError || !data) return <div className="rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">文章不存在或加载失败。</div>

  return (
    <article className="space-y-8">
      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-medium text-[#004ac6]">{data.article_class || "未分类"}</span>
        <h1 className="mt-4 font-[Manrope] text-4xl font-extrabold tracking-tight md:text-5xl">{data.title}</h1>
        <div className="mt-5 flex items-center justify-center gap-3 text-sm text-slate-500">
          <div className="h-8 w-8 rounded-full bg-[#dbeafe]" />
          <span>{data.author || "匿名作者"}</span>
          <span>·</span>
          <span>{formatDate(data.publish_time)}</span>
          <span>·</span>
          <span>{data.read_time || 5} min read</span>
        </div>
      </header>
      <img src={data.cover_image || fallbackCover(data.id)} alt={data.title} className="aspect-[21/9] w-full rounded-2xl object-cover shadow-[0_20px_40px_rgba(25,28,30,0.06)]" />
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
        <p className="text-lg text-slate-600">{data.article_lead}</p>
        <div className="editorial-content mt-4" dangerouslySetInnerHTML={{ __html: data.article_body || "" }} />
      </div>
      <div className="mx-auto flex max-w-3xl items-center justify-between rounded-2xl bg-white px-6 py-4 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#f2f4f7] px-4 py-2 text-sm font-semibold text-slate-700"><span className="material-symbols-outlined">favorite</span>点赞</button>
        <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#f2f4f7] px-4 py-2 text-sm font-semibold text-slate-700"><span className="material-symbols-outlined">share</span>分享</button>
      </div>
    </article>
  )
}

function WorkshopPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workshop-list"],
    queryFn: () => apiGet<{ results: WorkshopItem[] }>("/workshop/items/"),
  })
  const groups = useMemo(() => {
    const map = new Map<string, WorkshopItem[]>()
    for (const item of data?.results || []) {
      const key = item.category || "未分类"
      const arr = map.get(key) || []
      arr.push(item)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [data])

  return (
    <section className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="font-[Manrope] text-4xl font-extrabold tracking-tight md:text-5xl">Workshop</h1>
        <p className="text-slate-600">以导航站结构展示我的工具与实验项目。</p>
      </div>
      {isLoading && <div className="rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">加载中...</div>}
      {isError && <div className="rounded-xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">加载失败，请检查后端服务。</div>}
      {groups.map(([category, items]) => (
        <section key={category} className="space-y-5">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-[#d8e0f0]" />
            <h2 className="font-[Manrope] text-2xl font-bold">{category}</h2>
            <div className="h-px w-16 bg-[#d8e0f0]" />
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="group rounded-2xl bg-white p-5 shadow-[0_20px_40px_rgba(25,28,30,0.06)] transition hover:-translate-y-0.5">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f2f4f7] text-[#004ac6]">
                  {item.icon_url ? <img src={item.icon_url} alt={item.name} className="h-7 w-7 rounded-md object-cover" /> : <span className="material-symbols-outlined">extension</span>}
                </div>
                <h3 className="font-[Manrope] text-xl font-bold">{item.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.description || "暂无描述"}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-[#eff4ff] px-3 py-1 text-xs font-medium text-[#004ac6]">{item.category || "未分类"}</span>
                  <span className="text-sm font-medium text-[#004ac6]">访问官网 ↗</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}
    </section>
  )
}

function RequireAuth({ children }: { children: ReactNode }) {
  if (!token()) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

function AdminLoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch(`${API_BASE}/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (!res.ok) throw new Error("login")
      const data = (await res.json()) as LoginRes
      localStorage.setItem("admin_access_token", data.access)
      localStorage.setItem("admin_refresh_token", data.refresh)
      navigate("/admin/dashboard")
    } catch {
      setError("用户名或密码错误")
    }
  }

  return (
    <section className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f7f9fc] px-4">
      <span className="material-symbols-outlined absolute -left-8 -top-8 text-[220px] text-[#004ac6]/5">verified_user</span>
      <span className="material-symbols-outlined absolute -bottom-8 -right-8 text-[220px] text-[#004ac6]/5">shield</span>
      <form onSubmit={onSubmit} className="relative z-10 w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
        <div className="text-center">
          <h1 className="font-[Manrope] text-3xl font-extrabold">后台登录</h1>
          <p className="mt-2 text-sm text-slate-500">使用配置中的管理员账号进入内容控制台</p>
        </div>
        <label className="block text-sm font-medium text-slate-600">
          用户名
          <div className="mt-2 flex items-center rounded-xl bg-[#f2f4f7] px-3">
            <span className="material-symbols-outlined text-slate-500">person</span>
            <input className="w-full border-none bg-transparent px-2 py-3 outline-none" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
        </label>
        <label className="block text-sm font-medium text-slate-600">
          密码
          <div className="mt-2 flex items-center rounded-xl bg-[#f2f4f7] px-3">
            <span className="material-symbols-outlined text-slate-500">lock</span>
            <input className="w-full border-none bg-transparent px-2 py-3 outline-none" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </label>
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button type="submit" className="w-full rounded-xl bg-gradient-to-r from-[#004ac6] to-[#2563eb] py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(25,28,30,0.06)]">登录</button>
      </form>
    </section>
  )
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null
  const setLink = () => {
    const url = window.prompt("输入链接", "https://")
    if (!url) return
    editor.chain().focus().insertContent(`<a href="${url}" target="_blank">链接</a>`).run()
  }
  const setImage = () => {
    const url = window.prompt("输入图片 URL")
    if (!url) return
    editor.chain().focus().insertContent(`<p><img src="${url}" alt="image" /></p>`).run()
  }
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className="rounded-lg bg-[#f2f4f7] px-3 py-1 text-sm">format_bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className="rounded-lg bg-[#f2f4f7] px-3 py-1 text-sm">format_italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="rounded-lg bg-[#f2f4f7] px-3 py-1 text-sm">H2</button>
      <button type="button" onClick={setLink} className="rounded-lg bg-[#f2f4f7] px-3 py-1 text-sm">link</button>
      <button type="button" onClick={setImage} className="rounded-lg bg-[#f2f4f7] px-3 py-1 text-sm">image</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className="rounded-lg bg-[#f2f4f7] px-3 py-1 text-sm">list</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className="rounded-lg bg-[#f2f4f7] px-3 py-1 text-sm">quote</button>
    </div>
  )
}

function BlogEditor() {
  const [title, setTitle] = useState("")
  const [articleClass, setArticleClass] = useState("随笔")
  const [lead, setLead] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [readTime, setReadTime] = useState(5)
  const [message, setMessage] = useState("")
  const editor = useEditor({ extensions: [StarterKit], content: "<p>开始写作...</p>" })

  async function uploadCover(file: File) {
    const form = new FormData()
    form.append("image", file)
    const res = await fetch(`${API_BASE}/uploads/images/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` },
      body: form,
    })
    if (!res.ok) throw new Error("upload")
    const data = (await res.json()) as { url: string }
    setCoverImage(data.url)
  }
  async function save() {
    if (!editor) return
    try {
      await apiAuthed("/blog/articles/", "POST", {
        title,
        article_class: articleClass,
        article_lead: lead,
        article_body: editor.getHTML(),
        cover_image: coverImage,
        read_time: readTime,
        location: "web",
        quote: "原创",
        cornerite: "",
        tags: [],
      })
      setMessage("文章已发布")
      setTitle("")
      setLead("")
      setCoverImage("")
      setReadTime(5)
      editor.commands.setContent("<p>开始写作...</p>")
    } catch {
      setMessage("发布失败")
    }
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
      <h2 className="font-[Manrope] text-2xl font-bold">博文管理</h2>
      <input className="w-full rounded-xl border-none bg-[#f2f4f7] px-4 py-3 text-2xl font-bold outline-none ring-1 ring-transparent focus:ring-[#bdd2ff]" placeholder="请输入文章标题" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-xl border-none bg-[#f2f4f7] px-4 py-3 outline-none" placeholder="文章分类" value={articleClass} onChange={(e) => setArticleClass(e.target.value)} />
        <input className="rounded-xl border-none bg-[#f2f4f7] px-4 py-3 outline-none" type="number" min={1} placeholder="阅读时长(分钟)" value={readTime} onChange={(e) => setReadTime(Number(e.target.value) || 5)} />
      </div>
      <textarea className="min-h-24 w-full rounded-xl border-none bg-[#f2f4f7] px-4 py-3 outline-none" placeholder="摘要" value={lead} onChange={(e) => setLead(e.target.value)} />
      <div className="space-y-3 rounded-xl border border-dashed border-[#bdd2ff] bg-[#f8fbff] p-4">
        <p className="text-sm text-slate-600">封面图上传</p>
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadCover(e.target.files[0]).catch(() => setMessage("封面上传失败"))} />
        {coverImage && <img src={coverImage} alt="cover" className="h-36 w-full rounded-xl object-cover" />}
      </div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="min-h-72 rounded-xl bg-[#f2f4f7] p-4" />
      <button type="button" onClick={save} className="rounded-xl bg-gradient-to-r from-[#004ac6] to-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white">发布文章</button>
      {message && <p className="text-sm text-[#004ac6]">{message}</p>}
    </section>
  )
}

function WorkshopEditor() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [iconUrl, setIconUrl] = useState("")
  const [category, setCategory] = useState("通用")
  const [message, setMessage] = useState("")
  const { data, refetch } = useQuery({
    queryKey: ["admin-workshop-list"],
    queryFn: () => apiAuthed<{ results: WorkshopItem[] }>("/workshop/items/admin/"),
  })
  async function addItem() {
    try {
      await apiAuthed("/workshop/items/", "POST", {
        name,
        description,
        url,
        icon_url: iconUrl,
        category,
        sort_order: 0,
        is_active: true,
      })
      setName("")
      setDescription("")
      setUrl("")
      setIconUrl("")
      setCategory("通用")
      setMessage("工坊条目已新增")
      refetch()
    } catch {
      setMessage("新增失败")
    }
  }
  async function removeItem(id: number) {
    await apiAuthed(`/workshop/items/${id}/`, "DELETE")
    refetch()
  }

  return (
    <section className="space-y-4 rounded-2xl bg-white p-6 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
      <h2 className="font-[Manrope] text-2xl font-bold">工坊管理</h2>
      <div className="grid gap-3 md:grid-cols-2">
        <input className="rounded-xl border-none bg-[#f2f4f7] px-4 py-3 outline-none" placeholder="名称" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="rounded-xl border-none bg-[#f2f4f7] px-4 py-3 outline-none" placeholder="分类" value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <textarea className="min-h-24 w-full rounded-xl border-none bg-[#f2f4f7] px-4 py-3 outline-none" placeholder="描述" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input className="w-full rounded-xl border-none bg-[#f2f4f7] px-4 py-3 outline-none" placeholder="链接 URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <input className="w-full rounded-xl border-none bg-[#f2f4f7] px-4 py-3 outline-none" placeholder="图标 URL（可选）" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} />
      <button type="button" className="rounded-xl bg-gradient-to-r from-[#004ac6] to-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white" onClick={addItem}>新增条目</button>
      {message && <p className="text-sm text-[#004ac6]">{message}</p>}
      <ul className="space-y-2">
        {(data?.results || []).map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-xl bg-[#f2f4f7] px-4 py-3">
            <span className="text-sm text-slate-700">{item.name}</span>
            <button type="button" className="rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600" onClick={() => removeItem(item.id)}>删除</button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function AdminDashboardPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<"blog" | "workshop">("blog")
  function logout() {
    localStorage.removeItem("admin_access_token")
    localStorage.removeItem("admin_refresh_token")
    navigate("/admin/login")
  }
  return (
    <section className="flex min-h-screen bg-[#f7f9fc]">
      <aside className="sticky top-0 flex h-screen w-64 flex-col bg-white p-4 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
        <div className="mb-5 rounded-xl bg-[#f2f4f7] p-3">
          <p className="text-xs text-slate-500">admin</p>
          <p className="font-[Manrope] font-bold">Content Console</p>
        </div>
        <button type="button" onClick={() => setTab("blog")} className={`mb-2 rounded-xl px-4 py-2 text-left text-sm ${tab === "blog" ? "bg-[#eff4ff] text-[#004ac6]" : "bg-[#f2f4f7] text-slate-700"}`}>博文管理</button>
        <button type="button" onClick={() => setTab("workshop")} className={`mb-2 rounded-xl px-4 py-2 text-left text-sm ${tab === "workshop" ? "bg-[#eff4ff] text-[#004ac6]" : "bg-[#f2f4f7] text-slate-700"}`}>工坊管理</button>
        <button type="button" onClick={logout} className="mt-auto rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">退出登录</button>
      </aside>
      <div className="min-w-0 flex-1 px-6 py-6">
        <header className="sticky top-4 z-20 mb-5 flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
          <p className="text-sm text-slate-500">Admin / {tab === "blog" ? "Blog Editor" : "Workshop Editor"}</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">状态: 草稿</span>
            <button type="button" className="rounded-xl bg-gradient-to-r from-[#004ac6] to-[#2563eb] px-4 py-2 text-sm font-semibold text-white">发布</button>
          </div>
        </header>
        {tab === "blog" ? <BlogEditor /> : <WorkshopEditor />}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Navigate to="/blog" replace />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
        <Route path="/workshop" element={<WorkshopPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<RequireAuth><AdminDashboardPage /></RequireAuth>} />
      </Routes>
    </AppShell>
  )
}
