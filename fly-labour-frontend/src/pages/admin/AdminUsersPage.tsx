import { useEffect, useState } from 'react'
import { Search, Eye, Lock, Unlock, X } from 'lucide-react'
import { formatDate } from '@/utils/helpers'
import toast from 'react-hot-toast'
import type { User } from '@/types'
import { usersApi } from '@/services/api'

const MOCK_USERS: User[] = [
  { id: '1', fullName: 'Nguyễn Văn An', email: 'an@example.com', phone: '0901111111', role: 'user', isActive: true, createdAt: '2025-01-10T00:00:00Z' },
  { id: '2', fullName: 'Trần Thị Bình', email: 'binh@example.com', phone: '0902222222', role: 'user', isActive: true, createdAt: '2025-01-15T00:00:00Z' },
  { id: '3', fullName: 'Lê Văn Cường', email: 'cuong@example.com', phone: '0903333333', role: 'user', isActive: false, createdAt: '2025-01-18T00:00:00Z' },
  { id: '4', fullName: 'Phạm Thị Dung', email: 'dung@example.com', phone: '0904444444', role: 'user', isActive: true, createdAt: '2025-01-20T00:00:00Z' },
  { id: '5', fullName: 'Hoàng Văn Em', email: 'em@example.com', phone: '0905555555', role: 'user', isActive: true, createdAt: '2025-02-01T00:00:00Z' },
  { id: '6', fullName: 'Admin Fly Labour', email: 'admin@flylabour.com', phone: '0901234567', role: 'admin', isActive: true, createdAt: '2024-12-01T00:00:00Z' },
]

export default function AdminUsersPage() {
   const [users, setUsers] = useState<User[]>([]);
   const [total, setTotal] = useState(0);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState("");
   const [selected, setSelected] = useState<User | null>(null);

   const loadUsers = () => {
     setLoading(true);
     usersApi
       .getAll({ search, limit: 50 })
       .then((r) => {
         setUsers(r.data.data);
         setTotal(r.data.meta.total);
       })
       .catch(() => {})
       .finally(() => setLoading(false));
   };

   useEffect(() => {
     loadUsers();
   }, [search]);

   const toggleActive = async (id: string) => {
     try {
       await usersApi.toggleActive(id);
       setUsers((us) =>
         us.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)),
       );
       toast.success("Đã cập nhật trạng thái tài khoản");
     } catch {
       toast.error("Cập nhật thất bại");
     }
   };
  const filtered = users.filter(
    (u) =>
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Quản lý Khách hàng</h1>
        <p className="text-brand-muted text-sm">{users.length} tài khoản · {users.filter(u => u.isActive).length} đang hoạt động</p>
      </div>

      <div className="card-dark p-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input-dark pl-9 py-2 text-sm h-10" placeholder="Tìm tên, email..." />
        </div>
      </div>

      <div className="card-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-brand-border bg-brand-dark/50">
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">Người dùng</th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden md:table-cell">Số ĐT</th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden sm:table-cell">Vai trò</th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold hidden lg:table-cell">Ngày đăng ký</th>
                <th className="text-left px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">Trạng thái</th>
                <th className="text-right px-4 py-3 text-xs text-brand-muted uppercase tracking-wide font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-brand-border/40 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-black text-xs font-bold shrink-0" style={{background: user.role === 'admin' ? 'linear-gradient(135deg,#F5A623,#EA580C)' : 'linear-gradient(135deg,#3B82F6,#8B5CF6)'}}>
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{user.fullName}</p>
                        <p className="text-brand-muted text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-300 text-sm">{user.phone || '—'}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${user.role === 'admin' ? 'text-brand-yellow bg-brand-yellow/10 border-brand-yellow/20' : 'text-gray-400 bg-white/5 border-white/10'}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-brand-muted text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${user.isActive ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                      {user.isActive ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelected(user)} className="w-7 h-7 rounded-lg flex items-center justify-center text-brand-muted hover:text-white hover:bg-white/10 transition-colors">
                        <Eye size={13} />
                      </button>
                      {user.role !== 'admin' && (
                        <button onClick={() => toggleActive(user.id)} className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${user.isActive ? 'text-brand-muted hover:text-red-400 hover:bg-red-500/10' : 'text-brand-muted hover:text-green-400 hover:bg-green-500/10'}`}>
                          {user.isActive ? <Lock size={13} /> : <Unlock size={13} />}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User detail panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-80 bg-brand-card border-l border-brand-border overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-brand-border">
              <h2 className="font-semibold text-white text-sm">Chi tiết người dùng</h2>
              <button onClick={() => setSelected(null)}><X size={16} className="text-brand-muted hover:text-white" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-black text-2xl font-bold mx-auto mb-3" style={{background: selected.role === 'admin' ? 'linear-gradient(135deg,#F5A623,#EA580C)' : 'linear-gradient(135deg,#3B82F6,#8B5CF6)'}}>
                  {selected.fullName.charAt(0)}
                </div>
                <p className="text-white font-semibold">{selected.fullName}</p>
                <p className="text-brand-muted text-sm">{selected.email}</p>
              </div>
              {[
                { label: 'Số điện thoại', value: selected.phone || '—' },
                { label: 'Vai trò', value: selected.role === 'admin' ? '👑 Admin' : '👤 User' },
                { label: 'Ngày đăng ký', value: formatDate(selected.createdAt) },
                { label: 'Trạng thái', value: selected.isActive ? '✅ Hoạt động' : '🔒 Đã khóa' },
              ].map(item => (
                <div key={item.label} className="p-3 bg-brand-dark rounded-xl">
                  <p className="text-xs text-brand-muted">{item.label}</p>
                  <p className="text-white text-sm mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
