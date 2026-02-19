import { Link } from 'react-router-dom'
import {
  FileStack,
  Search,
  Calendar,
  Mail,
  Sparkles,
  Play,
  Check,
  Quote,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useDocumentMeta } from '@/hooks/use-document-meta'
import { useUtmCapture } from '@/hooks/use-utm-capture'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { cn } from '@/lib/utils'

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

const featureDeepDives = [
  {
    title: 'File Library',
    subtitle: 'One place for all your assets',
    description:
      'Upload, version, and organize files with smart tagging. Fast CDN delivery ensures your team always has the latest assets. No more hunting through folders.',
    features: ['Version history', 'Smart tags', 'CDN delivery', 'Bulk upload'],
  },
  {
    title: 'OpenClaw Research',
    subtitle: 'Research with provenance',
    description:
      'AI-powered web research that captures sources and citations. Every claim is traceable. Build content you can trust with full provenance.',
    features: ['Source capture', 'Citation tracking', 'AI summarization', 'Export to content'],
  },
  {
    title: 'Publishing Planner',
    subtitle: 'Multi-channel scheduling',
    description:
      'Editorial calendar meets Kanban. Plan content across channels, track deadlines, and never miss a publish. Drag-and-drop simplicity.',
    features: ['Kanban pipeline', 'Multi-channel', 'Deadline alerts', 'Content calendar'],
  },
  {
    title: 'Google Integrations',
    subtitle: 'Gmail & Calendar in your flow',
    description:
      'Surface Gmail briefs and Calendar events where you work. No context switching. Briefs and deadlines appear in your dashboard.',
    features: ['Gmail briefs', 'Calendar sync', 'Deadline surfacing', 'Single sign-on'],
  },
]

const plans = [
  { name: 'Starter', price: 19, features: ['5 projects', '1GB storage', 'Basic research'] },
  {
    name: 'Pro',
    price: 49,
    features: ['Unlimited projects', '10GB storage', 'Full OpenClaw', 'Priority support'],
    recommended: true,
  },
  {
    name: 'Team',
    price: 99,
    features: ['Everything in Pro', 'Team seats', 'Shared library', 'Admin controls'],
  },
]

const testimonials = [
  {
    quote:
      'CreatorOps Hub cut our research-to-publish time in half. The provenance tracking alone is worth it.',
    author: 'Sarah Chen',
    role: 'Content Lead, Tech Startup',
  },
  {
    quote:
      'Finally, one place for assets, research, and scheduling. The Google integration is seamless.',
    author: 'Marcus Johnson',
    role: 'Independent Creator',
  },
  {
    quote:
      'OpenClaw research with source capture changed how we produce content. No more broken links.',
    author: 'Elena Rodriguez',
    role: 'Editor, Media Co',
  },
]

function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, isVisible } = useScrollReveal()
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-500',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function LandingPage() {
  useDocumentMeta({
    title: 'CreatorOps Hub - Research to Publish',
    description:
      'One workspace for research to publish. File Library, OpenClaw research, Publishing Planner, and Google integrations. Consolidate assets, drafts, and schedule multi-channel publishing.',
  })
  useUtmCapture()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative overflow-hidden px-4 py-24 md:py-32 lg:py-40"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-card/80 via-background to-background" />
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 h-[600px] w-[600px] animate-blob-pulse rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 h-[400px] w-[400px] animate-float rounded-full bg-accent/5 blur-3xl" />
        </div>
        <div className="container mx-auto max-w-6xl text-center">
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground"
            role="status"
          >
            <Sparkles className="h-4 w-4 text-accent" aria-hidden />
            AI-assisted creator workspace
          </div>
          <h1
            id="hero-heading"
            className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            One workspace for{' '}
            <span className="bg-gradient-to-r from-[rgb(var(--gradient-start))] to-[rgb(var(--gradient-end))] bg-clip-text text-transparent">
              research to publish
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Consolidate assets, drafts, calendar events, and Gmail briefs. Run web research with
            OpenClaw, generate content with provenance, and schedule multi-channel publishing.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="min-w-[180px] bg-gradient-to-r from-primary to-primary/80 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <Link to="/signup">Get started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[180px] transition-all duration-300 hover:scale-[1.02]"
            >
              <Link to="#watch-demo" className="flex items-center gap-2">
                <Play className="h-5 w-5" aria-hidden />
                Watch demo
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value props - Bento grid */}
      <section className="border-t border-border px-4 py-24" aria-labelledby="value-props-heading">
        <div className="container mx-auto max-w-6xl">
          <h2
            id="value-props-heading"
            className="mb-12 text-center text-3xl font-bold md:text-4xl"
          >
            Everything you need to create
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }, i) => (
              <SectionReveal key={title} delay={i * 100}>
                <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                      <Icon className="h-6 w-6 text-muted-foreground" aria-hidden />
                    </div>
                    <h3 className="mb-2 font-semibold">{title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Feature deep-dive sections */}
      <section className="border-t border-border px-4 py-24" aria-labelledby="features-heading">
        <div className="container mx-auto max-w-6xl">
          <h2 id="features-heading" className="mb-16 text-center text-3xl font-bold md:text-4xl">
            Built for creator workflows
          </h2>
          <div className="space-y-24">
            {featureDeepDives.map((fd, i) => (
              <SectionReveal key={fd.title} delay={i * 50}>
                <div
                  className={cn(
                    'flex flex-col gap-8 lg:flex-row lg:items-center',
                    i % 2 === 1 && 'lg:flex-row-reverse'
                  )}
                >
                  <div className="flex-1">
                    <h3 className="mb-2 text-2xl font-bold md:text-3xl">{fd.title}</h3>
                    <p className="mb-4 text-muted-foreground">{fd.subtitle}</p>
                    <p className="mb-6 text-muted-foreground">{fd.description}</p>
                    <ul className="space-y-2">
                      {fd.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <div className="aspect-video rounded-2xl border border-border bg-card/50 p-8 flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <IconPlaceholder />
                        <span className="text-sm">Feature preview</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Watch demo anchor */}
      <section
        id="watch-demo"
        className="border-t border-border px-4 py-24"
        aria-labelledby="demo-heading"
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 id="demo-heading" className="mb-6 text-3xl font-bold">
            See it in action
          </h2>
          <div className="aspect-video rounded-2xl border border-border bg-card/50 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Play className="mx-auto mb-4 h-16 w-16" aria-hidden />
              <p>Demo video placeholder</p>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/signup">Start free trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="border-t border-border px-4 py-24" aria-labelledby="pricing-heading">
        <div className="container mx-auto max-w-6xl">
          <h2 id="pricing-heading" className="mb-4 text-center text-3xl font-bold md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  'transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover',
                  plan.recommended && 'border-accent ring-2 ring-accent/30'
                )}
              >
                <CardContent className="p-6">
                  {plan.recommended && (
                    <span className="mb-2 block text-xs font-medium text-accent">Recommended</span>
                  )}
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <div className="my-4">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/mo</span>
                  </div>
                  <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="w-full"
                    variant={plan.recommended ? 'default' : 'outline'}
                  >
                    <Link to="/signup">Get started</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="link" className="text-accent">
              <Link to="/checkout">
                View all plans & checkout
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border px-4 py-24" aria-labelledby="testimonials-heading">
        <div className="container mx-auto max-w-6xl">
          <h2 id="testimonials-heading" className="mb-12 text-center text-3xl font-bold md:text-4xl">
            Loved by creators
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.author} className="transition-all duration-300 hover:shadow-card-hover">
                <CardContent className="p-6">
                  <Quote className="mb-4 h-8 w-8 text-muted-foreground/50" aria-hidden />
                  <p className="mb-4 text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <p className="font-medium">{t.author}</p>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter signup */}
      <section className="border-t border-border px-4 py-24" aria-labelledby="newsletter-heading">
        <div className="container mx-auto max-w-xl text-center">
          <h2 id="newsletter-heading" className="mb-4 text-3xl font-bold">
            Stay in the loop
          </h2>
          <p className="mb-8 text-muted-foreground">
            Get product updates, tips, and creator workflows in your inbox.
          </p>
          <form
            className="flex flex-col gap-4 sm:flex-row sm:gap-2"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Newsletter signup"
          >
            <Input
              type="email"
              placeholder="you@example.com"
              className="flex-1"
              aria-label="Email address"
            />
            <Button type="submit" className="sm:shrink-0">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-12" role="contentinfo">
        <div className="container mx-auto flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link to="/" className="font-bold text-lg">
            CreatorOps Hub
          </Link>
          <nav className="flex flex-wrap justify-center gap-6 text-sm" aria-label="Footer navigation">
            <Link
              to="/about"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
            <Link
              to="/help"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Help
            </Link>
            <Link
              to="/privacy"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </Link>
          </nav>
          <span className="text-sm text-muted-foreground">© CreatorOps Hub</span>
        </div>
      </footer>
    </div>
  )
}

function IconPlaceholder() {
  return (
    <svg
      className="mx-auto h-16 w-16 text-muted-foreground/50"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
      />
    </svg>
  )
}
