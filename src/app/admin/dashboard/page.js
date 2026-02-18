'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    noticias: 0,
    carrusel: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: noticiasCount } = await supabase
        .from('noticias')
        .select('*', { count: 'exact', head: true });
      
      const { count: carruselCount } = await supabase
        .from('carrusel_principal')
        .select('*', { count: 'exact', head: true });
      
      setStats({
        noticias: noticiasCount || 0,
        carrusel: carruselCount || 0
      });
    };

    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600 mt-1">Canal Udol</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hola, {session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Card: Gestionar Carrusel Principal */}
          <Link href="/admin/dashboard/carrusel">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Carrusel Principal</h3>
              <p className="text-gray-600 mb-3">Editar las {stats.carrusel} slides del inicio</p>
              <div className="text-blue-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Gestionar →
              </div>
            </div>
          </Link>

          {/* Card: Gestionar Noticias */}
          <Link href="/admin/dashboard/noticias">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Noticias</h3>
              <p className="text-gray-600 mb-3">{stats.noticias} noticias publicadas</p>
              <div className="text-green-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Gestionar →
              </div>
            </div>
          </Link>

          {/* Card: Vista Previa */}
          <a href="/" target="_blank" rel="noopener noreferrer">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Vista Previa</h3>
              <p className="text-gray-600 mb-3">Ver el sitio público</p>
              <div className="text-purple-600 font-semibold group-hover:translate-x-2 transition-transform inline-block">
                Abrir sitio →
              </div>
            </div>
          </a>

        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Accesos Rápidos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/admin/dashboard/noticias" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Nueva Noticia</div>
                <div className="text-sm text-gray-600">Publicar contenido nuevo</div>
              </div>
            </Link>

            <Link href="/admin/dashboard/carrusel" className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-gray-800">Editar Carrusel</div>
                <div className="text-sm text-gray-600">Modificar slides del inicio</div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}