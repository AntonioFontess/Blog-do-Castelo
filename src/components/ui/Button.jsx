import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const VARIANT_CLASSES = {
  primary:
    'bg-primary text-background hover:bg-primary-hover focus-visible:ring-primary',
  secondary:
    'bg-secondary text-fg hover:bg-secondary/80 focus-visible:ring-secondary',
  outline:
    'border border-outline bg-transparent text-fg hover:bg-surface-hover focus-visible:ring-primary',
  ghost: 'bg-transparent text-fg hover:bg-surface-hover focus-visible:ring-primary',
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';

export function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  className,
  children,
  ...props
}) {
  const classes = cn(baseClasses, VARIANT_CLASSES[variant], SIZE_CLASSES[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
