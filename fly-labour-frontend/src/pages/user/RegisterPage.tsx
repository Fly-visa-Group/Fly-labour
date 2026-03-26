import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, Briefcase, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

type AccountType = 'user' | 'employer'

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>('user')
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirm: '', address: '',
    companyName: '', website: '',
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      toast.error('Please fill in all required fields'); return
    }
    if (accountType === 'employer' && !form.companyName) {
      toast.error('Please enter your company name'); return
    }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        address: form.address,
        role: accountType,
        companyName: accountType === 'employer' ? form.companyName : undefined,
        website: accountType === 'employer' ? form.website : undefined,
      })
      toast.success('Account created successfully!')
      navigate(accountType === 'employer' ? '/employer' : '/')
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed'
      toast.error(Array.isArray(msg) ? msg[0] : msg)
    } finally {
      setLoading(false)
    }
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0f00] via-brand-dark to-brand-dark" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-10" style={{ background: 'linear-gradient(135deg,#F5A623,#EA580C)' }} />

      <div className="relative w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#F5A623,#EA580C)' }}>
              <span className="font-display text-lg text-black font-black">FL</span>
            </div>
            <span className="font-display text-2xl text-white tracking-wider">FLY <span style={{ color: '#F5A623' }}>LABOUR</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-brand-muted text-sm mt-1">Register to access international job opportunities</p>
        </div>

        <div className="card-dark p-8">
          {/* Account type selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setAccountType('user')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'user'
                  ? 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow'
                  : 'border-brand-border text-gray-400 hover:border-brand-yellow/40'
              }`}
            >
              <User size={22} />
              <div>
                <p className="text-sm font-semibold">Job Seeker</p>
                <p className="text-xs text-brand-muted">Looking for work</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setAccountType('employer')}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                accountType === 'employer'
                  ? 'border-brand-yellow bg-brand-yellow/10 text-brand-yellow'
                  : 'border-brand-border text-gray-400 hover:border-brand-yellow/40'
              }`}
            >
              <Briefcase size={22} />
              <div>
                <p className="text-sm font-semibold">Employer</p>
                <p className="text-xs text-brand-muted">Hiring workers</p>
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs text-brand-muted mb-1.5 block">Full Name *</label>
                <input value={form.fullName} onChange={set('fullName')} className="input-dark" placeholder="John Smith" />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Email *</label>
                <input type="email" value={form.email} onChange={set('email')} className="input-dark" placeholder="email@example.com" />
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Phone *</label>
                <input type="tel" value={form.phone} onChange={set('phone')} className="input-dark" placeholder="0901 234 567" />
              </div>

              {accountType === 'employer' ? (
                <>
                  <div>
                    <label className="text-xs text-brand-muted mb-1.5 block">Company Name *</label>
                    <input value={form.companyName} onChange={set('companyName')} className="input-dark" placeholder="ABC Company Ltd." />
                  </div>
                  <div>
                    <label className="text-xs text-brand-muted mb-1.5 block">Website</label>
                    <input value={form.website} onChange={set('website')} className="input-dark" placeholder="https://yourcompany.com" />
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <label className="text-xs text-brand-muted mb-1.5 block">Address</label>
                  <input value={form.address} onChange={set('address')} className="input-dark" placeholder="City / Province" />
                </div>
              )}

              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Password *</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} className="input-dark pr-11" placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-brand-muted mb-1.5 block">Confirm Password *</label>
                <input type="password" value={form.confirm} onChange={set('confirm')} className="input-dark" placeholder="Re-enter password" />
              </div>
            </div>

            <p className="text-xs text-brand-muted">
              By registering, you agree to our{' '}
              <Link to="/" className="text-brand-yellow">Terms of Service</Link> and{' '}
              <Link to="/" className="text-brand-yellow">Privacy Policy</Link>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
              {loading
                ? <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Creating account...</>
                : <><UserPlus size={16} /> Create Free Account</>
              }
            </button>
          </form>

          <p className="text-center text-sm text-brand-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-yellow hover:text-brand-orange transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
