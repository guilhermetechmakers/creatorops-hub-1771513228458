import { useState } from 'react'
import { LayoutGrid, List, Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const mockProjects = [
  { id: '1', title: 'Q1 Product Launch', status: 'drafting', channel: 'Multi', assignee: 'You' },
  { id: '2', title: 'Tutorial Series', status: 'in_review', channel: 'YouTube', assignee: 'Team' },
  { id: '3', title: 'Weekly Thread', status: 'scheduled', channel: 'X', assignee: 'You' },
]

export function ProjectsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')

  return (
    <div className="space-y-6 animate-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects & Content</h1>
          <p className="text-muted-foreground">
            Organize and browse projects and content
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create project
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setView('grid')}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setView('list')}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        className={
          view === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'
            : 'flex flex-col gap-2'
        }
      >
        {mockProjects.map((project) => (
          <Card key={project.id} className="cursor-pointer transition-all hover:scale-[1.01]">
            <CardContent className="p-4">
              <div className="font-medium">{project.title}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="rounded bg-secondary px-2 py-0.5">{project.status}</span>
                <span>{project.channel}</span>
                <span>·</span>
                <span>{project.assignee}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
