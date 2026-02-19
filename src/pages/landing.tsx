import { Link } from 'react-router-dom'
import { FileStack, Search, Calendar, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const features = [
  {
    icon: FileStack,
    title: 'File Library',
    description: 'Central asset repository with versioning, tags, and fast CDN delivery.',
  },
  {
    icon: Search,
    title: 'OpenClaw Research',
    description: 'AI-powered web research with captured sources and provenance.',
  },
  {
    icon: Calendar,
    title: 'Publishing Planner',
    description: 'Editorial calendar with Kanban pipeline and multi-channel scheduling.',
  },
  {
    icon: Mail,
    title: 'Gmail & Calendar',
    description: 'Surface briefs and deadlines from Google inside your workflow.',
  },
]

export function LandingPage() {
  return (
    <div className="animate-in-up">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-card/50 to-transparent" />
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            AI-assisted creator workspace
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            One workspace for{' '}
            <span className="bg-gradient-to-r from-[#5A5A5A] to-[#A0A0A0] bg-clip-text text-transparent">
              research to publish
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Consolidate assets, drafts, calendar events, and Gmail briefs. Run web research with
            OpenClaw, generate content with provenance, and schedule multi-channel publishing.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[180px]">
              <Link to="/signup">Get started free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="min-w-[180px]">
              <Link to="/login">Log in</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value props - Bento grid */}
      <section className="border-t border-border px-4 py-24">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Everything you need to create
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }, i) => (
              <Card
                key={title}
                className="animate-in-up transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-24">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to streamline your workflow?</h2>
          <p className="mb-8 text-muted-foreground">
            Join creators who ship faster with traceable research and unified planning.
          </p>
          <Button asChild size="lg">
            <Link to="/signup">Start free trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="text-sm text-muted-foreground">© CreatorOps Hub</span>
          <nav className="flex gap-6 text-sm">
            <Link to="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/help" className="text-muted-foreground hover:text-foreground">
              Help
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
