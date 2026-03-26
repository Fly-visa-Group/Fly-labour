import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Facebook, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-card border-t border-brand-border mt-20">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:'linear-gradient(135deg,#F5A623,#EA580C)'}}>
              <span className="text-black font-display text-base font-black">FL</span>
            </div>
            <span className="font-display text-xl text-white tracking-wider">
              FLY <span style={{color:'#F5A623'}}>LABOUR</span>
            </span>
          </div>
          <p className="text-brand-muted text-sm leading-relaxed">
            Connecting Vietnamese workers with quality international employment opportunities in Australia, Canada and New Zealand.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-border flex items-center justify-center text-brand-muted hover:text-brand-yellow hover:bg-brand-yellow/10 transition-colors">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-border flex items-center justify-center text-brand-muted hover:text-brand-yellow hover:bg-brand-yellow/10 transition-colors">
              <Youtube size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-brand-border flex items-center justify-center text-brand-muted hover:text-[#06C755] hover:bg-[#06C755]/10 transition-colors">
              <span className="text-xs font-bold">Z</span>
            </a>
          </div>
        </div>

        {/* Jobs Links */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest" style={{color:'#F5A623'}}>Jobs</h4>
          <ul className="space-y-2">
            {[
              'Jobs in Australia', 'Jobs in Canada', 'Jobs in New Zealand',
              'Farm & Agriculture', 'Nail & Spa', 'Engineering',
            ].map(item => (
              <li key={item}><Link to="/jobs" className="text-brand-muted hover:text-white text-sm transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest" style={{color:'#F5A623'}}>Support</h4>
          <ul className="space-y-2">
            {[
              'About Us', 'Application Process', 'FAQ', 'News & Blog', 'Contact Us', 'Privacy Policy',
            ].map(item => (
              <li key={item}><Link to="/" className="text-brand-muted hover:text-white text-sm transition-colors">{item}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest" style={{color:'#F5A623'}}>Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2 text-sm text-brand-muted">
              <MapPin size={15} className="mt-0.5 shrink-0" style={{color:'#F5A623'}} />
              <span>123 Nguyen Van Linh, District 7, Ho Chi Minh City</span>
            </li>
            <li className="flex items-center gap-2 text-sm text-brand-muted">
              <Phone size={15} style={{color:'#F5A623'}} />
              <a href="tel:0901234567" className="hover:text-white transition-colors">0901 234 567</a>
            </li>
            <li className="flex items-center gap-2 text-sm text-brand-muted">
              <Mail size={15} style={{color:'#F5A623'}} />
              <a href="mailto:info@flylabour.com" className="hover:text-white transition-colors">info@flylabour.com</a>
            </li>
          </ul>
          <div className="mt-5 p-3 bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl">
            <p className="text-xs text-brand-yellow font-semibold">Office Hours</p>
            <p className="text-xs text-brand-muted mt-1">Mon–Fri: 8:00 – 17:30<br/>Sat: 8:00 – 12:00</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-brand-border py-5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-brand-muted">
          <p>© 2025 Fly Labour. Business No: 0123456789 — Ho Chi Minh City</p>
          <div className="flex gap-4">
            <Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
