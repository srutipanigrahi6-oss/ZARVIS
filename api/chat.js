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

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'system',
              content: 'You are ZARVIS, a helpful personal AI assistant. Be clear, friendly, concise, and accurate.'
            },
            {
              role: 'user',
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error?.message || 'Groq API request failed.' },
        { status: response.status }
      );
    }

    const reply =
      data.choices?.[0]?.message?.content ||
      'ZARVIS received no response from the AI.';

    return Response.json({
      ok: true,
      reply
    });

  } catch (error) {
    return Response.json(
      { error: 'ZARVIS backend error.' },
      { status: 500 }
    );
  }
}
