'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
  currency: string
  notes: string | null
}

const CATEGORIES = [
  'food', 'fuel', 'lodging', 'transport', 'equipment', 'per_diem', 'laundry', 'other'
]

export default function ExpensesPage() {
  const params = useParams()
  const tourId = params.id as string
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [category, setCategory] = useState('food')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadExpenses()
  }, [tourId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadExpenses() {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('tour_id', tourId)
      .order('date', { ascending: false })
    setExpenses(data || [])
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('expenses').insert({
      tour_id: tourId,
      user_id: user.id,
      date,
      category,
      description,
      amount: parseFloat(amount),
      notes: notes || null,
    })

    setDate(new Date().toISOString().split('T')[0])
    setCategory('food')
    setDescription('')
    setAmount('')
    setNotes('')
    setShowForm(false)
    setSaving(false)
    loadExpenses()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this expense?')) return
    await supabase.from('expenses').delete().eq('id', id)
    loadExpenses()
  }

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0)
  const byCategory = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount)
    return acc
  }, {} as Record<string, number>)

  const categoryColors: Record<string, string> = {
    food: '#22c55e', fuel: '#f59e0b', lodging: '#8b5cf6',
    transport: '#22d3ee', equipment: '#ef4444', per_diem: '#d90429',
    laundry: '#a78bfa', other: '#8888a0',
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="text-text-dim text-sm">Loading...</div></div>
  }

  return (
    <div className="animate-in">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <Link href={`/tours/${tourId}`} className="text-text-dim hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </Link>
        <h1 className="text-lg font-semibold flex-1">Expenses</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm py-1.5 px-4">
          {showForm ? '×' : '+ Add'}
        </button>
      </div>

      {/* Category Breakdown */}
      <div className="px-5 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-text-dim font-medium">TOTAL</span>
          <span className="font-mono font-bold">${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-bg">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <div
              key={cat}
              style={{ width: `${(amt / total) * 100}%`, background: categoryColors[cat] || '#888' }}
              title={`${cat}: $${amt.toFixed(2)}`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(byCategory).map(([cat, amt]) => (
            <span key={cat} className="text-[10px] text-text-dim">
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: categoryColors[cat] || '#888' }} />
              {cat}: ${amt.toFixed(2)}
            </span>
          ))}
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleAdd} className="px-5 py-4 border-b border-border space-y-3 bg-bg-card">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-text-dim mb-1">Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div>
              <label className="block text-xs text-text-dim mb-1">Category</label>
              <select className="input-field" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-dim mb-1">Description</label>
            <input type="text" className="input-field" placeholder="What was this?" value={description} onChange={e => setDescription(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs text-text-dim mb-1">Amount ($)</label>
            <input type="number" step="0.01" className="input-field" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div>
            <label className="block text-xs text-text-dim mb-1">Notes</label>
            <input type="text" className="input-field" placeholder="Optional" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={saving}>
            {saving ? 'Saving...' : 'Save Expense'}
          </button>
        </form>
      )}

      {/* Expense List */}
      <div className="py-2">
        {expenses.length === 0 ? (
          <div className="px-5 py-12 text-center text-text-dim text-sm">
            No expenses recorded yet.
          </div>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="flex items-center gap-3 px-5 py-3 border-b border-border">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${categoryColors[exp.category] || '#888'}20` }}>
                <div className="w-3 h-3 rounded-full" style={{ background: categoryColors[exp.category] || '#888' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{exp.description}</div>
                <div className="text-xs text-text-dim">
                  {new Date(exp.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {exp.category}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold text-sm">${Number(exp.amount).toFixed(2)}</div>
                <button onClick={() => handleDelete(exp.id)} className="text-[10px] text-text-muted hover:text-danger transition-colors">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
