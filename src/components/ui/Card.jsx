import { cn } from '../../lib/utils';

export function Card({ as: Component = 'div', className, children, ...props }) {
  return (
    <Component
      className={cn(
        'rounded-xl border border-outline bg-surface transition-all duration-200 hover:border-primary/30 hover:bg-surface-hover',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
