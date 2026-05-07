import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { CoverImageUploader } from '../../components/admin/CoverImageUploader';
import { GalleryUploader } from '../../components/admin/GalleryUploader';
import { MarkdownEditor } from '../../components/admin/MarkdownEditor';
import {
  createPost,
  updatePost,
  getPostById,
  listPostImages,
} from '../../lib/posts';
import { CATEGORIES, categoryLabel, slugify } from '../../lib/utils';

const EMPTY_FORM = {
  title: '',
  slug: '',
  content: '',
  category: 'reuniao',
  published: true,
  publishedDate: '',
};

// Data de hoje no formato YYYY-MM-DD (horário local), pra usar em <input type="date">.
function todayInputValue() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Converte timestamp ISO do Supabase para YYYY-MM-DD em horário local.
function isoToInputDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Converte YYYY-MM-DD do input para ISO ao meio-dia local (evita "voltar um dia" por TZ).
function inputDateToIso(value) {
  if (!value) return null;
  return new Date(`${value}T12:00:00`).toISOString();
}

export function PostForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const toast = useToast();

  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    publishedDate: todayInputValue(),
  }));
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // Capa
  const [existingCoverUrl, setExistingCoverUrl] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  // Galeria
  const [existingGallery, setExistingGallery] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]);
  const [removedGalleryIds, setRemovedGalleryIds] = useState([]);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // Carrega dados quando estiver editando
  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [post, images] = await Promise.all([
          getPostById(id),
          listPostImages(id),
        ]);
        if (cancelled) return;
        if (!post) {
          setLoadError('Post não encontrado.');
          return;
        }
        setForm({
          title: post.title,
          slug: post.slug,
          content: post.content,
          category: post.category,
          published: post.published,
          publishedDate: isoToInputDate(post.created_at),
        });
        setSlugManuallyEdited(true); // ao editar, não regenerar slug a partir do título
        setExistingCoverUrl(post.cover_image ?? null);
        setExistingGallery(images);
      } catch (err) {
        if (!cancelled) setLoadError('Erro ao carregar o post.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  const handleTitleChange = (newTitle) => {
    setForm((f) => ({
      ...f,
      title: newTitle,
      slug: slugManuallyEdited ? f.slug : slugify(newTitle),
    }));
  };

  const handleSlugChange = (newSlug) => {
    setSlugManuallyEdited(true);
    setForm((f) => ({ ...f, slug: slugify(newSlug) }));
  };

  const isValid =
    form.title.trim() &&
    form.slug.trim() &&
    form.content.trim() &&
    form.category &&
    form.publishedDate;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const basePost = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        content: form.content,
        category: form.category,
        published: form.published,
        created_at: inputDateToIso(form.publishedDate),
      };
      if (isEdit) {
        await updatePost({
          id,
          post: basePost,
          coverFile,
          existingCoverUrl,
          galleryFiles: newGalleryFiles,
          removedGalleryItems: existingGallery.filter((g) =>
            removedGalleryIds.includes(g.id)
          ),
        });
        toast.success('Post atualizado.');
      } else {
        await createPost({
          post: basePost,
          coverFile,
          galleryFiles: newGalleryFiles,
        });
        toast.success('Post criado.');
      }
      navigate('/admin/posts');
    } catch (err) {
      const msg = String(err?.message ?? '').toLowerCase();
      if (msg.includes('duplicate') || msg.includes('unique')) {
        toast.error('Já existe um post com esse slug. Escolha outro.');
      } else {
        toast.error('Erro ao salvar o post. Tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="h-8 w-1/3 animate-pulse rounded bg-surface-hover" />
        <div className="mt-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded bg-surface-hover" />
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
        {loadError}
        <div className="mt-4">
          <Link to="/admin/posts" className="text-sm underline hover:text-red-100">
            ← Voltar para a lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/admin/posts"
            className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary"
          >
            ← Voltar
          </Link>
          <h1 className="mt-1 font-serif text-3xl font-semibold text-fg">
            {isEdit ? 'Editar post' : 'Novo post'}
          </h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/posts"
            className="rounded-lg border border-outline bg-transparent px-4 py-2.5 text-sm font-medium text-fg hover:bg-surface-hover"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={!isValid || submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && (
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            )}
            {isEdit ? 'Salvar alterações' : 'Criar post'}
          </button>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-outline bg-surface p-6 sm:p-8">
        {/* Título e slug */}
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm text-muted">Título</span>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Cerimônia de Instalação"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">
              Slug{' '}
              <span className="text-xs text-muted/70">
                (URL: /blog/{form.slug || 'meu-post'})
              </span>
            </span>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 font-mono text-sm text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="cerimonia-de-instalacao"
            />
          </label>
        </div>

        {/* Categoria, data, publicado */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="text-sm text-muted">Categoria</span>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel(c)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm text-muted">Data de publicação</span>
            <input
              type="date"
              required
              value={form.publishedDate}
              onChange={(e) => setForm((f) => ({ ...f, publishedDate: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-outline bg-background px-3 py-2.5 text-fg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>

          <label className="flex items-center gap-3 self-end rounded-lg border border-outline bg-background px-3 py-2.5">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
              className="h-4 w-4 accent-primary"
            />
            <div>
              <p className="text-sm font-medium text-fg">Publicado</p>
              <p className="text-xs text-muted">Quando desmarcado, fica como rascunho.</p>
            </div>
          </label>
        </div>

        {/* Capa */}
        <CoverImageUploader
          existingUrl={existingCoverUrl}
          file={coverFile}
          onFileChange={(f) => {
            setCoverFile(f);
            if (!f) setExistingCoverUrl(null);
          }}
        />

        {/* Conteúdo */}
        <MarkdownEditor
          label="Conteúdo (Markdown)"
          value={form.content}
          onChange={(v) => setForm((f) => ({ ...f, content: v }))}
        />

        {/* Galeria */}
        <GalleryUploader
          existing={existingGallery}
          newFiles={newGalleryFiles}
          removedExistingIds={removedGalleryIds}
          onChange={({ newFiles, removedExistingIds }) => {
            setNewGalleryFiles(newFiles);
            setRemovedGalleryIds(removedExistingIds);
          }}
        />
      </div>
    </form>
  );
}
