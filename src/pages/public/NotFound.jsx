import { Button } from '../../components/ui/Button';
import { useDocumentMeta } from '../../lib/seo';

export function NotFound() {
  useDocumentMeta({ title: 'Página não encontrada' });
  return (
    <section className="container-narrow py-24 text-center">
      <p className="font-serif text-7xl font-semibold text-primary">404</p>
      <h1 className="mt-4 font-serif text-3xl font-semibold text-fg">Página não encontrada</h1>
      <p className="mt-4 text-muted">
        O endereço que você buscou não existe ou foi movido.
      </p>
      <div className="mt-8">
        <Button to="/">Voltar para o início</Button>
      </div>
    </section>
  );
}
