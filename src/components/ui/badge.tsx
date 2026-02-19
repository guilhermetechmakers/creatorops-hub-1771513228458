import * as React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Badge variants using design system tokens (CSS variables).
 * All colors map to --primary, --secondary, --accent, --destructive, --success, --warning, --muted, --border.
 */
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'destructive'
  | 'ghost'
  | 'accent'
  | 'success'
  | 'warning'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  /** Show loading spinner; use for async status badges (e.g. "Deleting...") */
  isLoading?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary/20 text-primary',
  secondary: 'bg-secondary text-secondary-foreground',
  outline: 'border border-border bg-transparent text-foreground',
  destructive: 'bg-destructive/20 text-destructive',
  ghost: 'bg-transparent text-muted-foreground hover:bg-secondary/50',
  accent: 'bg-accent/20 text-accent',
  success: 'bg-success/20 text-success',
  warning: 'bg-warning/20 text-warning',
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    { className, variant = 'default', isLoading = false, children, ...props },
    ref
  ) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2
            className="h-3 w-3 shrink-0 animate-spin"
            aria-hidden="true"
          />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </span>
  )
)
Badge.displayName = 'Badge'

export { Badge }
