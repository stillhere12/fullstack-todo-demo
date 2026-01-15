export default function NotesLoading() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Skeleton */}
        <header className="mb-10 text-center space-y-4">
          <div className="h-9 w-48 bg-muted rounded animate-pulse mx-auto" />
          <div className="h-10 w-24 bg-muted rounded animate-pulse mx-auto" />
        </header>

        {/* Form Section Skeleton */}
        <section className="bg-card shadow-sm border border-border rounded-xl p-6 mb-10">
          <div className="h-7 w-36 bg-muted rounded animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
        </section>

        {/* Notes List Skeleton */}
        <section>
          <div className="h-7 w-32 bg-muted rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-xl border border-border shadow-sm animate-pulse">
                <div className="flex flex-col justify-center items-center gap-2 md:flex-row">
                  <div className="h-6 w-40 bg-muted rounded" />
                  <div className="h-10 w-20 bg-muted rounded" />
                  <div className="h-10 w-20 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
