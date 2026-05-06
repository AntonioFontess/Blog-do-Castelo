import { cn } from '../../lib/utils';

export function Container({ size = 'wide', className, children }) {
  return (
    <div className={cn(size === 'narrow' ? 'container-narrow' : 'container-wide', className)}>
      {children}
    </div>
  );
}
