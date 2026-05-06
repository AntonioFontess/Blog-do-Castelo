import { useEffect } from 'react';
import { SITE_NAME, SITE_DESCRIPTION } from './constants';

// Cache do og:image padrão pra ficar absoluto (Vite dá relativo /logo.png).
function absoluteUrl(maybeRelative) {
  if (!maybeRelative) return undefined;
  if (/^https?:/i.test(maybeRelative)) return maybeRelative;
  if (typeof window !== 'undefined') {
    return new URL(maybeRelative, window.location.origin).toString();
  }
  return maybeRelative;
}

function setMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs.create ?? {}).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  if (attrs.content !== undefined) {
    el.setAttribute('content', attrs.content ?? '');
  }
}

// Atualiza document.title + meta description + Open Graph básico de forma
// declarativa. Cada página chama esse hook com o que faz sentido pra ela.
//
// type: 'website' (padrão) | 'article' (para posts individuais)
export function useDocumentMeta({ title, description, image, type = 'website', url } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
    const desc = description ?? SITE_DESCRIPTION;
    const og = {
      title: title ?? SITE_NAME,
      description: desc,
      image: absoluteUrl(image ?? '/logo.png'),
      type,
      url: url ?? (typeof window !== 'undefined' ? window.location.href : undefined),
    };

    document.title = fullTitle;

    setMeta('meta[name="description"]', {
      create: { name: 'description' },
      content: desc,
    });
    setMeta('meta[property="og:title"]', {
      create: { property: 'og:title' },
      content: og.title,
    });
    setMeta('meta[property="og:description"]', {
      create: { property: 'og:description' },
      content: og.description,
    });
    setMeta('meta[property="og:image"]', {
      create: { property: 'og:image' },
      content: og.image,
    });
    setMeta('meta[property="og:type"]', {
      create: { property: 'og:type' },
      content: og.type,
    });
    if (og.url) {
      setMeta('meta[property="og:url"]', {
        create: { property: 'og:url' },
        content: og.url,
      });
    }
    // Twitter card aproveita as mesmas infos
    setMeta('meta[name="twitter:card"]', {
      create: { name: 'twitter:card' },
      content: 'summary_large_image',
    });
  }, [title, description, image, type, url]);
}
