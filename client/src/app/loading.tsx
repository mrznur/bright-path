// Shows during route transitions instead of a blank screen.
export default function Loading() {
  return (
    <main className="min-h-screen bg-[#FFF6E5]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="animate-pulse space-y-4">
          {/* Hero skeleton */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="h-4 w-32 rounded bg-[#E8DCC8]" />
              <div className="h-12 w-3/4 rounded bg-[#E8DCC8]" />
              <div className="h-4 w-full rounded bg-[#E8DCC8]" />
              <div className="h-4 w-2/3 rounded bg-[#E8DCC8]" />
              <div className="flex gap-3 pt-2">
                <div className="h-11 w-36 rounded-full bg-[#E8DCC8]" />
                <div className="h-11 w-28 rounded-full bg-[#E8DCC8]" />
              </div>
            </div>
            <div className="flex-1">
              <div className="aspect-[4/3] w-full rounded-2xl bg-[#E8DCC8]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
