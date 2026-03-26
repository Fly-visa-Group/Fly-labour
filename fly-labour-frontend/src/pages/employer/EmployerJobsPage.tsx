import { useState, useEffect, useRef } from 'react'
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react'
import { employerApi, categoriesApi, getImageUrl } from '@/services/api'
import { getCountryLabels, getCountriesList, getJobTypeLabel, JOBTYPE_LABELS } from '@/utils/helpers'
import toast from 'react-hot-toast'
import type { Job, Category } from '@/types'

const PRESET_COUNTRIES = getCountriesList()
const BLANK = {
  title: '', description: '', requirements: '', benefits: '',
  company: '', location: '', country: 'australia', countryCustom: '',
  jobType: 'full_time', status: 'active', salaryMin: '', salaryMax: '',
  salaryCurrency: 'AUD', slots: '', deadline: '', image: '', categoryId: '',
}

const STATUS_BADGE: Record<string, string> = {
  active: 'text-green-400 bg-green-400/10 border-green-400/20',
  draft:  'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  paused: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  closed: 'text-red-400 bg-red-400/10 border-red-400/20',
}

export default function EmployerJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<Job | null>(null)
  const [form, setForm] = useState({ ...BLANK })
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [preview, setPreview] = useState('')
  const fileRef = useRef<File | null>(null)

  const load = () => {
    setLoading(true)
    employerApi.getMyJobs()
      .then(r => setJobs(r.data.data || []))
      .catch(() => toast.error('Failed to load jobs'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    categoriesApi.getAll().then(r => setCategories(r.data || []))
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ ...BLANK })
    setPreview('')
    fileRef.current = null
    setModal(true)
  }

  const openEdit = (job: Job) => {
    setEditing(job)
    const isPreset = PRESET_COUNTRIES.some(c => c.value === job.country)
    setForm({
      ...BLANK,
      title: job.title || '', description: job.description || '',
      requirements: job.requirements || '', benefits: job.benefits || '',
      company: job.company || '', location: job.location || '',
      country: isPreset ? job.country : '__other__',
      countryCustom: isPreset ? '' : job.country,
      jobType: job.jobType || 'full_time', status: job.status || 'active',
      salaryMin: String(job.salaryMin || ''), salaryMax: String(job.salaryMax || ''),
      salaryCurrency: job.salaryCurrency || 'AUD', slots: String(job.slots || ''),
      deadline: job.deadline || '', image: job.image || '', categoryId: job.categoryId || '',
    })
    setPreview(job.image ? getImageUrl(job.image) : '')
    fileRef.current = null
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.description || !form.country) {
      toast.error('Please fill in Title, Description and Country'); return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      const country = form.country === '__other__' ? form.countryCustom.trim() : form.country
      const fields: Record<string, string> = {
        title: form.title, description: form.description,
        requirements: form.requirements, benefits: form.benefits,
        company: form.company, location: form.location,
        country, jobType: form.jobType, status: form.status,
        salaryMin: form.salaryMin, salaryMax: form.salaryMax,
        salaryCurrency: form.salaryCurrency, slots: form.slots,
        deadline: form.deadline, categoryId: form.categoryId,
      }
      if (!fileRef.current && form.image) fields.image = form.image
      Object.entries(fields).forEach(([k, v]) => { if (v) fd.append(k, v) })
      if (fileRef.current) fd.append('image', fileRef.current)

      if (editing) {
        await employerApi.updateJob(editing.id, fd)
        toast.success('Job updated!')
      } else {
        await employerApi.createJob(fd)
        toast.success('Job posted!')
      }
      setModal(false)
      load()
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await employerApi.deleteJob(deleteId)
      toast.success('Job deleted')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Delete failed')
    }
  }

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">My Job Listings</h1>
          <p className="text-brand-muted text-sm">{jobs.length} listing{jobs.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm px-4 py-2">
          <Plus size={16} /> Post New Job
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-20 bg-brand-card rounded-2xl animate-pulse border border-brand-border" />)}</div>
      ) : jobs.length === 0 ? (
        <div className="card-dark p-12 text-center">
          <p className="text-4xl mb-3">💼</p>
          <p className="text-white font-semibold mb-1">No job listings yet</p>
          <p className="text-brand-muted text-sm mb-4">Post your first job to start receiving applications</p>
          <button onClick={openCreate} className="btn-primary text-sm px-5 py-2">Post a Job</button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job.id} className="card-dark p-4 flex items-center gap-4">
              {job.image && (
                <img src={getImageUrl(job.image)} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 hidden sm:block" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-semibold truncate">{job.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${STATUS_BADGE[job.status] || ''}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-brand-muted text-sm mt-0.5">
                  {getCountryLabels()[job.country]} · {job.slots || 0} slots · {getJobTypeLabel(job.jobType)}
                </p>
                <p className="text-brand-muted text-xs mt-1">{job.viewCount || 0} views</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => openEdit(job)} className="p-2 text-brand-muted hover:text-brand-yellow hover:bg-brand-yellow/10 rounded-lg transition-colors">
                  <Edit2 size={15} />
                </button>
                <button onClick={() => setDeleteId(job.id)} className="p-2 text-brand-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 overflow-y-auto">
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-2xl my-4">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <h2 className="font-bold text-white">{editing ? 'Edit Job' : 'Post New Job'}</h2>
              <button onClick={() => setModal(false)} className="text-brand-muted hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Job Title *</label>
                <input value={form.title} onChange={f('title')} className="input-dark" placeholder="e.g. Farm Worker - Fruit Picking" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Company</label>
                  <input value={form.company} onChange={f('company')} className="input-dark" placeholder="Company name" />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Location</label>
                  <input value={form.location} onChange={f('location')} className="input-dark" placeholder="City / State" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Country *</label>
                  <select value={form.country} onChange={f('country')} className="input-dark">
                    {PRESET_COUNTRIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    <option value="__other__">Other...</option>
                  </select>
                  {form.country === '__other__' && (
                    <input value={form.countryCustom} onChange={f('countryCustom')} className="input-dark mt-2" placeholder="Enter country name" />
                  )}
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Job Type</label>
                  <select value={form.jobType} onChange={f('jobType')} className="input-dark">
                    {Object.entries(JOBTYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Min Salary</label>
                  <input type="number" value={form.salaryMin} onChange={f('salaryMin')} className="input-dark" placeholder="2500" />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Max Salary</label>
                  <input type="number" value={form.salaryMax} onChange={f('salaryMax')} className="input-dark" placeholder="3500" />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Currency</label>
                  <select value={form.salaryCurrency} onChange={f('salaryCurrency')} className="input-dark">
                    {['AUD','CAD','NZD','USD','GBP','SGD','JPY'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Slots</label>
                  <input type="number" value={form.slots} onChange={f('slots')} className="input-dark" placeholder="10" />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Deadline</label>
                  <input type="date" value={form.deadline} onChange={f('deadline')} className="input-dark" />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1.5 block">Status</label>
                  <select value={form.status} onChange={f('status')} className="input-dark">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="paused">Paused</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Category</label>
                <select value={form.categoryId} onChange={f('categoryId')} className="input-dark">
                  <option value="">— Select category —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              {/* Image */}
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Cover Image</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-brand-muted hover:text-white hover:border-brand-yellow/40 cursor-pointer transition-colors">
                    <ImageIcon size={14} /> Upload
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      fileRef.current = file
                      const reader = new FileReader()
                      reader.onload = ev => setPreview(ev.target?.result as string)
                      reader.readAsDataURL(file)
                    }} />
                  </label>
                  {(preview || form.image) && (
                    <img src={preview || getImageUrl(form.image)} alt="" className="h-10 w-16 rounded-lg object-cover" />
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Description *</label>
                <textarea value={form.description} onChange={f('description')} className="input-dark h-24 resize-none" placeholder="Describe the role and responsibilities..." />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Requirements</label>
                <textarea value={form.requirements} onChange={f('requirements')} className="input-dark h-20 resize-none" placeholder="Required skills, experience, qualifications..." />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Benefits</label>
                <textarea value={form.benefits} onChange={f('benefits')} className="input-dark h-20 resize-none" placeholder="Accommodation, visa sponsorship, flights..." />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-brand-border">
              <button onClick={() => setModal(false)} className="flex-1 btn-outline py-2.5">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary py-2.5">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Post Job'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-6 max-w-sm w-full text-center">
            <p className="text-2xl mb-3">🗑️</p>
            <h3 className="font-bold text-white mb-2">Delete Job?</h3>
            <p className="text-brand-muted text-sm mb-5">This will permanently remove the job listing and all applications.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 btn-outline py-2.5">Cancel</button>
              <button onClick={handleDelete} className="flex-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl py-2.5 text-sm font-medium hover:bg-red-500/30 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
