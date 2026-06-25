import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <img src="/forge.svg" alt="StartupForge" className="h-8 w-8" />
            <span className="text-lg font-extrabold">
              Startup<span className="text-brand-600">Forge</span>
            </span>
          </Link>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Where founders meet the talent to build the next big thing.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li><Link href="/" className="hover:text-brand-600">Home</Link></li>
            <li><Link href="/startups" className="hover:text-brand-600">Browse Startups</Link></li>
            <li><Link href="/opportunities" className="hover:text-brand-600">Browse Opportunities</Link></li>
            <li><Link href="/login" className="hover:text-brand-600">Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            Contact
          </h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li className="flex items-center gap-2"><FiMail /> hello@startupforge.com</li>
            <li className="flex items-center gap-2"><FiPhone /> +1 (555) 012-3456</li>
            <li className="flex items-center gap-2"><FiMapPin /> San Francisco, CA</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
            Follow Us
          </h4>
          <div className="flex gap-3">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-outline p-2" aria-label="GitHub"><FiGithub /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="btn-outline p-2" aria-label="Twitter"><FiTwitter /></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="btn-outline p-2" aria-label="LinkedIn"><FiLinkedin /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © {new Date().getFullYear()} StartupForge. All rights reserved.
      </div>
    </footer>
  )
}
