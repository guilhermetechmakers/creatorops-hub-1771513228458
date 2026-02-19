import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'accent' | 'success' | 'warning'
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-primary/20 text-primary': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'border border-border bg-transparent': variant === 'outline',
          'bg-accent/20 text-accent': variant === 'accent',
          'bg-green-500/20 text-green-600 dark:text-green-400': variant === 'success',
          'bg-amber-500/20 text-amber-600 dark:text-amber-400': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  )
)
Badge.displayName = 'Badge'

export { Badge }
