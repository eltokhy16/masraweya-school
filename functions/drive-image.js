export async function onRequestGet({ request }) {
  const incoming = new URL(request.url);
  const source = incoming.searchParams.get('url');
  if (!source) return new Response('Missing url', { status: 400 });

  let fileId = '';
  try {
    const u = new URL(source);
    if (u.hostname !== 'drive.google.com' && u.hostname !== 'docs.google.com') {
      return new Response('Only Google Drive URLs are supported', { status: 400 });
    }
    const m = u.pathname.match(/\/file\/d\/([^/]+)/i) || u.pathname.match(/\/d\/([^/]+)/i);
    fileId = m?.[1] || u.searchParams.get('id') || '';
  } catch {
    return new Response('Invalid URL', { status: 400 });
  }
  if (!fileId) return new Response('Google Drive file ID not found', { status: 400 });

  const driveUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
  const res = await fetch(driveUrl, { redirect: 'follow' });
  if (!res.ok) return new Response(`Google Drive returned ${res.status}`, { status: 502 });

  const type = res.headers.get('content-type') || 'application/octet-stream';
  if (!type.startsWith('image/')) {
    return new Response('The Drive file is not an image or is not publicly accessible.', { status: 415 });
  }

  return new Response(res.body, {
    status: 200,
    headers: {
      'Content-Type': type,
      'Cache-Control': 'public, max-age=86400',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
