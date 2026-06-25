'use client';

import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  FiBriefcase, FiInbox, FiCheckCircle, FiClock, FiUsers, FiLayers, FiDollarSign, FiList,
} from 'react-icons/fi'
import { api } from '../../src/lib/api'
import { useAuth } from '../../src/context/AuthContext'
import StatCard from '../../src/components/dashboard/StatCard'
import Loader from '../../src/components/Loader'

const COLORS = ['#3563ff', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6']

export default function DashboardHome() {
  const { role, profile } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['stats', role],
    queryFn: async () => (await api.get(`/stats/${role}`)).data,
    enabled: !!role,
  })

  if (isLoading || !data) return <Loader label="Loading overview..." />

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Welcome back, {profile?.name?.split(' ')[0] || 'there'}</h1>
      <p className="mt-1 text-slate-500 dark:text-slate-400 capitalize">{role} dashboard overview</p>

      {role === 'founder' && <FounderOverview data={data} />}
      {role === 'collaborator' && <CollaboratorOverview data={data} />}
      {role === 'admin' && <AdminOverview data={data} />}
    </div>
  )
}

function FounderOverview({ data }) {
  return (
    <>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        <StatCard icon={FiBriefcase} label="Total Opportunities" value={data.totalOpportunities} />
        <StatCard icon={FiInbox} label="Total Applications" value={data.totalApplications} accent="amber" />
        <StatCard icon={FiCheckCircle} label="Accepted Members" value={data.acceptedMembers} accent="emerald" />
      </div>
      <div className="card mt-8 p-6">
        <h2 className="mb-4 text-lg font-bold">Applications per Opportunity</h2>
        {data.chart?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.chart}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="applications" fill="#3563ff" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500">Post opportunities to see analytics here.</p>
        )}
      </div>
    </>
  )
}

function CollaboratorOverview({ data }) {
  return (
    <>
      <div className="mt-6 grid gap-5 sm:grid-cols-4">
        <StatCard icon={FiList} label="Total Applications" value={data.total} />
        <StatCard icon={FiClock} label="Pending" value={data.pending} accent="amber" />
        <StatCard icon={FiCheckCircle} label="Accepted" value={data.accepted} accent="emerald" />
        <StatCard icon={FiInbox} label="Rejected" value={data.rejected} accent="rose" />
      </div>
      <div className="card mt-8 p-6">
        <h2 className="mb-4 text-lg font-bold">Application Status Breakdown</h2>
        {data.total ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.chart} dataKey="value" nameKey="name" outerRadius={110} label>
                {data.chart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500">Apply to opportunities to track your progress.</p>
        )}
      </div>
    </>
  )
}

function AdminOverview({ data }) {
  return (
    <>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FiUsers} label="Total Users" value={data.totalUsers} />
        <StatCard icon={FiLayers} label="Total Startups" value={data.totalStartups} accent="amber" />
        <StatCard icon={FiBriefcase} label="Total Opportunities" value={data.totalOpportunities} accent="emerald" />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={`$${data.totalRevenue}`} accent="rose" />
      </div>
      <div className="card mt-8 p-6">
        <h2 className="mb-4 text-lg font-bold">Users by Role</h2>
        {data.chart?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data.chart} dataKey="value" nameKey="name" outerRadius={110} label>
                {data.chart.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-slate-500">No data yet.</p>
        )}
      </div>
    </>
  )
}
