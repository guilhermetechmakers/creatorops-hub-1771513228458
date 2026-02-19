import { Calendar, LayoutList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const pipelineStages = ['Ideas', 'Drafting', 'In Review', 'Scheduled', 'Published']

export function PlannerPage() {
  return (
    <div className="space-y-6 animate-in-up">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Publishing Planner</h1>
          <p className="text-muted-foreground">
            Editorial calendar and Kanban pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
          <Button>
            <LayoutList className="mr-2 h-4 w-4" />
            Pipeline
          </Button>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <Card key={stage} className="min-w-[280px] flex-shrink-0">
            <CardContent className="p-4">
              <div className="mb-3 font-medium">{stage}</div>
              <div className="min-h-[120px] rounded border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
                Drag content here
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
