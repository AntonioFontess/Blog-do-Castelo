import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

import { Home } from './pages/public/Home';
import { Sobre } from './pages/public/Sobre';
import { Blog } from './pages/public/Blog';
import { PostDetail } from './pages/public/PostDetail';
import { Calendario } from './pages/public/Calendario';
import { Contato } from './pages/public/Contato';
import { NotFound } from './pages/public/NotFound';

import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { PostList } from './pages/admin/PostList';
import { PostForm } from './pages/admin/PostForm';
import { EventList } from './pages/admin/EventList';
import { EventForm } from './pages/admin/EventForm';
import { Mensagens } from './pages/admin/Mensagens';

export default function App() {
  return (
    <Routes>
      {/* Site público */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<PostDetail />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Login do admin (público) */}
      <Route path="/admin/login" element={<Login />} />

      {/* Painel admin (protegido) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/posts" element={<PostList />} />
          <Route path="/admin/posts/novo" element={<PostForm />} />
          <Route path="/admin/posts/editar/:id" element={<PostForm />} />
          <Route path="/admin/eventos" element={<EventList />} />
          <Route path="/admin/eventos/novo" element={<EventForm />} />
          <Route path="/admin/eventos/editar/:id" element={<EventForm />} />
          <Route path="/admin/mensagens" element={<Mensagens />} />
        </Route>
      </Route>
    </Routes>
  );
}
