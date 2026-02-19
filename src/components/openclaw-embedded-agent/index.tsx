import { useState } from 'react'
import {
  Sparkles,
  Search,
  Loader2,
  ExternalLink,
  XCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  submitResearchJob,
  submitGenerationRequest,
  getJobStatus,
  listJobs,
  deleteJob,
  formatJobStatus,
  getConfidenceLabel,
} from '@/services/openclaw-embedded-agentService'
import type { OpenClawJob, OpenClawSource } from '@/types/database'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface OpenClawEmbeddedAgentProps {
  /** Callback when user selects output to insert into editor */
  onInsertOutput?: (content: string) => void
  /** Compact mode for embedding in Content Studio */
  compact?: boolean
  /** Initial query to pre-fill */
  initialQuery?: string
}

export function OpenClawEmbeddedAgent({
  onInsertOutput,
  compact = false,
  initialQuery = '',
}: OpenClawEmbeddedAgentProps) {
  const [query, setQuery] = useState(initialQuery)
  const [outputType, setOutputType] = useState<'thread' | 'script' | 'caption'>('caption')
  const [selectedJob, setSelectedJob] = useState<OpenClawJob | null>(null)
  const [expandedSources, setExpandedSources] = useState(false)
  const [page, setPage] = useState(0)
  const [jobTypeFilter, setJobTypeFilter] = useState<'research' | 'generate' | undefined>()
  const pageSize = 10
  const queryClient = useQueryClient()

  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['openclaw-jobs', page, jobTypeFilter],
    queryFn: async () => {
      const { data, error } = await listJobs({
        limit: pageSize,
        offset: page * pageSize,
        type: jobTypeFilter,
      })
      if (error) throw error
      return data ?? { jobs: [] }
    },
  })

  const jobs = jobsData?.jobs ?? []

  const { data: selectedJobDetails } = useQuery({
    queryKey: ['openclaw-job', selectedJob?.id],
    queryFn: async () => {
      if (!selectedJob?.id) return null
      const { data, error } = await getJobStatus(selectedJob.id)
      if (error) throw error
      return data?.job ?? null
    },
    enabled: !!selectedJob?.id,
  })

  const displayJob = selectedJobDetails ?? selectedJob

  const researchMutation = useMutation({
    mutationFn: (q: string) => submitResearchJob({ query: q }),
    onSuccess: (result) => {
      if (result.error) {
        if ((result.error as Error & { code?: string }).code === 'RATE_LIMIT') {
          toast.error('Rate limit exceeded. Try again later.')
        } else {
          toast.error(result.error.message)
        }
        return
      }
      toast.success('Research completed')
      queryClient.invalidateQueries({ queryKey: ['openclaw-jobs'] })
      if (result.data?.job) {
        setSelectedJob(result.data.job)
      }
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const generateMutation = useMutation({
    mutationFn: (q: string) =>
      submitGenerationRequest({ query: q, outputType }),
    onSuccess: (result) => {
      if (result.error) {
        if ((result.error as Error & { code?: string }).code === 'RATE_LIMIT') {
          toast.error('Rate limit exceeded. Try again later.')
        } else {
          toast.error(result.error.message)
        }
        return
      }
      toast.success('Generation completed')
      queryClient.invalidateQueries({ queryKey: ['openclaw-jobs'] })
      if (result.data?.job) {
        setSelectedJob(result.data.job)
      }
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error.message)
        return
      }
      toast.success('Job deleted')
      queryClient.invalidateQueries({ queryKey: ['openclaw-jobs'] })
      if (selectedJob) {
        setSelectedJob(null)
      }
    },
    onError: (err: Error) => toast.error(err.message),
  })

  const handleResearch = () => {
    const q = query.trim()
    if (!q) {
      toast.error('Enter a research topic')
      return
    }
    researchMutation.mutate(q)
  }

  const handleGenerate = () => {
    const q = query.trim()
    if (!q) {
      toast.error('Enter a topic for generation')
      return
    }
    generateMutation.mutate(q)
  }

  const handleInsert = (content: string) => {
    onInsertOutput?.(content)
    toast.success('Content inserted')
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  const isPending = researchMutation.isPending || generateMutation.isPending

  if (compact) {
    return (
      <Card className="animate-in-up transition-all duration-300 hover:shadow-card-hover">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <Input
                placeholder="Research or generate..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                className="flex-1"
              />
              <Button
                size="icon"
                onClick={handleResearch}
                disabled={isPending}
                aria-label="Research"
              >
                {researchMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isPending}
                aria-label="Generate"
              >
                {generateMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              OpenClaw researches topics and generates threads, scripts, or captions with source provenance.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 animate-in-up">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-card-hover">
        <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            OpenClaw Research & Generation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Research topics on the web, summarize sources, and generate structured outputs with provenance.
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <label htmlFor="openclaw-query" className="text-sm font-medium">
                Topic or query
              </label>
              <Input
                id="openclaw-query"
                placeholder="e.g. Creator economy trends 2025"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
                className="h-11"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex gap-2">
                <Button
                  onClick={handleResearch}
                  disabled={isPending}
                  className="min-w-[120px]"
                >
                  {researchMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Research
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGenerate}
                  disabled={isPending}
                  className="min-w-[120px]"
                >
                  {generateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Generate
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Output:</span>
                <div className="flex rounded-lg border border-border p-1">
                  {(['caption', 'thread', 'script'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOutputType(t)}
                      className={cn(
                        'rounded-md px-3 py-1 text-sm font-medium transition-colors',
                        outputType === t
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-secondary'
                      )}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg">Recent jobs</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Research and generation history with status
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setJobTypeFilter(undefined)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    !jobTypeFilter ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setJobTypeFilter('research')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    jobTypeFilter === 'research' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  Research
                </button>
                <button
                  type="button"
                  onClick={() => setJobTypeFilter('generate')}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    jobTypeFilter === 'generate' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  )}
                >
                  Generate
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold">No jobs yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Start a research or generation to see results here.
                  </p>
                </div>
                <Button onClick={handleResearch} variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Research a topic
                </Button>
              </div>
            ) : (
              <>
                <div className="max-h-80 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Query</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-12" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs.map((job) => (
                        <JobRow
                          key={job.id}
                          job={job}
                          onSelect={() => setSelectedJob(job)}
                          isSelected={selectedJob?.id === job.id}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {jobs.length > 0 && (
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      Page {page + 1}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={jobs.length < pageSize}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="transition-all duration-300 hover:shadow-card-hover">
          <CardHeader>
            <CardTitle className="text-lg">Job details</CardTitle>
            <p className="text-sm text-muted-foreground">
              Output, sources, and confidence
            </p>
          </CardHeader>
          <CardContent>
            {displayJob ? (
              <JobDetail
                job={displayJob}
                onInsert={onInsertOutput ? handleInsert : undefined}
                onCopy={handleCopy}
                onDelete={() => {
                  deleteMutation.mutate(displayJob.id)
                }}
                isDeleting={deleteMutation.isPending}
                expandedSources={expandedSources}
                onToggleSources={() => setExpandedSources(!expandedSources)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  Select a job to view output and sources.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </div>
  )
}

function JobRow({
  job,
  onSelect,
  isSelected,
}: {
  job: OpenClawJob
  onSelect: () => void
  isSelected: boolean
}) {
  const statusColor =
    job.status === 'completed'
      ? 'bg-green-500/20 text-green-600 dark:text-green-400'
      : job.status === 'failed'
        ? 'bg-accent/20 text-accent'
        : job.status === 'processing'
          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
          : 'bg-secondary text-muted-foreground'

  return (
    <TableRow
      className={cn(
        'cursor-pointer transition-colors',
        isSelected && 'bg-primary/10'
      )}
      onClick={onSelect}
    >
      <TableCell className="max-w-[180px] truncate font-medium" title={job.query}>
        {job.query}
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {job.type}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={cn('capitalize', statusColor)}>
          {formatJobStatus(job.status)}
        </Badge>
      </TableCell>
      <TableCell>
        {job.status === 'completed' && job.confidence_score != null && (
          <span className="text-xs text-muted-foreground">
            {Math.round(job.confidence_score * 100)}%
          </span>
        )}
      </TableCell>
    </TableRow>
  )
}

function JobDetail({
  job,
  onInsert,
  onCopy,
  onDelete,
  isDeleting,
  expandedSources,
  onToggleSources,
}: {
  job: OpenClawJob
  onInsert?: (content: string) => void
  onCopy: (text: string) => void
  onDelete?: () => void
  isDeleting?: boolean
  expandedSources: boolean
  onToggleSources: () => void
}) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const sources = job.sources ?? []

  const handleDelete = () => {
    onDelete?.()
    setDeleteDialogOpen(false)
  }
  const outputStr =
    job.output && typeof job.output === 'object'
      ? 'summary' in job.output
        ? String((job.output as { summary?: string }).summary ?? JSON.stringify(job.output))
        : 'posts' in job.output
          ? (job.output as { posts?: string[] }).posts?.join('\n\n') ?? JSON.stringify(job.output)
          : 'script' in job.output
            ? String((job.output as { script?: string }).script ?? JSON.stringify(job.output))
            : 'caption' in job.output
              ? String((job.output as { caption?: string }).caption ?? JSON.stringify(job.output))
              : JSON.stringify(job.output, null, 2)
      : ''

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            className={
              job.status === 'completed'
                ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                : job.status === 'failed'
                  ? 'bg-accent/20 text-accent'
                  : 'bg-secondary'
            }
          >
            {formatJobStatus(job.status)}
          </Badge>
          {job.confidence_score != null && (
            <span className="text-sm text-muted-foreground">
              Confidence: {getConfidenceLabel(job.confidence_score)}
            </span>
          )}
        </div>
        {onDelete && (
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-muted-foreground hover:text-accent"
                aria-label="Delete job"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this job?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove the job and its sources. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-accent hover:bg-accent/90"
                >
                  {isDeleting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {job.error_message && (
        <div className="flex items-center gap-2 rounded-lg border border-accent/50 bg-accent/10 p-3">
          <XCircle className="h-5 w-5 shrink-0 text-accent" />
          <p className="text-sm text-accent">{job.error_message}</p>
        </div>
      )}

      {outputStr && job.status === 'completed' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Output</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onCopy(outputStr)}
                className="h-8"
              >
                <Copy className="h-4 w-4" />
              </Button>
              {onInsert && (
                <Button
                  size="sm"
                  onClick={() => onInsert(outputStr)}
                  className="h-8"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Insert
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-40 overflow-y-auto rounded-lg border border-border bg-secondary/30 p-4 text-sm">
            <pre className="whitespace-pre-wrap font-sans">{outputStr}</pre>
          </div>
        </div>
      )}

      {sources.length > 0 && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={onToggleSources}
            className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-secondary/50"
          >
            <span className="text-sm font-medium">
              Sources ({sources.length})
            </span>
            {expandedSources ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSources && (
            <div className="space-y-2">
              {sources.map((src) => (
                <SourceCard key={src.id} source={src} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SourceCard({ source }: { source: OpenClawSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 rounded-lg border border-border p-3 transition-all duration-200 hover:border-primary/50 hover:shadow-md"
    >
      <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{source.title || source.url}</p>
        {source.snippet && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {source.snippet}
          </p>
        )}
      </div>
    </a>
  )
}

