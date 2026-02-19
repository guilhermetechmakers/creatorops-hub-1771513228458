import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsContextValue {
  value: string
  onValueChange: (value: string) => void
  baseId: string
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

interface TabsProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

function Tabs({ value, defaultValue = '', onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue
  const baseId = React.useId()

  const handleChange = React.useCallback(
    (v: string) => {
      if (!isControlled) setInternalValue(v)
      onValueChange?.(v)
    },
    [isControlled, onValueChange]
  )

  return (
    <TabsContext.Provider
      value={{ value: currentValue, onValueChange: handleChange, baseId }}
    >
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  )
}

function useTabs() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within Tabs')
  return ctx
}

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    role="tablist"
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1',
      'border border-border',
      className
    )}
    {...props}
  />
))
TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  /** Accessible label for screen readers. Required when trigger content is icon-only or not descriptive. */
  'aria-label'?: string
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, 'aria-label': ariaLabel, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange, baseId } = useTabs()
    const isSelected = selectedValue === value
    const triggerId = `${baseId}-trigger-${value}`
    const panelId = `${baseId}-panel-${value}`

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={triggerId}
        aria-selected={isSelected}
        aria-controls={panelId}
        aria-label={ariaLabel}
        tabIndex={isSelected ? 0 : -1}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium',
          'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'hover:scale-[1.02] active:scale-[0.98]',
          isSelected
            ? 'bg-background text-foreground shadow-card border border-border'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
          className
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        {children}
      </button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    const { value: selectedValue, baseId } = useTabs()
    if (selectedValue !== value) return null

    const triggerId = `${baseId}-trigger-${value}`
    const panelId = `${baseId}-panel-${value}`

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={triggerId}
        tabIndex={0}
        className={cn('mt-4 animate-in fade-in duration-200', className)}
        {...props}
      />
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsList, TabsTrigger, TabsContent }
