import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface InvoiceHistoryLinkProps {
  to?: string
  label?: string
}

export function InvoiceHistoryLink({ to = '/dashboard/profile', label = 'Invoice history' }: InvoiceHistoryLinkProps) {
  return (
    <Button asChild variant="outline" className="w-full transition-all duration-300 hover:scale-[1.02]">
      <Link to={to} className="flex items-center justify-center gap-2">
        <FileText className="h-4 w-4" aria-hidden />
        {label}
      </Link>
    </Button>
  )
}
