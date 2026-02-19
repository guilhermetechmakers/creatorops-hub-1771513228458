import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface IntegrationStubCardProps {
  title: string
  description: string
  icon: ReactNode
  className?: string
}

export function IntegrationStubCard({
  title,
  description,
  icon,
  className,
}: IntegrationStubCardProps) {
  return (
    <Card
      className={cn(
        'animate-in-up transition-all duration-300 hover:shadow-card-hover opacity-90',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="shrink-0">
            Coming soon
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This integration will be available in a future update. Check back later.
        </p>
      </CardContent>
    </Card>
  )
}
