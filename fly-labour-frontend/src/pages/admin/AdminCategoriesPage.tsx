import { useState } from 'react'
import { Plus, Pencil, Trash2, X, CheckCircle, GripVertical } from 'lucide-react'
import { MOCK_CATEGORIES } from '@/utils/mockData'
import type { Category } from '@/types'
import toast from 'react-hot-toast'

type FormData = { name: string; nameEn: string; icon: string; description: string; isActive: boolean; sortOrder: string }
const EMPTY: FormData = { name: '', nameEn: '', icon: '🏷️', description: '', isActive: true, sortOrder: '0' }
const ICON_OPTIONS = ['🌾','💅','⚙️','🏗️','🍽️','🏥','🚛','💻','🧹','🐄','🐟','🌿','🔧','🎨','📦','🏭']

export default function AdminCategoriesPage() {
  const [cats, setCats] = useState(MOCK_CATEGORIES)
  const [modal, setModal] = useState<'add'|'edit'|null>(null)
  const [editing, setEditing] = useState<Category|null>(null)
  const [form, setForm] = useState<FormData>(EMPTY)
  const [deleting, setDeleting] = useState<string|null>(null)

  const openAdd  = () => { setForm(EMPTY); setEditing(null); setModal('add') }
  const openEdit = (c: Category) => {
    setForm({ name: c.name, nameEn: c.nameEn||'', icon: c.icon||'🏷️', description: c.description||'', isActive: c.isActive, sortOrder: String(c.sortOrder) })
    setEditing(c); setModal('edit')
  }
  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => setForm(f=>({...f,[k]:e.target.value}))

  const handleSave = () => {
    if (!form.name) { toast.error('Vui lòng nhập tên danh mục'); return }
    if (modal === 'edit' && editing) {
      setCats(cs => cs.map(c => c.id === editing.id ? {...c, ...form, sortOrder: Number(form.sortOrder)} : c))
      toast.success('Đã cập nhật danh mục')
    } else {
      const newCat: Category = { id: Date.now().toString(), name: form.name, nameEn: form.nameEn, icon: form.icon, description: form.description, isActive: form.isActive, sortOrder: Number(form.sortOrder), image: '', _count: {jobs: 0} }
      setCats(cs => [...cs, newCat])
      toast.success('Đã thêm danh mục')
    }
    setModal(null)
  }

  const handleDelete = (id: string) => {
    setCats(cs => cs.filter(c => c.id !== id))
    setDeleting(null)
    toast.success('Đã xóa danh mục')
  }

  const toggleActive = (id: string) => {
    setCats(cs => cs.map(c => c.id === id ? {...c, isActive: !c.isActive} : c))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-white">Quản lý Danh mục</h1>
          <p className="text-brand-muted text-sm">{cats.length} danh mục ngành nghề</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5">
          <Plus size={15} /> Thêm danh mục
        </button>
      </div>

      {/* Grid view */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cats.map(cat => (
          <div key={cat.id} className={`card-dark p-5 relative group transition-all duration-300 ${!cat.isActive ? 'opacity-50' : 'hover:border-brand-yellow/30'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-brand-yellow/5 border border-brand-yellow/10 flex items-center justify-center text-2xl">
                {cat.icon}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cat)} className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-brand-yellow hover:bg-brand-yellow/10 transition-colors">
                  <Pencil size={12} />
                </button>
                <button onClick={() => setDeleting(cat.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
            {cat.nameEn && <p className="text-brand-muted text-xs">{cat.nameEn}</p>}
            {cat.description && <p className="text-brand-muted text-xs mt-1 line-clamp-2">{cat.description}</p>}
            <div className="flex items-center justify-between mt-3">
              {cat._count && <span className="text-xs text-brand-orange font-medium">{cat._count.jobs} việc làm</span>}
              <button
                onClick={() => toggleActive(cat.id)}
                className={`text-xs px-2 py-0.5 rounded-full border font-medium transition-colors ml-auto ${cat.isActive ? 'text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}
              >
                {cat.isActive ? 'Hoạt động' : 'Ẩn'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="relative bg-brand-card border border-brand-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <h2 className="font-semibold text-white">{modal === 'add' ? '➕ Thêm danh mục' : '✏️ Sửa danh mục'}</h2>
              <button onClick={() => setModal(null)}><X size={18} className="text-brand-muted hover:text-white" /></button>
            </div>
            <div className="p-5 space-y-4">
              {/* Icon picker */}
              <div>
                <label className="text-xs text-brand-muted mb-2 block">Chọn Icon</label>
                <div className="grid grid-cols-8 gap-1.5">
                  {ICON_OPTIONS.map(ic => (
                    <button key={ic} onClick={() => setForm(f=>({...f,icon:ic}))}
                      className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center border transition-all ${form.icon === ic ? 'bg-brand-yellow/20 border-brand-yellow/50' : 'bg-brand-dark border-brand-border hover:border-brand-yellow/30'}`}>
                      {ic}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-brand-muted text-xs">Hoặc nhập tay:</span>
                  <input value={form.icon} onChange={set('icon')} className="input-dark py-1.5 px-3 text-sm w-20 text-center" maxLength={2} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Tên tiếng Việt *</label>
                  <input value={form.name} onChange={set('name')} className="input-dark" placeholder="VD: Nông nghiệp" />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Tên tiếng Anh</label>
                  <input value={form.nameEn} onChange={set('nameEn')} className="input-dark" placeholder="VD: Farm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Mô tả ngắn</label>
                <textarea value={form.description} onChange={set('description')} className="input-dark h-20 resize-none" placeholder="Mô tả ngành nghề..." />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-brand-muted mb-1.5 block">Thứ tự hiển thị</label>
                  <input type="number" value={form.sortOrder} onChange={set('sortOrder')} className="input-dark" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-5">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f=>({...f,isActive:e.target.checked}))} className="w-4 h-4 accent-brand-yellow" />
                  <span className="text-sm text-white">Hiển thị</span>
                </label>
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={handleSave} className="btn-primary flex-1 flex items-center justify-center gap-2 py-2.5">
                  <CheckCircle size={15} /> {modal === 'add' ? 'Thêm' : 'Lưu'}
                </button>
                <button onClick={() => setModal(null)} className="btn-outline px-6">Hủy</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDeleting(null)} />
          <div className="relative bg-brand-card border border-red-500/30 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <p className="text-4xl mb-3">🗑️</p>
            <h3 className="text-white font-semibold mb-2">Xác nhận xóa?</h3>
            <p className="text-brand-muted text-sm mb-5">Danh mục sẽ bị xóa vĩnh viễn.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleting)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">Xóa</button>
              <button onClick={() => setDeleting(null)} className="flex-1 btn-outline py-2.5 text-sm">Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
