import * as React from 'react'
import { cn } from '@/lib/utils'

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null)

interface DropdownMenuProps {
  children: React.ReactNode
}

function DropdownMenu({ children }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      const content = document.querySelector('[data-dropdown-content]')
      if (content?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <DropdownMenuContext.Provider value={{ open, setOpen, triggerRef }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

function useDropdownMenu() {
  const ctx = React.useContext(DropdownMenuContext)
  if (!ctx) throw new Error('DropdownMenu components must be used within DropdownMenu')
  return ctx
}

interface DropdownMenuTriggerProps {
  asChild?: boolean
  children: React.ReactNode
  className?: string
}

function DropdownMenuTrigger({ asChild, children, className }: DropdownMenuTriggerProps) {
  const { open, setOpen, triggerRef } = useDropdownMenu()

  const handleClick = () => setOpen(!open)

  const triggerProps = {
    'aria-haspopup': 'menu' as const,
    'aria-expanded': open,
  }

  const childProps = asChild && React.isValidElement(children)
    ? (children as React.ReactElement<{
        ref?: React.Ref<HTMLButtonElement>
        onClick?: (e: React.MouseEvent) => void
        className?: string
        'aria-haspopup'?: string
        'aria-expanded'?: boolean
      }>).props
    : null

  const mergedRefCallback = React.useCallback(
    (el: HTMLButtonElement | null) => {
      ;(triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = el
      const childRef = childProps?.ref
      if (typeof childRef === 'function') {
        childRef(el)
      } else if (childRef != null) {
        /* eslint-disable-next-line react-hooks/immutability -- ref.current is designed to be mutable */
        ;(childRef as React.MutableRefObject<HTMLButtonElement | null>).current = el
      }
    },
    [triggerRef, childProps?.ref]
  )

  if (asChild && React.isValidElement(children) && childProps) {
    return React.cloneElement(
      children as React.ReactElement<{
        ref?: React.Ref<HTMLButtonElement>
        onClick?: (e: React.MouseEvent) => void
        className?: string
        'aria-haspopup'?: string
        'aria-expanded'?: boolean
      }>,
      {
        ref: mergedRefCallback,
        onClick: handleClick,
        className: cn(className, childProps.className),
        ...triggerProps,
      }
    )
  }

  return (
    <button
      ref={triggerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onClick={handleClick}
      className={cn(className)}
      {...triggerProps}
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, align = 'end', sideOffset = 4, children, ...props }, ref) => {
    const { open } = useDropdownMenu()

    if (!open) return null

    return (
      <div
        ref={ref}
        data-dropdown-content
        role="menu"
        className={cn(
          'absolute z-50 min-w-[8rem] overflow-hidden rounded-lg border border-border bg-card p-1',
          'shadow-[0_2px_8px_rgb(var(--overlay)/0.15)]',
          'animate-in fade-in duration-200',
          align === 'end' && 'right-0',
          align === 'start' && 'left-0',
          align === 'center' && 'left-1/2 -translate-x-1/2',
          className
        )}
        style={{ top: `calc(100% + ${sideOffset}px)` }}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuContent.displayName = 'DropdownMenuContent'

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: () => void
  disabled?: boolean
}

const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, onSelect, disabled, children, onClick, ...props }, ref) => {
    const { setOpen } = useDropdownMenu()

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return
      onClick?.(e)
      onSelect?.()
      setOpen(false)
    }

    return (
      <div
        ref={ref}
        role="menuitem"
        tabIndex={-1}
        className={cn(
          'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none',
          'hover:bg-secondary focus:bg-secondary',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </div>
    )
  }
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

const DropdownMenuSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
)

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
}
