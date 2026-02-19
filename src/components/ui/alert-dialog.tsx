import * as React from 'react'
import { cn } from '@/lib/utils'

interface AlertDialogContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null)

interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalOpen(value)
      onOpenChange?.(value)
    },
    [isControlled, onOpenChange]
  )

  return (
    <AlertDialogContext.Provider value={{ open: isOpen, onOpenChange: setIsOpen }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

function useAlertDialog() {
  const ctx = React.useContext(AlertDialogContext)
  if (!ctx) throw new Error('AlertDialog components must be used within AlertDialog')
  return ctx
}

interface AlertDialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
  /** Required for icon-only triggers; use descriptive text for screen readers */
  'aria-label'?: string
}

function AlertDialogTrigger({
  asChild,
  children,
  'aria-label': ariaLabel,
  className,
  onClick: onUserClick,
  ...props
}: AlertDialogTriggerProps) {
  const { onOpenChange } = useAlertDialog()
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onUserClick?.(e)
    onOpenChange(true)
  }
  if (asChild && React.isValidElement(children)) {
    const childProps = (children as React.ReactElement<Record<string, unknown>>).props
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ...props,
      'aria-label': ariaLabel ?? childProps['aria-label'],
      onClick: (e: React.MouseEvent) => {
        const childOnClick = childProps.onClick as ((e: React.MouseEvent) => void) | undefined
        childOnClick?.(e)
        onOpenChange(true)
      },
    })
  }
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
      aria-label={ariaLabel}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
}

interface AlertDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onEscapeKeyDown?: (e: KeyboardEvent) => void
  onPointerDownOutside?: (e: Event) => void
}

const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ className, children, ...props }, ref) => {
    const { open, onOpenChange } = useAlertDialog()

    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onOpenChange(false)
      }
      if (open) {
        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
      }
    }, [open, onOpenChange])

    if (!open) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm"
          aria-hidden
          onClick={() => onOpenChange(false)}
        />
        <div
          ref={ref}
          role="alertdialog"
          className={cn(
            'relative z-50 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-card',
            'animate-in-up',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    )
  }
)
AlertDialogContent.displayName = 'AlertDialogContent'

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...props} />
)

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-2', className)}
    {...props}
  />
)

const AlertDialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn('text-lg font-semibold', className)} {...props} />
)

const AlertDialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-muted-foreground', className)} {...props} />
)

interface AlertDialogActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const AlertDialogAction = React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ className, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium',
        'bg-primary text-primary-foreground hover:bg-primary/90',
        'transition-colors duration-200',
        className
      )}
      onClick={onClick}
      {...props}
    />
  )
)
AlertDialogAction.displayName = 'AlertDialogAction'

const AlertDialogCancel = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, ...props }, ref) => {
  const { onOpenChange } = useAlertDialog()
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium',
        'hover:bg-secondary/50 transition-colors duration-200',
        className
      )}
      onClick={() => onOpenChange(false)}
      {...props}
    />
  )
})
AlertDialogCancel.displayName = 'AlertDialogCancel'

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
