import { cn } from '../utils/cn'

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="w-10 h-10 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  )
}
