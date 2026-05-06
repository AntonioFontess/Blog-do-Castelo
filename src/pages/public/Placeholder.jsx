import { Button } from '../../components/ui/Button';

export function Placeholder({ title, description, phase }) {
  return (
    <section className="container-narrow py-24 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-primary">{phase}</p>
      <h1 className="mt-4 font-serif text-4xl font-semibold text-fg sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-xl text-lg text-muted">{description}</p>
      <div className="mt-8 inline-flex gap-3">
        <Button to="/" variant="outline">
          Voltar para o início
        </Button>
      </div>
    </section>
  );
}
