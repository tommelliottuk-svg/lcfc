const ROUTES = {
  '/api/squad': 'lcfc-squad-data',
  '/api/psr': 'lcfc-psr-data'
};

async function handleKvRoute(request, env, key) {
  if (request.method === 'GET') {
    const data = await env.SQUAD_KV.get(key);
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
    await env.SQUAD_KV.put(key, body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (ROUTES[url.pathname]) {
      return handleKvRoute(request, env, ROUTES[url.pathname]);
    }

    // everything else — serve the static site
    return env.ASSETS.fetch(request);
  }
};
