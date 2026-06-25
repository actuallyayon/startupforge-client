export default function StatCard({ icon: Icon, label, value, accent = 'brand' }) {
  const accents = {
    brand: 'bg-brand-50 text-brand-600 dark:bg-brand-900/40',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/40',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/40',
  }
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`rounded-xl p-3 ${accents[accent]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-extrabold">{value}</p>
      </div>
    </div>
  )
}
