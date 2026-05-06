# Blog do Castelo Hernani Vallim Nº 123

Site institucional + blog + painel administrativo do **Castelo Hernani Vallim Nº 123**, Castelo de Escudeiros da Ordem DeMolay em Cornélio Procópio — PR.

Voltado para crianças e pré-adolescentes de **7 a 11 anos completos** e seus responsáveis.

---

## Stack

- **Frontend:** React 18 + Vite 5
- **Roteamento:** React Router v6
- **Estilização:** TailwindCSS 3 (dark mode obrigatório)
- **Backend:** Supabase (Auth, PostgreSQL, Storage)
- **Conteúdo:** react-markdown + remark-gfm

## Rodar localmente

```bash
npm install
cp .env.example .env.local       # depois edite com suas credenciais do Supabase
npm run dev
```

Acesse em http://localhost:5173.

### Variáveis de ambiente (`.env.local`)

| Variável | Descrição |
|----------|-----------|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave publishable/anon do Supabase |

## Setup do backend (Supabase)

1. Crie um projeto no [Supabase](https://supabase.com).
2. No **SQL Editor**, cole e execute todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql). Cria 4 tabelas, RLS policies e 2 buckets de Storage.
3. Em **Authentication → Providers → Email**, desligue **"Enable email signups"** (só admins criados manualmente conseguem logar).
4. Em **Authentication → Users → Add user**, crie o admin com **e-mail + senha + Auto Confirm ✅**.
5. Copie a `Project URL` e a `anon/publishable key` do Supabase pro `.env.local`.

## Estrutura

```
src/
├── components/      # Layout, UI, admin, blog, calendar
├── pages/
│   ├── public/      # Home, Sobre, Blog, Calendário, Contato, NotFound
│   └── admin/       # Login, Dashboard, Posts, Eventos, Mensagens
├── context/         # Auth, Toast, AdminState
├── hooks/
├── lib/             # supabase, posts, events, contacts, storage, images, cache, seo, etc
└── styles/          # globals.css com Tailwind + tipografia Markdown
```

## Build

```bash
npm run build        # gera dist/
npm run preview      # serve dist/ localmente
```

## Rotas

### Públicas
- `/` — Home
- `/sobre` — Sobre a Ordem DeMolay e o Castelo
- `/blog` — Lista de atividades com filtro por categoria
- `/blog/:slug` — Post individual com galeria + lightbox
- `/calendario` — Próximos eventos + colapsável de eventos passados
- `/contato` — WhatsApp, Instagram, mapa, formulário

### Admin (protegidas)
- `/admin/login`
- `/admin` — Dashboard
- `/admin/posts` (lista, novo, editar, excluir)
- `/admin/eventos` (lista, novo, editar, excluir)
- `/admin/mensagens` (ler, marcar lida/não lida, excluir)

## Deploy

Site estático após `npm run build`. Pode ser publicado em qualquer host de site estático com SPA rewrite:

- **Cloudflare Pages** (recomendado — banda ilimitada no free tier)
- Vercel, Netlify, Render, etc.

Configure as duas env vars no painel do host. Quando publicar, atualize a constante `SITE_URL` em [`src/lib/constants.js`](src/lib/constants.js) e os arquivos [`public/robots.txt`](public/robots.txt) e [`public/sitemap.xml`](public/sitemap.xml) com o domínio real.

## Licença

Projeto proprietário do Castelo Hernani Vallim Nº 123.
