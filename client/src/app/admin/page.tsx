import { getDashboardStats } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const dashboard = await getDashboardStats();
  const { activeCourses, enrolled, availableSeats, capacityUsed } = dashboard;

  const stats = [
    { label: 'Course offerings', value: activeCourses, detail: 'Current catalogue entries' },
    { label: 'Available seats', value: availableSeats, detail: `Across ${activeCourses} sample batches` },
    { label: 'Enrolled learners', value: enrolled, detail: 'Current catalogue snapshot' },
    { label: 'Capacity used', value: `${capacityUsed}%`, detail: 'Across active batches' },
  ];

  return (
    <>
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#F5C518]">Administration</p>
          <h1 className="mt-2 text-3xl font-bold">Overview</h1>
          <p className="mt-2 text-sm text-[#1E1B4B]/60">A starting point for managing BrightPath operations.</p>
        </div>
        <span className="w-fit rounded-full bg-[#F5EDD8] px-3 py-1 text-xs font-semibold text-[#1E1B4B]/60">Foundation phase</span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-2xl border border-[#E8DCC8] bg-white p-5">
            <p className="text-sm text-[#1E1B4B]/60">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="mt-2 text-xs text-[#1E1B4B]/45">{stat.detail}</p>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-[#E8DCC8] bg-white p-6">
        <h2 className="text-xl font-bold">Next up: course and batch management</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#1E1B4B]/60">
          Courses and batches are managed in Supabase. Public pages read the active catalogue and related content from the database.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href="/admin/courses" className="rounded-xl bg-[#F7F1E5] px-4 py-3 text-sm font-medium transition-colors hover:bg-[#EDE4D3]">Create and edit courses</a>
          <a href="/admin/batches" className="rounded-xl bg-[#F7F1E5] px-4 py-3 text-sm font-medium transition-colors hover:bg-[#EDE4D3]">Set batch schedules and capacity</a>
        </div>
      </section>
    </>
  );
}
