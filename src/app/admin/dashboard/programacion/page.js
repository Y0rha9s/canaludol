'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { DIAS, minutosDesdeLas6 } from '@/lib/programacion';

const FORM_VACIO = {
  nombre: '',
  dias: [],
  hora_inicio: '',
  hora_fin: '',
  conductor: '',
  activo: true,
};

export default function AdminProgramacion() {
  const { status } = useSession();
  const router = useRouter();
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState(FORM_VACIO);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') cargar();
  }, [status]);

  const cargar = async () => {
    setLoading(true);
    const { data } = await supabase.from('programacion').select('*');
    const ordenados = (data || []).sort((a, b) => {
      const diaDiff = DIAS.indexOf(a.dia) - DIAS.indexOf(b.dia);
      if (diaDiff !== 0) return diaDiff;
      return minutosDesdeLas6(a.hora_inicio) - minutosDesdeLas6(b.hora_inicio);
    });
    setProgramas(ordenados);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleDiaToggle = (dia) => {
    setFormData((f) => {
      if (editando) return { ...f, dias: [dia] };
      const dias = f.dias.includes(dia) ? f.dias.filter((d) => d !== dia) : [...f.dias, dia];
      return { ...f, dias };
    });
  };

  const handleEditar = (p) => {
    setEditando(p.id);
    setFormData({
      nombre: p.nombre,
      dias: [p.dia],
      hora_inicio: p.hora_inicio,
      hora_fin: p.hora_fin || '',
      conductor: p.conductor || '',
      activo: p.activo,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelar = () => {
    setEditando(null);
    setFormData(FORM_VACIO);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.dias.length === 0) {
      setError('Selecciona al menos un día');
      return;
    }
    setSaving(true);
    setError('');

    const payload = {
      nombre: formData.nombre,
      hora_inicio: formData.hora_inicio,
      hora_fin: formData.hora_fin || null,
      conductor: formData.conductor || null,
      activo: formData.activo,
    };

    let err;
    if (editando) {
      ({ error: err } = await supabase
        .from('programacion')
        .update({ ...payload, dia: formData.dias[0] })
        .eq('id', editando));
    } else {
      const filas = formData.dias.map((dia) => ({ ...payload, dia }));
      ({ error: err } = await supabase.from('programacion').insert(filas));
    }

    setSaving(false);
    if (err) { setError('No se pudo guardar'); return; }

    handleCancelar();
    await cargar();
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este programa?')) return;
    await supabase.from('programacion').delete().eq('id', id);
    await cargar();
  };

  const handleToggleActivo = async (p) => {
    await supabase.from('programacion').update({ activo: !p.activo }).eq('id', p.id);
    await cargar();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Programación</h1>
            <p className="text-gray-500 mt-1">Gestiona los horarios de los programas.</p>
          </div>
          <Link href="/admin/dashboard" className="text-blue-600 hover:text-blue-800 text-sm">
            ← Volver al Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulario */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {editando ? 'Editar programa' : 'Agregar programa'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del programa *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Ej: Noticiero Udol, Late Show"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conductor</label>
              <input
                type="text"
                name="conductor"
                value={formData.conductor}
                onChange={handleChange}
                placeholder="Opcional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de inicio *</label>
              <input
                type="time"
                name="hora_inicio"
                value={formData.hora_inicio}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
              <p className="text-xs text-gray-400 mt-1">Horario permitido: 06:00 a 02:00 (del día siguiente)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hora de término</label>
              <input
                type="time"
                name="hora_fin"
                value={formData.hora_fin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
              />
              <p className="text-xs text-gray-400 mt-1">Opcional. Ej: Late Show 22:00 a 01:00</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editando ? 'Día' : 'Días *'}
              </label>
              <div className="flex flex-wrap gap-2">
                {DIAS.map((dia) => {
                  const activo = formData.dias.includes(dia);
                  return (
                    <button
                      key={dia}
                      type="button"
                      onClick={() => handleDiaToggle(dia)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        activo
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {dia}
                    </button>
                  );
                })}
              </div>
              {!editando && (
                <p className="text-xs text-gray-400 mt-2">
                  Puedes seleccionar varios días para crear el mismo programa en cada uno (ej: Lunes, Miércoles y Viernes).
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                id="activo"
                type="checkbox"
                name="activo"
                checked={formData.activo}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="activo" className="text-sm text-gray-700">
                Visible en el sitio
              </label>
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              {editando && (
                <button
                  type="button"
                  onClick={handleCancelar}
                  className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
              >
                {saving ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar programa'}
              </button>
            </div>
          </form>
        </section>

        {/* Lista */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Programas ({programas.length})
          </h2>
          {programas.length === 0 ? (
            <p className="text-gray-500 text-sm">No hay programas aún.</p>
          ) : (
            <div className="space-y-3">
              {programas.map((p) => (
                <div key={p.id} className="flex items-center gap-4 border border-gray-200 rounded-xl px-4 py-3">
                  <div className="w-16 shrink-0 text-center">
                    <div className="text-xs font-bold text-blue-600 uppercase">{p.dia}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800">{p.nombre}</div>
                    <div className="text-xs text-gray-400">
                      {p.hora_inicio}{p.hora_fin ? ` - ${p.hora_fin}` : ''} hrs
                      {p.conductor ? ` · Con ${p.conductor}` : ''}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleToggleActivo(p)}
                      className={`text-xs px-3 py-1 rounded-lg transition ${
                        p.activo ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {p.activo ? 'Visible' : 'Oculto'}
                    </button>
                    <button
                      onClick={() => handleEditar(p)}
                      className="text-xs px-3 py-1 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(p.id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
