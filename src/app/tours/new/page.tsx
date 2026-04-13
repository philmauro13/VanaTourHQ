'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function CreateTourPage() {
  const [name, setName] = useState('')
  const [artistName, setArtistName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [tmName, setTmName] = useState('')
  const [tmEmail, setTmEmail] = useState('')
  const [bookingAgent, setBookingAgent] = useState('')
  const [vehicleType, setVehicleType] = useState('bus')
  const [driveSpeed, setDriveSpeed] = useState(55)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error: insertError } = await supabase
        .from('tours')
        .insert({
          user_id: user.id,
          name,
          artist_name: artistName,
          start_date: startDate,
          end_date: endDate,
          tm_name: tmName || null,
          tm_email: tmEmail || null,
          booking_agent: bookingAgent || null,
          vehicle_type: vehicleType,
          drive_speed_mph: driveSpeed,
        })
        .select('*')
        .single()

      if (insertError) throw insertError

      router.push(`/tours/${data.id}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create tour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <Link href="/dashboard" className="text-text-dim hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <h1 className="text-lg font-semibold">Create Tour</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-5">
        <div>
          <label className="block text-xs text-text-dim mb-1.5 font-medium">Tour Name *</label>
          <input type="text" className="input-field" placeholder="Summer Arena Run 2026"
            value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div>
          <label className="block text-xs text-text-dim mb-1.5 font-medium">Artist Name *</label>
          <input type="text" className="input-field" placeholder="The Midnight"
            value={artistName} onChange={e => setArtistName(e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-dim mb-1.5 font-medium">Start Date *</label>
            <input type="date" className="input-field"
              value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs text-text-dim mb-1.5 font-medium">End Date *</label>
            <input type="date" className="input-field"
              value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="block text-xs text-text-dim mb-1.5 font-medium">Tour Manager Name</label>
          <input type="text" className="input-field" placeholder="John Smith"
            value={tmName} onChange={e => setTmName(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs text-text-dim mb-1.5 font-medium">Tour Manager Email</label>
          <input type="email" className="input-field" placeholder="tm@example.com"
            value={tmEmail} onChange={e => setTmEmail(e.target.value)} />
        </div>

        <div>
          <label className="block text-xs text-text-dim mb-1.5 font-medium">Booking Agent</label>
          <input type="text" className="input-field" placeholder="CAA"
            value={bookingAgent} onChange={e => setBookingAgent(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-text-dim mb-1.5 font-medium">Vehicle Type</label>
            <select className="input-field" value={vehicleType} onChange={e => setVehicleType(e.target.value)}>
              <option value="bus">Bus</option>
              <option value="van">Van</option>
              <option value="suv">SUV</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-text-dim mb-1.5 font-medium">Drive Speed (mph)</label>
            <input type="number" className="input-field" min={30} max={80}
              value={driveSpeed} onChange={e => setDriveSpeed(Number(e.target.value))} />
          </div>
        </div>

        {error && <p className="text-danger text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Link href="/dashboard" className="btn-secondary flex-1 text-center">Cancel</Link>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Creating...' : 'Create Tour'}
          </button>
        </div>
      </form>
    </div>
  )
}
