import { useState } from 'react';
import { MarkdownContent } from '../MarkdownContent';
import { cn } from '../../lib/utils';

const MD_HELP = `Use Markdown para formatar:
**negrito**, *itálico*, [link](https://...), # Título, ## Subtítulo,
- listas, > citações, \`código\`. Linha em branco separa parágrafos.`;

export function MarkdownEditor({ value, onChange, rows = 18, label = 'Conteúdo' }) {
  const [tab, setTab] = useState('edit');

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-muted">{label}</span>
        <div className="inline-flex rounded-lg border border-outline bg-background p-0.5">
          <button
            type="button"
            onClick={() => setTab('edit')}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
              tab === 'edit' ? 'bg-surface-hover text-fg' : 'text-muted hover:text-fg'
            )}
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => setTab('preview')}
            className={cn(
              'rounded-md px-3 py-1 text-xs font-medium transition-colors',
              tab === 'preview' ? 'bg-surface-hover text-fg' : 'text-muted hover:text-fg'
            )}
          >
            Preview
          </button>
        </div>
      </div>

      {tab === 'edit' ? (
        <>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="w-full resize-y rounded-lg border border-outline bg-background px-3 py-3 font-mono text-sm leading-relaxed text-fg placeholder-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="# Título do post

Escreva aqui em Markdown..."
            spellCheck={true}
          />
          <p className="mt-2 whitespace-pre-line text-xs text-muted">{MD_HELP}</p>
        </>
      ) : (
        <div className="rounded-lg border border-outline bg-background p-5 min-h-[300px]">
          {value?.trim() ? (
            <MarkdownContent>{value}</MarkdownContent>
          ) : (
            <p className="text-sm text-muted italic">Nada pra mostrar ainda.</p>
          )}
        </div>
      )}
    </div>
  );
}
