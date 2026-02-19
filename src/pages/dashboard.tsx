import { Link } from 'react-router-dom'
import { Calendar, FileEdit, Search, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { listJobs } from '@/services/openclaw-embedded-agentService'
import { Skeleton } from '@/components/ui/skeleton'

const mockCalendarEvents = [
  { time: '9:00', title: 'Instagram post review' },
  { time: '14:00', title: 'YouTube script draft' },
  { time: '18:00', title: 'X thread scheduled' },
]

const mockDrafts = [
  { title: 'Q1 Product Launch Thread', channel: 'X', updated: '2h ago' },
  { title: 'Tutorial Script v2', channel: 'YouTube', updated: '5h ago' },
]


const chartData = [
  { name: 'Mon', posts: 4 },
  { name: 'Tue', posts: 3 },
  { name: 'Wed', posts: 6 },
  { name: 'Thu', posts: 5 },
  { name: 'Fri', posts: 7 },
  { name: 'Sat', posts: 2 },
  { name: 'Sun', posts: 1 },
]

function RecentResearch() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['openclaw-jobs', 'dashboard'],
    queryFn: async () => {
      const result = await listJobs({ limit: 5, offset: 0 })
      if (result.error) throw result.error
      return result.data?.jobs ?? []
    },
  })

  const jobs = data ?? []

  if (isLoading) {
    return (
      <ul className="space-y-3">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <Skeleton className="h-16 w-full rounded-lg" />
          </li>
        ))}
      </ul>
    )
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Unable to load research. Try again later.
      </p>
    )
  }

  if (jobs.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No research yet. Start a research in the Research workspace.
      </p>
    )
  }

  return (
    <ul className="space-y-3">
      {jobs.map((job) => (
        <li key={job.id}>
          <Link
            to="/dashboard/research"
            className="block rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
          >
            <div className="font-medium truncate">{job.query}</div>
            <div className="text-sm text-muted-foreground">
              {job.type} · {job.status}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function DashboardPage() {
  return (
    <div className="space-y-8 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Your operational overview and quick actions
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Posts this week
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts in progress
            </CardTitle>
            <FileEdit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Research items
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">2 new today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Next: Instagram 9am</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today / Upcoming */}
        <Card>
          <CardHeader>
            <CardTitle>Today & Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockCalendarEvents.map((event) => (
                <li
                  key={event.time}
                  className="flex items-center gap-4 rounded-lg border border-border p-3"
                >
                  <span className="text-sm font-medium text-muted-foreground">
                    {event.time}
                  </span>
                  <span>{event.title}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/dashboard/planner"
              className="mt-4 block text-sm font-medium text-accent hover:underline"
            >
              View full calendar →
            </Link>
          </CardContent>
        </Card>

        {/* Recent drafts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {mockDrafts.map((draft) => (
                <li key={draft.title}>
                  <Link
                    to="/dashboard/studio"
                    className="block rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
                  >
                    <div className="font-medium">{draft.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {draft.channel} · {draft.updated}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/dashboard/projects"
              className="mt-4 block text-sm font-medium text-accent hover:underline"
            >
              View all projects →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Publishing activity</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient
                      id="colorPosts"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="rgb(var(--primary))"
                        stopOpacity={0.3}
                      />
                      <stop
                        offset="95%"
                        stopColor="rgb(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="rgb(var(--muted-foreground))" />
                  <YAxis stroke="rgb(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--card))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="posts"
                    stroke="rgb(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPosts)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>

      {/* Recent research */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Research</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentResearch />
          <Link
            to="/dashboard/research"
            className="mt-4 block text-sm font-medium text-accent hover:underline"
          >
            View research workspace →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
