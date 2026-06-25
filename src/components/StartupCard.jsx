import Link from 'next/link';
import { FiUsers } from 'react-icons/fi'

export default function StartupCard({ startup }) {
  return (
    <Link
      href={`/startups/${startup._id}`}
      className="card flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-brand-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
        <img
          src={startup.logo || '/forge.svg'}
          alt={startup.startup_name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200">
            {startup.industry}
          </span>
          {startup.status && (
            <span className="text-xs capitalize text-slate-400">{startup.status}</span>
          )}
        </div>
        <h3 className="line-clamp-1 text-lg font-bold">{startup.startup_name}</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Founder: {startup.founder_email}
        </p>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600 dark:text-slate-300">
          {startup.description || 'A promising startup looking to build its team.'}
        </p>
        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-brand-600">
          <FiUsers /> Team size needed: {startup.team_size_needed ?? 0}
        </div>
      </div>
    </Link>
  )
}
