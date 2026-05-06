// Constantes globais do site. Centralizadas pra que mudar número/endereço
// signifique editar APENAS este arquivo.

// ----- Identidade ---------------------------------------------------------
export const SITE_NAME = 'Castelo Hernani Vallim Nº 123';
export const SITE_TAGLINE = 'Castelo de Escudeiros — Ordem DeMolay';
export const SITE_DESCRIPTION =
  'Castelo de Escudeiros da Ordem DeMolay em Cornélio Procópio-PR. Liderança, fraternidade e desenvolvimento para crianças e pré-adolescentes de 7 a 11 anos completos.';

// URL pública base (atualize quando publicar). Usada em sitemap e canonical.
export const SITE_URL = 'https://castelohernanivallim.com.br';

// ----- Contato ------------------------------------------------------------
export const WHATSAPP_NUMBER = '5543998425308';
export const WHATSAPP_DEFAULT_MESSAGE =
  'Olá! Tenho interesse em conhecer o Castelo Hernani Vallim';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_DEFAULT_MESSAGE
)}`;

export const INSTAGRAM_HANDLE = 'hernani_vallim';
export const INSTAGRAM_LINK = `https://instagram.com/${INSTAGRAM_HANDLE}`;

// ----- Endereço -----------------------------------------------------------
export const ADDRESS = Object.freeze({
  loja: 'Loja Cavaleiro de Malta nº 7',
  street: 'Rua João Cabral de Medeiros, 278',
  district: 'Centro',
  city: 'Cornélio Procópio',
  state: 'PR',
  full: 'Rua João Cabral de Medeiros, 278, Centro, Cornélio Procópio - PR',
});

const MAPS_QUERY = encodeURIComponent(ADDRESS.full);
export const MAPS_EMBED_URL = `https://maps.google.com/maps?q=${MAPS_QUERY}&hl=pt&z=16&output=embed`;
export const MAPS_SEARCH_URL = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;
