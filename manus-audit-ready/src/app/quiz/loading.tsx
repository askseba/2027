export default function QuizLoading() {
  return (
    <div className="min-h-screen bg-cream-bg dark:bg-background p-6" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Progress: 4 dots (generic for all steps) */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-3 w-3 rounded-full bg-primary/30 dark:bg-amber-500/30 animate-pulse"
            />
          ))}
        </div>

        {/* Header: title block */}
        <div className="h-10 w-full rounded-xl bg-cream-bg dark:bg-surface-muted animate-pulse mb-2" />
        <div className="h-6 w-4/5 rounded-lg bg-cream-bg dark:bg-surface-muted animate-pulse mb-8" />

        {/* Main: question area + search bar */}
        <div className="space-y-4 mb-10">
          <div className="h-5 w-full rounded bg-cream-bg dark:bg-surface-muted animate-pulse" />
          <div className="h-5 w-3/4 rounded bg-cream-bg dark:bg-surface-muted animate-pulse" />
          <div className="h-5 w-5/6 rounded bg-cream-bg dark:bg-surface-muted animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-cream-bg dark:bg-surface-muted animate-pulse" />
        </div>

        {/* Navigation: Back / Next */}
        <div className="flex gap-4">
          <div className="h-12 flex-1 rounded-2xl bg-cream-bg dark:bg-surface-muted animate-pulse" />
          <div className="h-12 flex-[2] rounded-2xl bg-cream-bg dark:bg-surface-muted animate-pulse" />
        </div>
      </div>
    </div>
  )
}
