// Componente "pesado" — carregado sob demanda via React.lazy em MarkdownContent.
// Tudo que importar diretamente daqui entra no chunk separado do react-markdown.

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ children, className = 'prose-castelo' }) {
  return (
    <article className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children ?? ''}</ReactMarkdown>
    </article>
  );
}
