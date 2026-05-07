export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: 'URL requerida' }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const html = await res.text();

    const getMeta = (property) => {
      const match = html.match(new RegExp(`<meta[^>]*(?:property|name)=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'))
        || html.match(new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`, 'i'));
      return match?.[1] || null;
    };

    const titulo = getMeta('og:title') || getMeta('twitter:title') || '';
    const descripcion = getMeta('og:description') || getMeta('twitter:description') || '';
    const imagen = getMeta('og:image') || getMeta('twitter:image') || null;

    return Response.json({ titulo, descripcion, imagen });

  } catch (e) {
    return Response.json({ error: 'No se pudo extraer la noticia' }, { status: 500 });
  }
}