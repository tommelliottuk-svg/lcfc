// Cloudflare Pages Function — serves at /api/squad
// Requires a KV namespace bound to this project as "SQUAD_KV"
// (Pages dashboard → Settings → Functions → KV namespace bindings)

const KEY = 'lcfc-squad-data';

export async function onRequestGet({ env }) {
  const data = await env.SQUAD_KV.get(KEY);
  return new Response(data || '{}', {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost({ request, env }) {
  const body = await request.text();

  // basic sanity check — reject anything that isn't valid JSON before it hits KV
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
