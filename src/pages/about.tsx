import { BookOpen, Video, Mail } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-12 px-4 py-16 animate-in-up">
      <div className="text-center">
        <h1 className="text-4xl font-bold">About & Help</h1>
        <p className="mt-4 text-muted-foreground">
          Self-serve documentation and support
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold">Knowledge base</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse guides and tutorials
            </p>
            <Button variant="outline" className="mt-4" size="sm">
              Browse
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Video className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold">Tutorial videos</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Watch step-by-step guides
            </p>
            <Button variant="outline" className="mt-4" size="sm">
              Watch
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <Mail className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="font-semibold">Contact support</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get help from our team
            </p>
            <Button variant="outline" className="mt-4" size="sm">
              Contact
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
