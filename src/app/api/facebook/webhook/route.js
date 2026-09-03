import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'crypto';

export const runtime = 'nodejs';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

function esSecretoValido(recibido) {
  const esperado = process.env.MAKE_WEBHOOK_SECRET;
  if (!esperado || !recibido) return false;

  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

export async function POST(request) {
  const secreto = request.headers.get('x-webhook-secret');
  if (!esSecretoValido(secreto)) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const payload = {
      titulo: body.message ? body.message.slice(0, 100) : 'Publicación de Facebook',
      descripcion: body.message || '',
      contenido: body.message || '',
      imagen_url: body.full_picture || null,
      categoria: 'Compartidas',
      destacada: false,
      publicada: true,
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { error } = await supabaseAdmin.from('noticias').insert(payload);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
