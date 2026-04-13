import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get tours
  const { data: tours } = await supabase
    .from('tours')
    .select('*')
    .eq('user_id', user.id)
    .order('start_date', { ascending: true })

  const initials = (profile?.full_name || user.email || 'U')
    .split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="animate-in">
      {/* User Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, var(--color-accent), #ff6b6b)' }}>
            {initials}
          </div>
          <span className="text-sm font-medium">{profile?.full_name || user.email}</span>
        </div>
        <form action="/auth/signout" method="POST">
          <button className="text-xs text-text-dim border border-border rounded-lg px-3 py-1.5 hover:border-accent hover:text-accent transition-all">
            Logout
          </button>
        </form>
      </div>

      {/* Section Header */}
      <div className="text-center py-4 border-b border-border">
        <div className="inline-block bg-accent text-white font-mono text-sm px-4 py-1 rounded-full">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>

      {/* Tours Section */}
      <div className="section-title">Your Tours</div>

      {(!tours || tours.length === 0) ? (
        <div className="px-5 py-8 text-center">
          <div className="text-4xl mb-3">🎵</div>
          <p className="text-text-dim text-sm mb-4">No tours yet. Create your first tour to get started.</p>
          <Link href="/tours/new" className="btn-primary inline-block">
            + Create Tour
          </Link>
        </div>
      ) : (
        <div className="px-4 space-y-3 py-3">
          {tours.map((tour) => {
            const startDate = new Date(tour.start_date)
            const endDate = new Date(tour.end_date)
            const now = new Date()
            const isActive = now >= startDate && now <= endDate
            const isUpcoming = now < startDate

            return (
              <Link key={tour.id} href={`/tours/${tour.id}`} className="card block hover:border-accent/30 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-sm">{tour.name}</h3>
                    <p className="text-text-dim text-xs mt-0.5">{tour.artist_name}</p>
                    <p className="text-text-muted text-xs mt-1 font-mono">
                      {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`badge ${isActive ? 'badge-success' : isUpcoming ? 'badge-accent' : 'badge-warning'}`}>
                    {isActive ? 'Active' : isUpcoming ? 'Upcoming' : 'Completed'}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-text-dim">
                  <span>{tour.vehicle_type}</span>
                  <span>{tour.drive_speed_mph} mph</span>
                  {tour.tm_name && <span>TM: {tour.tm_name}</span>}
                </div>
              </Link>
            )
          })}

          <Link href="/tours/new" className="btn-secondary block text-center text-sm mt-2">
            + Create New Tour
          </Link>
        </div>
      )}
    </div>
  )
}
