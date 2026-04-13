'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tools = [
  { label: 'Budget', href: '/budget', icon: '💰', desc: 'Track spending vs limits' },
  { label: 'Expenses', href: '/expenses', icon: '🧾', desc: 'Log & scan receipts' },
  { label: 'Settlement', href: '/settlement', icon: '📊', desc: 'Guarantee vs door calc' },
  { label: 'Merch', href: '/merch', icon: '👕', desc: 'Inventory & sales' },
  { label: 'Crew', href: '/crew', icon: '👥', desc: 'Roster & coordination' },
  { label: 'Guest List', href: '/guestlist', icon: '📋', desc: 'Pass requests' },
  { label: 'Advance', href: '/advance', icon: '📨', desc: 'Venue advance emails' },
  { label: 'Briefing', href: '/briefing', icon: '📝', desc: 'Daily briefing generator' },
  { label: 'Markets', href: '/markets', icon: '📈', desc: 'Booking market history' },
]

export default function MorePage() {
  const pathname = usePathname()

  // Extract tour ID from current path if on a tour page
  const tourMatch = pathname.match(/\/tours\/([^/]+)/)
  const tourPrefix = tourMatch ? `/tours/${tourMatch[1]}` : ''

  return (
    <div className="animate-in">
      <div className="px-5 py-4 border-b border-border">
        <h1 className="text-lg font-semibold">More Tools</h1>
        <p className="text-xs text-text-dim mt-0.5">Additional tour management modules</p>
      </div>

      <div className="section-title">Tour Tools</div>
      <div className="px-4 py-2 space-y-2">
        {tools.map((tool) => (
          <Link
            key={tool.href}
            href={tourPrefix ? `${tourPrefix}${tool.href}` : tool.href}
            className="card flex items-center gap-4 hover:border-accent/30 transition-all"
          >
            <div className="text-2xl">{tool.icon}</div>
            <div className="flex-1">
              <div className="text-sm font-medium">{tool.label}</div>
              <div className="text-xs text-text-muted">{tool.desc}</div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}
