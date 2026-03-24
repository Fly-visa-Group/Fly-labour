import { Link } from 'react-router-dom'
import { MapPin, Clock, Users, TrendingUp, Eye } from 'lucide-react'
import type { Job } from '@/types'
import { COUNTRY_LABELS, JOBTYPE_LABELS, formatSalary, timeAgo } from '@/utils/helpers'

// Default images per country if no custom image
const COUNTRY_IMAGES: Record<string, string> = {
  australia:   'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&q=70&fit=crop',
  canada:      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=600&q=70&fit=crop',
  new_zealand: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=600&q=70&fit=crop',
}

// Category placeholder images
const CATEGORY_IMAGES: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=70&fit=crop', // farm
  '2': 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=70&fit=crop', // nail
  '3': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=70&fit=crop', // engineering
  '4': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70&fit=crop', // construction
  '5': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=70&fit=crop', // restaurant
  '6': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=70&fit=crop', // healthcare
  '7': 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&q=70&fit=crop', // logistics
  '8': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=70&fit=crop', // IT
}

interface Props { job: Job; compact?: boolean }

export default function JobCard({ job, compact }: Props) {
  const countryFlag = job.country === 'australia' ? '🇦🇺' : job.country === 'canada' ? '🇨🇦' : '🇳🇿'
  const thumbUrl = job.image
    || CATEGORY_IMAGES[job.categoryId || '']
    || COUNTRY_IMAGES[job.country]

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="card-dark block group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-yellow/10"
    >
      {/* Thumbnail image */}
      {!compact && (
        <div className="relative h-40 overflow-hidden bg-brand-dark">
          <img
            src={thumbUrl}
            alt={job.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              // fallback to country image on error
              const img = e.currentTarget
              const fallback = COUNTRY_IMAGES[job.country]
              if (img.src !== fallback) img.src = fallback
            }}
          />
          {/* Gradient overlay on image */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-card/90 via-brand-card/20 to-transparent" />

          {/* Badges on image */}
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            {job.isHot && <span className="badge-hot text-[10px]">🔥 Hot</span>}
            {job.isFeatured && <span className="bg-brand-yellow/90 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">⭐ Nổi bật</span>}
          </div>

          {/* Country flag top right */}
          <div className="absolute top-3 right-3">
            <span className="badge-country text-[10px]">{countryFlag} {COUNTRY_LABELS[job.country].replace(/🇦🇺|🇨🇦|🇳🇿/g,'').trim()}</span>
          </div>

          {/* Deadline ribbon */}
          {job.deadline && (
            <div className="absolute bottom-2 right-3 text-[10px] text-white/70">
              HSD: {new Date(job.deadline).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </div>
          )}
        </div>
      )}

      {/* Card body */}
      <div className={compact ? 'p-4' : 'p-4'}>
        {/* Compact mode badges */}
        {compact && (
          <div className="flex gap-1.5 flex-wrap mb-2">
            {job.isHot && <span className="badge-hot text-[10px]">🔥 Hot</span>}
            <span className="badge-country text-[10px]">{countryFlag} {COUNTRY_LABELS[job.country].replace(/🇦🇺|🇨🇦|🇳🇿/g,'').trim()}</span>
          </div>
        )}

        {/* Title */}
        <h3 className={`font-semibold text-white group-hover:text-brand-yellow transition-colors leading-snug mb-1 line-clamp-2 ${compact ? 'text-sm' : 'text-sm'}`}>
          {job.title}
        </h3>
        {job.company && <p className="text-brand-muted text-xs mb-3">{job.company}</p>}

        {/* Salary highlight */}
        <div className="bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl px-3 py-2 mb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={12} className="text-brand-yellow" />
            <span className="text-brand-yellow font-semibold text-xs">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-brand-muted">
          {job.location && (
            <span className="flex items-center gap-1"><MapPin size={10} /> {job.location}</span>
          )}
          <span className="flex items-center gap-1"><Clock size={10} /> {JOBTYPE_LABELS[job.jobType]}</span>
          {job.slots && (
            <span className="flex items-center gap-1"><Users size={10} /> {job.slots} chỉ tiêu</span>
          )}
          {job.viewCount > 0 && (
            <span className="flex items-center gap-1 ml-auto"><Eye size={10} /> {job.viewCount}</span>
          )}
        </div>

        {/* Category + Time */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border/60">
          {job.category ? (
            <span className="text-[11px] px-2 py-0.5 bg-white/5 rounded-lg text-gray-400">
              {job.category.icon} {job.category.name}
            </span>
          ) : <span />}
          <span className="text-[11px] text-brand-muted">{timeAgo(job.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
