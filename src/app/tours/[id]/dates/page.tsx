'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface DaySheet {
  id: string
  day_date: string
  city: string | null
  venue_name: string | null
  is_show: boolean
}

export default function DatesPage() {
  const params = useParams()
  const tourId = params.id as string
  const [daySheets, setDaySheets] = useState<DaySheet[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('day_sheets')
        .select('id, day_date, city, venue_name, is_show')
        .eq('tour_id', tourId)
        .order('day_date', { ascending: true })

      setDaySheets(data || [])
      setLoading(false)
    }
    load()
  }, [tourId, supabase])

  const today = new Date().toISOString().split('T')[0]
  const shows = daySheets.filter(d => d.is_show)
  const daysOff = daySheets.filter(d => !d.is_show)
  const completed = daySheets.filter(d => d.day_date < today)
  const upcoming = daySheets.filter(d => d.day_date >= today)

  // Group by month for calendar view
  const byMonth = daySheets.reduce((acc, day) => {
    const month = day.day_date.slice(0, 7)
    if (!acc[month]) acc[month] = []
    acc[month].push(day)
    return acc
  }, {} as Record<string, DaySheet[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-dim text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <div className="animate-in">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <Link href={`/tours/${tourId}`} className="text-text-dim hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold flex-1">Dates</h1>
        <div className="flex bg-bg rounded-lg p-0.5">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${view === 'list' ? 'bg-accent text-white' : 'text-text-dim'}`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${view === 'calendar' ? 'bg-accent text-white' : 'text-text-dim'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 px-5 py-3 border-b border-border">
        <div className="text-center">
          <div className="text-lg font-bold font-mono">{daySheets.length}</div>
          <div className="text-[10px] text-text-muted">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-success">{shows.length}</div>
          <div className="text-[10px] text-text-muted">Shows</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-cyan">{daysOff.length}</div>
          <div className="text-[10px] text-text-muted">Off</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold font-mono text-text-dim">{completed.length}/{daySheets.length}</div>
          <div className="text-[10px] text-text-muted">Done</div>
        </div>
      </div>

      {view === 'list' ? (
        <div className="py-2">
          {daySheets.length === 0 ? (
            <div className="px-5 py-12 text-center text-text-dim text-sm">
              No dates added to this tour yet.
            </div>
          ) : (
            daySheets.map((day) => {
              const isToday = day.day_date === today
              const isPast = day.day_date < today
              const date = new Date(day.day_date + 'T12:00:00')

              return (
                <Link
                  key={day.id}
                  href={`/tours/${tourId}/schedule/${day.id}`}
                  className={`flex items-center gap-4 px-5 py-3 border-b border-border hover:bg-bg-card transition-all ${isToday ? 'bg-accent/5' : ''}`}
                >
                  <div className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-center ${isToday ? 'bg-accent text-white' : isPast ? 'bg-bg-elevated text-text-muted' : 'bg-bg-card'}`}>
                    <div className="text-[10px] font-medium uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div className="text-lg font-bold font-mono leading-none">{date.getDate()}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {day.venue_name || day.city || 'TBD'}
                    </div>
                    <div className="text-xs text-text-dim">
                      {day.city || 'Location TBD'}
                      {!day.is_show && ' · Day Off'}
                    </div>
                  </div>
                  {isToday && <span className="badge badge-accent text-[10px]">TODAY</span>}
                </Link>
              )
            })
          )}
        </div>
      ) : (
        // Calendar view
        <div className="py-3 px-4">
          {Object.entries(byMonth).map(([month, days]) => (
            <div key={month} className="mb-4">
              <div className="text-xs font-semibold text-text-muted uppercase mb-2 px-1">
                {new Date(month + '-01T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-[10px] text-text-muted py-1">{d}</div>
                ))}
                {/* Empty cells for offset */}
                {(() => {
                  const firstDay = new Date(month + '-01T12:00:00').getDay()
                  return Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))
                })()}
                {days.map((day) => {
                  const date = new Date(day.day_date + 'T12:00:00')
                  const isToday = day.day_date === today
                  return (
                    <Link
                      key={day.id}
                      href={`/tours/${tourId}/schedule/${day.id}`}
                      className={`text-center py-1.5 rounded-lg text-xs font-mono transition-all ${
                        isToday ? 'bg-accent text-white font-bold' :
                        day.is_show ? 'bg-accent/10 text-accent' :
                        'bg-bg-card text-text-dim'
                      }`}
                    >
                      {date.getDate()}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
