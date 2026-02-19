import { Link } from 'react-router-dom'
import { Calendar, FileEdit, Search, TrendingUp, RefreshCw, FileSearch, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
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
      <ul className="space-y-3" role="list" aria-label="Loading recent research">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <Skeleton className="h-16 w-full rounded-lg animate-pulse" />
          </li>
        ))}
      </ul>
    )
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/10 py-12 px-4 text-center"
        role="alert"
        aria-label="Failed to load research"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-8 w-8 text-destructive" aria-hidden />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Unable to load research</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong. Please try again.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isRefetching}
          aria-label="Retry loading research"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} aria-hidden />
          {isRefetching ? 'Retrying…' : 'Try again'}
        </Button>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-border bg-muted/10 py-12 px-4 text-center"
        role="status"
        aria-label="No research yet"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileSearch className="h-8 w-8 text-muted-foreground" aria-hidden />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">No research yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Start a research in the Research workspace to discover sources and generate content for your drafts.
          </p>
        </div>
        <Button variant="outline" asChild aria-label="Go to research workspace">
          <Link to="/dashboard/research" className="inline-flex items-center">
            <Search className="mr-2 h-4 w-4" aria-hidden />
            Start research
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <ul className="space-y-3" role="list">
      {jobs.map((job) => (
        <li key={job.id}>
          <Link
            to="/dashboard/research"
            className="block rounded-lg border border-border p-3 transition-colors duration-200 hover:bg-secondary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <div className="font-medium text-foreground truncate">{job.query}</div>
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
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
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
            <div className="text-2xl font-bold text-foreground">28</div>
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
            <div className="text-2xl font-bold text-foreground">7</div>
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
            <div className="text-2xl font-bold text-foreground">14</div>
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
            <div className="text-2xl font-bold text-foreground">12</div>
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
                  <span className="text-foreground">{event.title}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/dashboard/planner"
              className="mt-4 block text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
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
                    className="block rounded-lg border border-border p-3 transition-colors duration-200 hover:bg-secondary/50 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <div className="font-medium text-foreground">{draft.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {draft.channel} · {draft.updated}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/dashboard/projects"
              className="mt-4 block text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
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
                      borderRadius: '0.75rem',
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
            className="mt-4 block text-sm font-medium text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded"
          >
            View research workspace →
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
