'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { FiArrowRight, FiUsers, FiZap, FiTarget } from 'react-icons/fi'
import { api } from '../src/lib/api'
import StartupCard from '../src/components/StartupCard'
import OpportunityCard from '../src/components/OpportunityCard'
import Loader from '../src/components/Loader'
import CountUp from '../src/components/CountUp'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

export default function Home() {
  const { data: startups, isLoading: loadingStartups } = useQuery({
    queryKey: ['featured-startups'],
    queryFn: async () => (await api.get('/startups?limit=4')).data,
  })

  const { data: opps, isLoading: loadingOpps } = useQuery({
    queryKey: ['featured-opportunities'],
    queryFn: async () => (await api.get('/opportunities?limit=4')).data.data,
  })

  return (
    <div>
      {/* Banner */}
      <section className="relative isolate overflow-hidden text-white">
        {/* Full-bleed background image with layered gradient overlays */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2070&q=80"
            alt="A startup team collaborating"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-brand-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-slate-950/20" />
        </div>

        <div className="container-page relative py-28 lg:py-40">
          <motion.div
            className="max-w-2xl"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
              Build your dream team
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="mt-6 text-5xl font-extrabold leading-[1.05] sm:text-6xl"
            >
              Forge the team behind the next big startup
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-slate-200">
              StartupForge connects visionary founders with talented developers, designers, and
              marketers ready to build something extraordinary together.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-3">
              <Link href="/opportunities" className="btn bg-white text-slate-900 hover:bg-slate-100">
                Find Opportunities <FiArrowRight />
              </Link>
              <Link
                href="/startups"
                className="btn border border-white/30 bg-white/5 text-white backdrop-blur hover:bg-white/15"
              >
                Browse Startups
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-14 grid max-w-xl grid-cols-3 gap-4">
              {[
                { icon: FiZap, to: 850, suffix: '+', label: 'Startups launched' },
                { icon: FiUsers, to: 10, suffix: 'k+', label: 'Founders & talent' },
                { icon: FiTarget, to: 3.2, decimals: 1, suffix: 'k', label: 'Roles filled' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md"
                >
                  <s.icon className="mb-2 text-brand-300" size={22} />
                  <CountUp
                    to={s.to}
                    decimals={s.decimals}
                    suffix={s.suffix}
                    className="block text-2xl font-extrabold"
                  />
                  <p className="text-xs text-slate-300">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Startups</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Fresh ideas looking for teammates</p>
          </div>
          <Link href="/startups" className="btn-outline hidden sm:inline-flex">
            View all startups <FiArrowRight />
          </Link>
        </div>
        {loadingStartups ? (
          <Loader />
        ) : startups?.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {startups.map((s) => (
              <StartupCard key={s._id} startup={s} />
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No startups yet. Be the first to launch one!</p>
        )}
      </section>

      {/* Featured Opportunities */}
      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="container-page">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Featured Opportunities</h2>
              <p className="mt-1 text-slate-500 dark:text-slate-400">Roles open right now</p>
            </div>
            <Link href="/opportunities" className="btn-outline hidden sm:inline-flex">
              View all opportunities <FiArrowRight />
            </Link>
          </div>
          {loadingOpps ? (
            <Loader />
          ) : opps?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {opps.map((o) => (
                <OpportunityCard key={o._id} opportunity={o} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No opportunities posted yet.</p>
          )}
        </div>
      </section>

      {/* Extra Section 1 — Why Join */}
      <section className="container-page py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Why Join StartupForge?</h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-slate-500 dark:text-slate-400">
          Everything you need to find the right people, or the right project.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { icon: FiTarget, title: 'Curated Matches', desc: 'Discover startups and roles aligned with your skills and ambitions.' },
            { icon: FiZap, title: 'Move Fast', desc: 'Apply in seconds, track status in real time, and get building sooner.' },
            { icon: FiUsers, title: 'Trusted Network', desc: 'Verified founders and collaborators, moderated by our admin team.' },
          ].map((f) => (
            <motion.div
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="card p-6"
            >
              <div className="mb-4 inline-flex rounded-xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-900/40">
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Extra Section 2 — Testimonials */}
      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="container-page">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Success Stories</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { name: 'Ava Chen', role: 'Founder, NovaPay', quote: 'Found my technical cofounder in under a week. StartupForge changed everything.' },
              { name: 'Marcus Lee', role: 'Full-stack Dev', quote: 'I joined an early-stage team and shipped to production within a month. Incredible.' },
              { name: 'Priya Nair', role: 'Product Designer', quote: 'The quality of founders here is unmatched. Real ideas, real traction.' },
            ].map((t) => (
              <motion.div
                key={t.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="card p-6"
              >
                <p className="text-slate-600 dark:text-slate-300">“{t.quote}”</p>
                <div className="mt-4">
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-brand-600">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 px-8 py-14 text-center text-white">
          <h2 className="text-3xl font-extrabold">Ready to build something great?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">
            Join thousands of founders and collaborators turning ideas into companies.
          </p>
          <Link href="/register" className="btn mt-8 bg-white text-brand-700 hover:bg-brand-50">
            Get Started Free <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  )
}
