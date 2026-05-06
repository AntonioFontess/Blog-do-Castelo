import { Button } from '../../components/ui/Button';
import { useDocumentMeta } from '../../lib/seo';

const VALUES = [
  {
    title: 'Amor Filial',
    desc: 'Respeito e gratidão àqueles que nos guiam.',
  },
  {
    title: 'Reverência',
    desc: 'Pelas coisas sagradas, pela vida e pelo próximo.',
  },
  {
    title: 'Cortesia',
    desc: 'Modos gentis em todas as relações.',
  },
  {
    title: 'Companheirismo',
    desc: 'Lealdade entre os irmãos do Castelo.',
  },
  {
    title: 'Fidelidade',
    desc: 'Compromisso com a palavra dada.',
  },
  {
    title: 'Pureza',
    desc: 'Integridade no pensar, falar e agir.',
  },
  {
    title: 'Patriotismo',
    desc: 'Amor pelo Brasil e pela comunidade.',
  },
];

export function Sobre() {
  useDocumentMeta({
    title: 'Sobre',
    description:
      'Conheça a Ordem DeMolay, o Castelo de Escudeiros e as Sete Virtudes Cardeais que guiam o Castelo Hernani Vallim Nº 123 em Cornélio Procópio-PR.',
  });

  return (
    <>
      <section className="container-wide pt-16 pb-10">
        <div className="mx-auto max-w-3xl text-center animate-fade-in">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Sobre nós</p>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-fg sm:text-5xl">
            Tradição que forma jovens líderes
          </h1>
          <p className="mt-5 text-lg text-muted">
            Conheça a Ordem DeMolay, o Castelo de Escudeiros e os valores que guiam o
            Castelo Hernani Vallim Nº 123.
          </p>
        </div>
      </section>

      <section className="container-narrow grid gap-10 py-10 md:grid-cols-2 md:gap-14">
        <article className="rounded-xl border border-outline bg-surface p-7">
          <h2 className="font-serif text-2xl font-semibold text-fg">A Ordem DeMolay</h2>
          <p className="mt-4 text-base text-muted">
            A Ordem DeMolay é uma organização internacional voltada à formação de jovens
            do sexo masculino, entre 12 e 21 anos. Por meio de cerimônias, atividades de
            liderança, ações filantrópicas e momentos de fraternidade, ela inspira seus
            membros a se tornarem cidadãos íntegros, líderes e profundamente comprometidos
            com a comunidade.
          </p>
        </article>

        <article className="rounded-xl border border-outline bg-surface p-7">
          <h2 className="font-serif text-2xl font-semibold text-fg">
            O Castelo de Escudeiros
          </h2>
          <p className="mt-4 text-base text-muted">
            O Castelo é uma unidade preparatória da Ordem DeMolay, dedicada a crianças e
            pré-adolescentes de 7 a 11 anos completos. É onde os Escudeiros vivem suas
            primeiras experiências de liderança, fazem amigos para a vida e participam de
            atividades que combinam diversão, aprendizado e cidadania.
          </p>
        </article>
      </section>

      <section className="container-wide py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-primary">Pilares</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold text-fg sm:text-4xl">
            As Sete Virtudes Cardeais
          </h2>
          <p className="mt-4 text-muted">
            São os valores que orientam a conduta de todo Escudeiro e DeMolay.
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <li
              key={v.title}
              className="rounded-xl border border-outline bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-surface-hover"
            >
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-xl text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-serif text-lg font-semibold text-fg">{v.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted">{v.desc}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-wide py-12">
        <div className="overflow-hidden rounded-2xl border border-outline bg-surface">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="p-8 md:p-12">
              <p className="text-xs uppercase tracking-[0.28em] text-primary">
                Castelo Hernani Vallim
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-fg">
                Tradição, fraternidade e juventude em Cornélio Procópio
              </h2>
              <p className="mt-4 text-muted">
                Nosso Castelo carrega o nome de Hernani Vallim como homenagem viva à
                trajetória DeMolay no Paraná. Aqui, cada novo Escudeiro encontra um
                ambiente seguro, valores sólidos e oportunidades reais de protagonismo.
              </p>
              <div className="mt-6">
                <Button to="/contato">Quero conhecer o Castelo</Button>
              </div>
            </div>
            <div className="relative flex items-center justify-center bg-gradient-to-br from-secondary/30 via-surface to-background p-10">
              <img
                src="/logo.png"
                alt="Brasão do Castelo Hernani Vallim"
                className="h-56 w-56 object-contain drop-shadow-[0_8px_30px_rgba(201,162,39,0.25)]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
