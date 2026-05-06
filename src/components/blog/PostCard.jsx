import { Link } from 'react-router-dom';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { categoryLabel, formatDate } from '../../lib/utils';

export function PostCard({ post }) {
  return (
    <Card as="article" className="group overflow-hidden">
      <Link to={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-hover">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted">
              <span className="text-4xl font-serif">CHV</span>
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge>{categoryLabel(post.category)}</Badge>
          </div>
        </div>
        <div className="space-y-2 p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">
            {formatDate(post.created_at)}
          </p>
          <h3 className="font-serif text-2xl font-semibold leading-tight text-fg group-hover:text-primary">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="line-clamp-3 text-[15px] leading-relaxed text-fg/85">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>
    </Card>
  );
}
