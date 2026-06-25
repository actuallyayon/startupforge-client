export default function Loader({ label = 'Loading...', full = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${
        full ? 'min-h-screen' : 'py-20'
      }`}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  )
}
