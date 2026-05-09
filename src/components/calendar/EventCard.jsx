import { Card } from '../ui/Card';
import { formatDate, formatTime, parseLocalDate } from '../../lib/utils';

export function EventCard({ event }) {
  const date = parseLocalDate(event.date);
  const day = date ? date.toLocaleDateString('pt-BR', { day: '2-digit' }) : '--';
  const month = date
    ? date
        .toLocaleDateString('pt-BR', { month: 'short' })
        .replace('.', '')
        .toUpperCase()
    : '';

  return (
    <Card className="flex items-stretch gap-4 p-5">
      <div className="flex w-16 flex-col items-center justify-center rounded-lg border border-outline bg-background py-2 text-center">
        <span className="font-serif text-2xl font-semibold text-primary leading-none">{day}</span>
        <span className="mt-1 text-[10px] tracking-widest text-muted">{month}</span>
      </div>
      <div className="flex-1">
        <h3 className="font-serif text-xl font-semibold text-fg">{event.name}</h3>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
          {formatDate(event.date)}
          {event.time ? ` · ${formatTime(event.time)}` : ''}
        </p>
        {event.description && (
          <p className="mt-2 text-[15px] leading-relaxed text-fg/85 line-clamp-2">
            {event.description}
          </p>
        )}
      </div>
    </Card>
  );
}
