import { Link } from 'react-router-dom';
import {
  WHATSAPP_LINK,
  INSTAGRAM_LINK,
  INSTAGRAM_HANDLE,
  MAPS_SEARCH_URL,
  ADDRESS,
} from '../../lib/constants';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-outline bg-surface">
      <div className="container-wide grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Brasão do Castelo Hernani Vallim Nº 123"
              className="h-12 w-12 rounded-md object-contain"
              loading="lazy"
            />
            <div className="leading-tight">
              <p className="font-serif text-lg font-semibold">Castelo Hernani Vallim</p>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Nº 123</p>
            </div>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Castelo de Escudeiros da Ordem DeMolay em Cornélio Procópio-PR. Liderança,
            fraternidade e desenvolvimento para crianças e pré-adolescentes de 7 a 11
            anos completos.
          </p>
        </div>

        {/* Endereço */}
        <div>
          <h3 className="font-serif text-lg font-semibold">Endereço</h3>
          <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-muted">
            <p className="font-medium text-fg/90">{ADDRESS.loja}</p>
            <p>{ADDRESS.street}</p>
            <p>{ADDRESS.district} — {ADDRESS.city} - {ADDRESS.state}</p>
          </address>
          <a
            href={MAPS_SEARCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Ver no Google Maps →
          </a>
        </div>

        {/* Navegação */}
        <div>
          <h3 className="font-serif text-lg font-semibold">Navegação</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li><Link to="/" className="hover:text-primary">Início</Link></li>
            <li><Link to="/sobre" className="hover:text-primary">Sobre</Link></li>
            <li><Link to="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link to="/calendario" className="hover:text-primary">Calendário</Link></li>
            <li><Link to="/contato" className="hover:text-primary">Contato</Link></li>
          </ul>
        </div>

        {/* Conecte-se */}
        <div>
          <h3 className="font-serif text-lg font-semibold">Conecte-se</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                Instagram @{INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <Link to="/contato" className="hover:text-primary">
                Formulário de contato
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-outline">
        <div className="container-wide py-5">
          <p className="text-center text-xs text-muted">
            © {year} Castelo Hernani Vallim Nº 123 · Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
