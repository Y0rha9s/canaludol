'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import RedCarousel from '@/components/RedCarousel';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    noticias: 0,
    mensajes: 0,
    noLeidos: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchStats = async () => {
      const { count: noticiasCount } = await supabase
        .from('noticias')
        .select('*', { count: 'exact', head: true });

      const { count: mensajesCount } = await supabase
        .from('mensajes_contacto')
        .select('*', { count: 'exact', head: true });

      const { count: noLeidosCount } = await supabase
        .from('mensajes_contacto')
        .select('*', { count: 'exact', head: true })
        .eq('leido', false);

      setStats({
        noticias: noticiasCount || 0,
        mensajes: mensajesCount || 0,
        noLeidos: noLeidosCount || 0,
      });
    };

    fetchStats();
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  const cards = [
    {
      href: '/admin/dashboard/noticias',
      color: 'bg-blue-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      ),
      titulo: 'Noticias',
      desc: `${stats.noticias} noticia${stats.noticias !== 1 ? 's' : ''} publicada${stats.noticias !== 1 ? 's' : ''}`,
      accion: 'Gestionar',
      accionColor: 'text-blue-600',
    },
    {
      href: '/admin/dashboard/en-vivo',
      color: 'bg-red-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      ),
      titulo: 'Señal en Vivo',
      desc: 'Configurar URL del stream',
      accion: 'Configurar',
      accionColor: 'text-red-600',
    },
    {
      href: '/admin/dashboard/mensajes',
      color: stats.noLeidos > 0 ? 'bg-yellow-500' : 'bg-green-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
      titulo: 'Mensajes',
      desc: stats.noLeidos > 0
        ? `${stats.noLeidos} sin leer de ${stats.mensajes} total`
        : `${stats.mensajes} mensaje${stats.mensajes !== 1 ? 's' : ''} recibido${stats.mensajes !== 1 ? 's' : ''}`,
      accion: 'Ver mensajes',
      accionColor: stats.noLeidos > 0 ? 'text-yellow-600' : 'text-green-600',
      badge: stats.noLeidos > 0 ? stats.noLeidos : null,
    },
    {
      href: '/',
      color: 'bg-purple-600',
      external: true,
      icon: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      ),
      titulo: 'Vista Previa',
      desc: 'Ver el sitio público',
      accion: 'Abrir sitio',
      accionColor: 'text-purple-600',
    },
    {
      href: '/admin/dashboard/colaboradores',
      color: 'bg-indigo-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      ),
      titulo: 'Colaboradores',
      desc: 'Gestiona el equipo del canal',
      accion: 'Gestionar',
      accionColor: 'text-indigo-600',
    },
    {
      href: '/admin/dashboard/aliados',
      color: 'bg-teal-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
      titulo: 'Nuestra Red',
      desc: 'Carrusel de aliados e imágenes',
      accion: 'Gestionar',
      accionColor: 'text-teal-600',
    },
    {
      href: '/admin/dashboard/programacion',
      color: 'bg-orange-600',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      ),
      titulo: 'Programación',
      desc: 'Horarios de los programas',
      accion: 'Gestionar',
      accionColor: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-500 mt-1">Canal Udol</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm">Hola, {session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => {
            const Wrapper = card.external ? 'a' : Link;
            const extraProps = card.external ? { href: '/', target: '_blank', rel: 'noopener noreferrer' } : { href: card.href };

            return (
              <Wrapper key={card.titulo} {...extraProps}>
                <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer group relative">
                  {card.badge && (
                    <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {card.badge}
                    </span>
                  )}
                  <div className={`w-14 h-14 ${card.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {card.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{card.titulo}</h3>
                  <p className="text-gray-500 text-sm mb-3">{card.desc}</p>
                  <div className={`${card.accionColor} font-semibold text-sm group-hover:translate-x-1 transition-transform inline-block`}>
                    {card.accion} →
                  </div>
                </div>
              </Wrapper>
            );
          })}
        </div>

        {/* Accesos rápidos */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link
              href="/admin/dashboard/noticias"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Nueva Noticia</div>
                <div className="text-xs text-gray-500">Publicar contenido nuevo</div>
              </div>
            </Link>

            <Link
              href="/admin/dashboard/en-vivo"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Señal en Vivo</div>
                <div className="text-xs text-gray-500">Actualizar URL del stream</div>
              </div>
            </Link>

            <Link
              href="/admin/dashboard/mensajes"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Mensajes</div>
                <div className="text-xs text-gray-500">Ver consultas recibidas</div>
              </div>
            </Link>

            <Link
              href="/admin/dashboard/programacion"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm">Programación</div>
                <div className="text-xs text-gray-500">Agregar o editar horarios</div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}