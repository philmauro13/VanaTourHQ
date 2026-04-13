import Link from 'next/link'

export default function SettlementPage() {
  return (
    <div className="animate-in">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
        <Link href="/dashboard" className="text-text-dim hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        </Link>
        <h1 className="text-lg font-semibold">Settlement</h1>
      </div>
      <div className="px-5 py-12 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <p className="text-text-dim text-sm">Select a tour from the dashboard first.</p>
        <Link href="/dashboard" className="btn-primary inline-block mt-4">Go to Dashboard</Link>
      </div>
    </div>
  )
}
