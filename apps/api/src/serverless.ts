import type { IncomingMessage, ServerResponse } from 'http';

import { createApp } from './app';

const app = createApp();
const callback = app.callback();

function normalizeRewriteUrl(req: IncomingMessage) {
  if (!req.url) return;

  const url = new URL(req.url, 'http://vercel.local');
  const rewritePath = url.searchParams.get('path');
  if (!rewritePath) return;

  url.searchParams.delete('path');
  const normalizedPath = `/${rewritePath.replace(/^\/+/, '')}`;
  const query = url.searchParams.toString();
  req.url = query ? `${normalizedPath}?${query}` : normalizedPath;
}

export function handler(req: IncomingMessage, res: ServerResponse) {
  normalizeRewriteUrl(req);
  return callback(req, res);
}

export default handler;
