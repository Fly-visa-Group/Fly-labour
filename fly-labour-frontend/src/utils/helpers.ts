import type { JobType, AppStatus } from '@/types'

const COUNTRY_MAP: Record<string, string> = {
  australia:   '🇦🇺 Australia',
  canada:      '🇨🇦 Canada',
  new_zealand: '🇳🇿 New Zealand',
  norway:      '🇳🇴 Norway',
  germany:     '🇩🇪 Germany',
  portugal:    '🇵🇹 Portugal',
  czech:       '🇨🇿 Czech Republic',
  us:          '🇺🇸 United States',
  uk:          '🇬🇧 United Kingdom',
  japan:       '🇯🇵 Japan',
  singapore:   '🇸🇬 Singapore',
  south_korea: '🇰🇷 South Korea',
  taiwan:      '🇹🇼 Taiwan',
  uae:         '🇦🇪 UAE',
}

export const COUNTRY_LABELS: Record<string, string> = new Proxy(COUNTRY_MAP, {
  get: (target, key: string) => target[key] ?? key,
})

// Ordered list for dropdowns / navigation
export const COUNTRIES_LIST = Object.entries(COUNTRY_MAP).map(([value, label]) => ({ value, label }))

export const JOBTYPE_LABELS: Record<JobType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract:  'Contract',
  seasonal:  'Seasonal',
}

export const APP_STATUS_LABELS: Record<AppStatus, { label: string; color: string }> = {
  pending:   { label: 'Pending Review',  color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
  reviewing: { label: 'Under Review',    color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  approved:  { label: 'Approved',        color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  rejected:  { label: 'Rejected',        color: 'text-red-400 bg-red-400/10 border-red-400/20' },
  withdrawn: { label: 'Withdrawn',       color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
}

export function formatSalary(min?: number, max?: number, currency = 'AUD') {
  if (!min && !max) return 'Negotiable'
  if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}/mo`
  if (min) return `From ${min.toLocaleString()} ${currency}/mo`
  return `Up to ${max?.toLocaleString()} ${currency}/mo`
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return `${Math.floor(days / 30)} months ago`
}

export function clsx(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}
