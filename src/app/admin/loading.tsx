export default function AdminLoading() {
    return (
        <div className="p-6 sm:p-10">
            {/* Page title skeleton */}
            <div className="h-8 w-48 animate-pulse rounded-xl bg-ink/10" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded-lg bg-ink/10" />

            {/* Stat cards skeleton */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-2xl border-2 border-ink/10 bg-brand-gray" />
                ))}
            </div>
        </div>
    );
}
