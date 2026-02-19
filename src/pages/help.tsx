import { Link } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function HelpPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-16 animate-in-up">
      <div>
        <h1 className="text-2xl font-bold">Help</h1>
        <p className="text-muted-foreground">
          Documentation and support resources
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <BookOpen className="h-12 w-12 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Knowledge base</h3>
              <p className="text-sm text-muted-foreground">
                Find answers to common questions
              </p>
              <Link to="/about" className="mt-2 inline-block text-sm font-medium text-accent hover:underline">
                Go to About & Help →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
