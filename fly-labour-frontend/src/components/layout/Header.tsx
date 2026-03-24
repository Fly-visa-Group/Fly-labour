import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Việc làm', href: '/jobs' },
  {
    label: 'Quốc gia', href: '#',
    children: [
      { label: '🇦🇺 Úc (Australia)', href: '/jobs?country=australia' },
      { label: '🇨🇦 Canada', href: '/jobs?country=canada' },
      { label: '🇳🇿 New Zealand', href: '/jobs?country=new_zealand' },
    ],
  },
  { label: 'Tin tức', href: '/news' },
  { label: 'Liên hệ', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdown, setDropdown] = useState<string | null>(null)
  const [userMenu, setUserMenu] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Đã đăng xuất')
    navigate('/')
    setUserMenu(false)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-brand-dark/95 backdrop-blur-lg border-b border-brand-border shadow-xl shadow-black/40"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div
              className="w-9 h-9 bg-gold-gradient rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300"
              style={{
                background: "linear-gradient(135deg, #F5A623, #EA580C)",
              }}
            >
              <span className="text-black font-display text-lg font-black">
                FL
              </span>
            </div>
            <div>
              <span className="font-display text-xl text-white tracking-wider">
                FLY
              </span>
              <span
                className="font-display text-xl tracking-wider"
                style={{ color: "#F5A623" }}
              >
                {" "}
                LABOUR
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDropdown(item.label)}
                  onMouseLeave={() => setDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-4 py-2 text-gray-300 hover:text-brand-yellow transition-colors text-sm font-medium rounded-lg hover:bg-white/5">
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${dropdown === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {dropdown === item.label && (
                    <div className="absolute top-full left-0 w-52 pt-2">
                      <div className="bg-brand-card border border-brand-border rounded-xl shadow-2xl overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-brand-yellow/10 transition-colors"
                            onClick={() => setDropdown(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === item.href
                      ? "text-brand-yellow bg-brand-yellow/10"
                      : "text-gray-300 hover:text-brand-yellow hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-xl px-3 py-2 hover:border-brand-yellow/50 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center text-black font-bold text-xs"
                    style={{
                      background: "linear-gradient(135deg,#F5A623,#EA580C)",
                    }}
                  >
                    {user.fullName.charAt(0)}
                  </div>
                  <span className="text-sm text-white hidden sm:block max-w-[100px] truncate">
                    {user.fullName}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-brand-card border border-brand-border rounded-xl shadow-2xl overflow-hidden">
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-3 text-sm text-brand-yellow hover:bg-brand-yellow/10 transition-colors"
                        onClick={() => setUserMenu(false)}
                      >
                        <LayoutDashboard size={16} /> Dashboard Admin
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      onClick={() => setUserMenu(false)}
                    >
                      <User size={16} /> Hồ sơ của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={16} /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm px-4 py-2">
                  Đăng nhập
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Đăng ký
                </Link>
              </div>
            )}

            <button
              className="md:hidden text-white p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-card border-t border-brand-border">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="block px-6 py-3 text-gray-300 hover:text-brand-yellow hover:bg-white/5 transition-colors border-b border-brand-border/50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="flex gap-3 p-4">
              <Link
                to="/login"
                className="flex-1 btn-outline text-center text-sm py-2"
                onClick={() => setMobileOpen(false)}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="flex-1 btn-primary text-center text-sm py-2"
                onClick={() => setMobileOpen(false)}
              >
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
