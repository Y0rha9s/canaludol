import ogs from 'open-graph-scraper';

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: 'URL requerida' }, { status: 400 });
    }

    const { result, error } = await ogs({
      url,
      fetchOptions: {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    });

    if (error) {
      return Response.json({ error: 'No se pudo extraer información' }, { status: 400 });
    }

    const imagen = result.ogImage?.[0]?.url || null;

    return Response.json({
      titulo: result.ogTitle || result.twitterTitle || '',
      descripcion: result.ogDescription || result.twitterDescription || '',
      imagen,
    });

  } catch (e) {
    return Response.json({ error: 'Error al procesar el link' }, { status: 500 });
  }
}