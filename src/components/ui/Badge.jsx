import { cn } from '../../lib/utils';

const TONES = {
  primary: 'bg-primary/15 text-primary border-primary/30',
  secondary: 'bg-secondary/20 text-fg border-secondary/40',
  neutral: 'bg-surface-hover text-muted border-outline',
};

export function Badge({ tone = 'primary', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
