import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: tour } = await supabase
    .from('tours')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!tour) redirect('/dashboard')

  const startDate = new Date(tour.start_date)
  const endDate = new Date(tour.end_date)
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  const sections = [
    { label: 'Schedule', href: `/tours/${id}/schedule`, icon: '📅', desc: 'Day sheets & timeline' },
    { label: 'Dates', href: `/tours/${id}/dates`, icon: '📆', desc: 'Calendar overview' },
    { label: 'Route', href: `/tours/${id}/route`, icon: '🗺️', desc: 'Tour routing' },
    { label: 'Budget', href: `/tours/${id}/budget`, icon: '💰', desc: 'Budget tracking' },
    { label: 'Expenses', href: `/tours/${id}/expenses`, icon: '🧾', desc: 'Expense log' },
    { label: 'Settlement', href: `/tours/${id}/settlement`, icon: '📊', desc: 'Show settlements' },
    { label: 'Merch', href: `/tours/${id}/merch`, icon: '👕', desc: 'Merch inventory & sales' },
    { label: 'Crew', href: `/tours/${id}/crew`, icon: '👥', desc: 'Crew roster' },
    { label: 'Guest List', href: `/tours/${id}/guestlist`, icon: '📋', desc: 'Guest passes' },
    { label: 'Advance', href: `/tours/${id}/advance`, icon: '📨', desc: 'Venue advances' },
    { label: 'Briefing', href: `/tours/${id}/briefing`, icon: '📝', desc: 'Daily briefings' },
    { label: 'Markets', href: `/tours/${id}/markets`, icon: '📈', desc: 'Market history' },
  ]

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <Link href="/dashboard" className="text-text-dim hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold truncate">{tour.name}</h1>
          <p className="text-xs text-text-dim">{tour.artist_name}</p>
        </div>
      </div>

      {/* Tour Summary */}
      <div className="px-5 py-4 border-b border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold font-mono">{totalDays}</div>
            <div className="text-xs text-text-muted">Days</div>
          </div>
          <div>
            <div className="text-lg font-bold font-mono capitalize">{tour.vehicle_type}</div>
            <div className="text-xs text-text-muted">Vehicle</div>
          </div>
          <div>
            <div className="text-lg font-bold font-mono">{tour.drive_speed_mph}</div>
            <div className="text-xs text-text-muted">MPH</div>
          </div>
        </div>
        <div className="text-center mt-3">
          <span className="font-mono text-xs text-text-dim">
            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="section-title">Modules</div>
      <div className="px-4 py-2 grid grid-cols-2 gap-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className="card hover:border-accent/30 transition-all">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-sm font-medium">{s.label}</div>
            <div className="text-xs text-text-muted mt-0.5">{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
