const KEY = 'lcfc-squad-data';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/squad') {
      if (request.method === 'GET') {
        const data = await env.SQUAD_KV.get(KEY);
        return new Response(data || '{}', {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (request.method === 'POST') {
        const body = await request.text();
        try {
          JSON.parse(body);
        } catch (e) {
          return new Response(JSON.stringify({ error: 'invalid JSON' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        await env.SQUAD_KV.put(KEY, body);
        return new Response(JSON.stringify({ ok: true }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response('Method not allowed', { status: 405 });
    }

    // everything else — serve the static site
    return env.ASSETS.fetch(request);
  }
};
