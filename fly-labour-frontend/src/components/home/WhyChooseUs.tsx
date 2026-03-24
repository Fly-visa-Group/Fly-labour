import { Shield, Globe, Clock, HeartHandshake } from 'lucide-react'

const STATS = [
  { value: '1,200+', label: 'Lao động đã xuất cảnh', icon: '✈️' },
  { value: '96%', label: 'Tỉ lệ thành công', icon: '🏆' },
  { value: '8+ năm', label: 'Kinh nghiệm', icon: '⭐' },
  { value: '3 quốc gia', label: 'Đối tác tuyển dụng', icon: '🌏' },
]

const FEATURES = [
  {
    icon: <Shield size={24} />,
    title: 'Uy tín & Minh bạch',
    desc: 'Hợp đồng rõ ràng, không thu phí ẩn. Cam kết bảo vệ quyền lợi người lao động 100%.',
  },
  {
    icon: <Globe size={24} />,
    title: 'Mạng lưới rộng khắp',
    desc: 'Đối tác với 200+ nhà tuyển dụng uy tín tại Úc, Canada và New Zealand.',
  },
  {
    icon: <Clock size={24} />,
    title: 'Xử lý hồ sơ nhanh',
    desc: 'Quy trình tư vấn và xử lý hồ sơ nhanh chóng, hỗ trợ xuyên suốt đến khi xuất cảnh.',
  },
  {
    icon: <HeartHandshake size={24} />,
    title: 'Hỗ trợ sau xuất cảnh',
    desc: 'Đội ngũ hỗ trợ 24/7, giúp người lao động ổn định cuộc sống tại nước ngoài.',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-yellow/[0.02] to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {STATS.map((stat) => (
            <div key={stat.label} className="card-dark p-6 text-center group hover:border-brand-yellow/30 transition-all duration-300">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <p className="font-display text-4xl gradient-text mb-1">{stat.value}</p>
              <p className="text-brand-muted text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Why choose us */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-brand-yellow text-sm font-semibold uppercase tracking-widest mb-3">Tại sao chọn chúng tôi?</p>
            <h2 className="section-title mb-5">
              Fly Labour —<br />
              <span className="gradient-text">Đồng hành</span> cùng bạn
            </h2>
            <p className="text-gray-400 leading-relaxed mb-8">
              Với hơn 8 năm kinh nghiệm trong lĩnh vực xuất khẩu lao động, Fly Labour tự hào là đơn vị uy tín hàng đầu kết nối lao động Việt Nam với cơ hội việc làm chất lượng cao tại các quốc gia phát triển.
            </p>
            <div className="flex gap-3">
              <a href="/jobs" className="btn-primary text-sm">Tìm việc ngay</a>
              <a href="/contact" className="btn-outline text-sm">Tư vấn miễn phí</a>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="card-dark p-5 group hover:border-brand-yellow/30 transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center text-brand-yellow mb-4 group-hover:bg-brand-yellow/20 transition-colors">
                  {f.icon}
                </div>
                <h4 className="font-semibold text-white text-sm mb-2">{f.title}</h4>
                <p className="text-brand-muted text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
