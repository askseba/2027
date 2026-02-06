export default function ResultsLoading() {
  return (
    <div className="min-h-screen bg-cream-bg dark:bg-background pb-20" dir="rtl">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 dark:from-amber-500/10 to-transparent pt-16 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="h-12 w-3/4 mx-auto rounded-xl bg-cream-bg dark:bg-surface-muted animate-pulse" />
          <div className="h-6 w-full rounded-lg bg-cream-bg dark:bg-surface-muted animate-pulse" />
          <div className="h-10 w-64 mx-auto rounded-lg bg-cream-bg dark:bg-surface-muted animate-pulse" />
        </div>
      </section>

      {/* Grid: 8 cards */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-surface rounded-2xl p-4 shadow-elevation-1 border border-primary/5 dark:border-border-subtle animate-pulse"
            >
              <div className="h-64 w-full rounded-xl bg-cream-bg dark:bg-surface-muted mb-4" />
              <div className="h-5 w-4/5 rounded bg-cream-bg dark:bg-surface-muted mb-2" />
              <div className="h-4 w-3/5 rounded bg-cream-bg dark:bg-surface-muted mb-3" />
              <div className="h-3 w-full rounded bg-cream-bg dark:bg-surface-muted" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
