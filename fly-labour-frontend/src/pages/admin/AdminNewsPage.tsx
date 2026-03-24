import { useState } from 'react'
import { Plus, Pencil, Trash2, X, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { MOCK_NEWS } from '@/utils/mockData'
import type { News } from '@/types'
import { formatDate } from '@/utils/helpers'
import toast from 'react-hot-toast'

type FormData = { title: string; slug: string; excerpt: string; content: string; isPublished: boolean }
const EMPTY: FormData = { title: '', slug: '', excerpt: '', content: '', isPublished: true }

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 80)
}

export default function AdminNewsPage() {
  const [news, setNews] = useState<News[]>(MOCK_NEWS)
  const [modal, setModal] = useState<'add'|'edit'|null>(null)
  const [editing, setEditing] = useState<News|null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [deleting, setDeleting] = useState<string|null>(null)

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal('add') }
  const openEdit = (n: News) => {
    setForm({ title: n.title, slug: n.slug, excerpt: n.excerpt||'', content: n.content, isPublished: n.isPublished })
    setEditing(n); setModal('edit')
  }

  const setField = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    const val = e.target.value
    setForm(f => ({ ...f, [k]: val, ...(k === 'title' && !editing ? { slug: slugify(val) } : {}) }))
  }

  const handleSave = () => {
    if (!form.title) { toast.error('Vui lòng nhập tiêu đề'); return }
    if (modal === 'edit' && editing) {
      setNews(ns => ns.map(n => n.id === editing.id ? { ...n, ...form } : n))
      toast.success('Đã cập nhật bài viết')
    } else {
      const n: News = { id: Date.now().toString(), ...form, createdAt: new Date().toISOString() }
      setNews(ns => [n, ...ns])
      toast.success('Đã thêm bài viết')
    }
    setModal(null)
  }

  const togglePublish = (id: string) => {
    setNews(ns => ns.map(n => n.id === id ? {...n, isPublished: !n.isPublished} : n))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý Tin tức</h1>
          <p className="text-brand-muted text-sm">{news.length} bài viết · {news.filter(n=>n.isPublished).length} đã đăng</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus size={15} /> Thêm bài viết
        </button>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-dark/50">
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">Tiêu đề</th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden md:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden sm:table-cell">Ngày tạo</th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n.id} className="border-b border-brand-border/40 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white text-sm font-medium line-clamp-1">{n.title}</p>
                    {n.excerpt && <p className="text-brand-muted text-xs line-clamp-1 mt-0.5">{n.excerpt}</p>}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <code className="text-xs text-brand-yellow bg-brand-yellow/5 px-2 py-0.5 rounded">{n.slug}</code>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-brand-muted text-xs">{formatDate(n.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(n.id)} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium transition-colors ${n.isPublished ? 'text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20' : 'text-gray-400 bg-white/5 border-white/10 hover:border-white/20'}`}>
                      {n.isPublished ? <><Eye size={11} /> Đã đăng</> : <><EyeOff size={11} /> Ẩn</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(n)} className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-yellow hover:bg-brand-yellow/10 transition-colors">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleting(n.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-brand-border sticky top-0 bg-brand-card z-10">
              <h2 className="font-semibold text-white">{modal === 'add' ? '📰 Thêm bài viết' : '✏️ Chỉnh sửa bài viết'}</h2>
              <button onClick={() => setModal(null)}><X size={18} className="text-brand-muted hover:text-white" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Tiêu đề *</label>
                <input value={form.title} onChange={setField('title')} className="input-dark" placeholder="Tiêu đề bài viết..." />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Slug (URL)</label>
                <input value={form.slug} onChange={setField('slug')} className="input-dark font-mono text-sm" placeholder="ten-bai-viet" />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Tóm tắt</label>
                <textarea value={form.excerpt} onChange={setField('excerpt')} className="input-dark h-20 resize-none" placeholder="Mô tả ngắn hiển thị ở danh sách..." />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Nội dung bài viết</label>
                <textarea value={form.content} onChange={setField('content')} className="input-dark h-48 resize-none" placeholder="Nội dung chi tiết bài viết..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f=>({...f,isPublished:e.target.checked}))} className="w-4 h-4 accent-brand-yellow" />
                <span className="text-sm text-white">Đăng ngay (hiển thị công khai)</span>
              </label>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3">
                  <CheckCircle size={15} /> {modal === 'add' ? 'Đăng bài' : 'Lưu thay đổi'}
                </button>
                <button onClick={() => setModal(null)} className="btn-outline px-6">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleting(null)} />
          <div className="relative bg-brand-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <p className="text-4xl mb-3">🗑️</p>
            <h3 className="text-white font-semibold mb-2">Xác nhận xóa?</h3>
            <p className="text-brand-muted text-sm mb-5">Bài viết sẽ bị xóa vĩnh viễn.</p>
            <div className="flex gap-3">
              <button onClick={() => { setNews(ns=>ns.filter(n=>n.id!==deleting)); setDeleting(null); toast.success('Đã xóa bài viết') }} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">Xóa</button>
              <button onClick={() => setDeleting(null)} className="flex-1 btn-outline py-2.5 text-sm">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
