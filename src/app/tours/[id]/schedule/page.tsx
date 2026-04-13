import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: tour } = await supabase
    .from('tours').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!tour) redirect('/dashboard')

  const { data: daySheets } = await supabase
    .from('day_sheets')
    .select('*')
    .eq('tour_id', id)
    .order('day_date', { ascending: true })

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="animate-in">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <Link href={`/tours/${id}`} className="text-text-dim hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Schedule</h1>
          <p className="text-xs text-text-dim">{tour.name}</p>
        </div>
      </div>

      {!daySheets || daySheets.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-text-dim text-sm mb-4">No days added yet. Create your first day sheet.</p>
          <Link href={`/tours/${id}/schedule/new`} className="btn-primary inline-block">
            + Add Day
          </Link>
        </div>
      ) : (
        <div className="py-3">
          {daySheets.map((day) => {
            const isToday = day.day_date === today
            const isPast = day.day_date < today
            const dayDate = new Date(day.day_date + 'T12:00:00')

            return (
              <Link
                key={day.id}
                href={`/tours/${id}/schedule/${day.id}`}
                className={`block px-5 py-3 border-b border-border hover:bg-bg-card transition-all ${isToday ? 'border-l-2 border-l-accent' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-text-dim">
                        {dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      {isToday && <span className="badge badge-accent text-[10px]">TODAY</span>}
                      {isPast && <span className="badge bg-bg-elevated text-text-muted text-[10px]">PAST</span>}
                    </div>
                    <div className="mt-1">
                      <span className="text-sm font-medium">{day.venue_name || day.city || 'TBD'}</span>
                      {day.city && day.venue_name && (
                        <span className="text-xs text-text-dim ml-2">{day.city}</span>
                      )}
                    </div>
                    {!day.is_show && (
                      <span className="text-xs text-text-muted mt-0.5 block">Travel / Day Off</span>
                    )}
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted mt-1">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            )
          })}

          <div className="px-5 py-4">
            <Link href={`/tours/${id}/schedule/new`} className="btn-secondary block text-center text-sm">
              + Add Day
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
