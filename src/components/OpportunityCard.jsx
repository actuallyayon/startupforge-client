import Link from 'next/link';
import { FiBriefcase, FiClock, FiCalendar } from 'react-icons/fi'

function formatDate(d) {
  if (!d) return 'Open'
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function OpportunityCard({ opportunity }) {
  const skills = opportunity.required_skills || []
  return (
    <div className="card flex h-full flex-col p-5 transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 text-lg font-bold">{opportunity.role_title}</h3>
        <span className="badge shrink-0 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
          {opportunity.work_type}
        </span>
      </div>

      <p className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <FiBriefcase /> {opportunity.startup_name || 'Startup'}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {skills.slice(0, 4).map((s) => (
          <span key={s} className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {s}
          </span>
        ))}
        {skills.length > 4 && (
          <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            +{skills.length - 4}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
        {opportunity.commitment_level && (
          <span className="flex items-center gap-1"><FiClock /> {opportunity.commitment_level}</span>
        )}
        <span className="flex items-center gap-1"><FiCalendar /> Deadline: {formatDate(opportunity.deadline)}</span>
      </div>

      <Link href={`/opportunities/${opportunity._id}`} className="btn-primary mt-5">
        View & Apply
      </Link>
    </div>
  )
}
