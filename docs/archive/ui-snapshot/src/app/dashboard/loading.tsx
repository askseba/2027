export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-cream-bg dark:bg-background pb-20" dir="rtl">
      {/* Header area - 40px pulse */}
      <header className="h-[40px] bg-cream-bg dark:bg-background border-b border-primary/10 dark:border-border-subtle animate-pulse" />

      <main className="max-w-6xl mx-auto px-6 mt-10">
        {/* Stats grid: 3 cards (image + 3 text lines each) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-surface rounded-3xl p-6 shadow-elevation-1 border border-primary/5 dark:border-border-subtle animate-pulse"
            >
              <div className="h-16 w-16 rounded-2xl bg-cream-bg dark:bg-surface-muted mb-4" />
              <div className="space-y-3">
                <div className="h-3 w-3/4 rounded bg-cream-bg dark:bg-surface-muted" />
                <div className="h-3 w-1/2 rounded bg-cream-bg dark:bg-surface-muted" />
                <div className="h-3 w-2/3 rounded bg-cream-bg dark:bg-surface-muted" />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs area: 4 tab buttons */}
        <div className="flex gap-1.5 p-1.5 bg-white dark:bg-surface rounded-2xl shadow-sm border border-primary/5 dark:border-border-subtle mb-8 w-full max-w-2xl">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 h-12 rounded-xl bg-cream-bg dark:bg-surface-muted animate-pulse"
            />
          ))}
        </div>

        {/* Content area: RadarChart placeholder */}
        <div className="max-w-2xl">
          <div
            className="aspect-square w-full max-w-md mx-auto rounded-3xl bg-cream-bg dark:bg-surface-muted animate-pulse"
            style={{ minHeight: '280px' }}
          />
        </div>
      </main>
    </div>
  )
}
