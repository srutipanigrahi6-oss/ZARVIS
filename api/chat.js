export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json(
      { error: 'ZARVIS backend expects a POST request.' },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();
    const message = String(body.message || '').trim();

    if (!message) {
      return Response.json(
        { error: 'No message received.' },
        { status: 400 }
      );
    }

    return Response.json({
      ok: true,
      reply: `ZARVIS backend received: "${message}"`
    });

  } catch {
    return Response.json(
      { error: 'Invalid request.' },
      { status: 400 }
    );
  }
}
