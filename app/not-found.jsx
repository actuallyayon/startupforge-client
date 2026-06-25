import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <svg viewBox="0 0 200 120" className="mb-8 w-72 max-w-full">
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0" stopColor="#3563ff" />
            <stop offset="1" stopColor="#8eb5ff" />
          </linearGradient>
        </defs>
        <text x="100" y="85" textAnchor="middle" fontSize="80" fontWeight="800" fill="url(#g)">
          404
        </text>
        <circle cx="40" cy="30" r="6" fill="#bcd3ff" />
        <circle cx="165" cy="40" r="9" fill="#d9e6ff" />
        <circle cx="150" cy="95" r="5" fill="#bcd3ff" />
      </svg>
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
        The page you're looking for doesn't exist or may have been moved. Let's get you back on
        track.
      </p>
      <Link href="/" className="btn-primary mt-8">
        <FiArrowLeft /> Back Home
      </Link>
    </div>
  )
}
