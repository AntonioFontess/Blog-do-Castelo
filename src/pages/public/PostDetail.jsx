import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Lightbox } from '../../components/ui/Lightbox';
import { MarkdownContent } from '../../components/MarkdownContent';
import { getPostBySlug, listPostImages } from '../../lib/posts';
import { categoryLabel, formatDate } from '../../lib/utils';
import { useDocumentMeta } from '../../lib/seo';

export function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 'not-found' | 'error' | null
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // SEO/OG dinâmico — usa o post depois que ele carrega.
  useDocumentMeta({
    title: post?.title,
    description: post?.content
      ? post.content
          .replace(/[#*_>`\-\[\]\(\)!]/g, '')
          .trim()
          .slice(0, 160)
      : undefined,
    image: post?.cover_image,
    type: 'article',
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const p = await getPostBySlug(slug);
        if (cancelled) return;
        if (!p) {
          setError('not-found');
          return;
        }
        const imgs = await listPostImages(p.id);
        if (cancelled) return;
        setPost(p);
        setImages(imgs);
      } catch (err) {
        if (!cancelled) setError('error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container-narrow py-16">
        <div className="aspect-[16/9] animate-pulse rounded-2xl bg-surface-hover" />
        <div className="mt-8 space-y-3">
          <div className="h-4 w-1/4 animate-pulse rounded bg-surface-hover" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-surface-hover" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-hover" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-hover" />
        </div>
      </div>
    );
  }

  if (error === 'not-found') {
    return (
      <section className="container-narrow py-24 text-center">
        <p className="font-serif text-7xl font-semibold text-primary">404</p>
        <h1 className="mt-4 font-serif text-3xl font-semibold text-fg">Post não encontrado</h1>
        <p className="mt-3 text-muted">O endereço pode estar errado, ou o post foi removido.</p>
        <Link
          to="/blog"
          className="mt-8 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background hover:bg-primary-hover"
        >
          Voltar para o blog
        </Link>
      </section>
    );
  }

  if (error === 'error') {
    return (
      <section className="container-narrow py-24">
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center text-red-200">
          Não foi possível carregar este post.
        </div>
      </section>
    );
  }

  return (
    <>
      <article className="relative -mb-24 flex flex-1 flex-col overflow-hidden">
        {/* Backdrop borrado cobrindo todo o artigo (até logo antes do footer) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt=""
              className="absolute inset-0 h-full w-full scale-110 object-cover object-center blur-[10px]"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-surface to-background" />
          )}
          <div className="absolute inset-0 bg-background/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent" />
        </div>

        <div className="container-narrow relative py-16 sm:py-24">
          <div className="rounded-2xl border border-outline bg-surface p-6 sm:p-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              ← Voltar para o blog
            </Link>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Badge>{categoryLabel(post.category)}</Badge>
              <span className="text-xs uppercase tracking-[0.18em] text-muted">
                {formatDate(post.created_at)}
              </span>
              {!post.published && (
                <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-200">
                  Rascunho
                </span>
              )}
            </div>

            <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight text-fg sm:text-5xl">
              {post.title}
            </h1>

            <div className="mt-8">
              <MarkdownContent>{post.content}</MarkdownContent>
            </div>
          </div>

          {/* Galeria */}
          {images.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl font-semibold text-fg sm:text-3xl">
                Galeria
              </h2>
              <p className="mt-1 text-sm text-muted">
                {images.length} {images.length === 1 ? 'imagem' : 'imagens'} · clique para ampliar
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className="group overflow-hidden rounded-lg border border-outline bg-surface transition-colors hover:border-primary/40"
                  >
                    <img
                      src={img.image_url}
                      alt={`Imagem ${i + 1} de ${post.title}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 pb-4 text-center">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-primary"
            >
              ← Ver todas as atividades
            </Link>
          </div>
        </div>
      </article>

      {lightboxIndex !== null && (
        <Lightbox
          images={images.map((i) => i.image_url)}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          captionFor={(i) => `${post.title} — imagem ${i + 1}`}
        />
      )}
    </>
  );
}
