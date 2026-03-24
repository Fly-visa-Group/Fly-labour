import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '', address: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.phone || !form.password) { toast.error('Vui lòng điền đầy đủ thông tin'); return }
    if (form.password.length < 8) { toast.error('Mật khẩu tối thiểu 8 ký tự'); return }
    if (form.password !== form.confirm) { toast.error('Mật khẩu xác nhận không khớp'); return }
    setLoading(true)
    try {
      await register({ fullName: form.fullName, email: form.email, phone: form.phone, password: form.password, address: form.address })
      toast.success('Đăng ký thành công!')
      navigate('/')
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Đăng ký thất bại";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setLoading(false)
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({...f, [k]: e.target.value}))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f00] via-brand-dark to-brand-dark" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-10" style={{background:'linear-gradient(135deg,#F5A623,#EA580C)'}} />

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#F5A623,#EA580C)'}}>
              <span className="font-display text-lg text-black font-black">FL</span>
            </div>
            <span className="font-display text-2xl text-white tracking-wider">FLY <span style={{color:'#F5A623'}}>LABOUR</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Tạo tài khoản</h1>
          <p className="text-brand-muted text-sm mt-1">Đăng ký để khám phá cơ hội việc làm quốc tế</p>
        </div>

        <div className="card-dark p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-brand-muted mb-1.5 block">Họ và tên *</label>
                <input value={form.fullName} onChange={set('fullName')} className="input-dark" placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Email *</label>
                <input type="email" value={form.email} onChange={set('email')} className="input-dark" placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Số điện thoại *</label>
                <input type="tel" value={form.phone} onChange={set('phone')} className="input-dark" placeholder="0901 234 567" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-brand-muted mb-1.5 block">Địa chỉ</label>
                <input value={form.address} onChange={set('address')} className="input-dark" placeholder="Quận/Huyện, Tỉnh/TP" />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Mật khẩu *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} className="input-dark pr-11" placeholder="Tối thiểu 8 ký tự" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Xác nhận mật khẩu *</label>
                <input type="password" value={form.confirm} onChange={set('confirm')} className="input-dark" placeholder="Nhập lại mật khẩu" />
              </div>
            </div>

            <p className="text-xs text-brand-muted">
              Bằng cách đăng ký, bạn đồng ý với{' '}
              <Link to="/" className="text-brand-yellow">Điều khoản sử dụng</Link> và{' '}
              <Link to="/" className="text-brand-yellow">Chính sách bảo mật</Link> của chúng tôi.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Đang tạo tài khoản...</>
                : <><UserPlus size={16} /> Đăng ký miễn phí</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-brand-yellow hover:text-brand-orange transition-colors font-medium">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
