import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8080;
const CACHE_DIR = path.join(__dirname, 'assets', 'images', 'cache');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer(async (req, res) => {
  // CORS & Permissions
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- Image Caching Proxy Endpoint ---
  if (req.url.startsWith('/api/image-proxy')) {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const targetUrl = parsedUrl.searchParams.get('url');
      if (!targetUrl) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing url parameter');
        return;
      }

      const hash = crypto.createHash('sha256').update(targetUrl).digest('hex').slice(0, 32);
      const extMatch = targetUrl.match(/\.(jpg|jpeg|png|webp|gif)/i);
      const ext = extMatch ? extMatch[0].toLowerCase() : '.jpg';
      const cacheFilePath = path.join(CACHE_DIR, `${hash}${ext}`);

      // Serve from disk cache if exists and not empty
      if (fs.existsSync(cacheFilePath) && fs.statSync(cacheFilePath).size > 1000) {
        const contentType = MIME_TYPES[ext] || 'image/jpeg';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable'
        });
        fs.createReadStream(cacheFilePath).pipe(res);
        return;
      }

      // Fetch with custom educational user-agent to bypass 429
      const remoteRes = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'VoyageTravelApp/1.0 (educational/assignment project; contact@voyage.ai)',
          'Accept': 'image/avif,image/webp,image/apng,image/*,*/*'
        }
      });

      if (!remoteRes.ok) {
        res.writeHead(remoteRes.status, { 'Content-Type': 'text/plain' });
        res.end(`Upstream failed with status ${remoteRes.status}`);
        return;
      }

      const buffer = Buffer.from(await remoteRes.arrayBuffer());
      fs.writeFile(cacheFilePath, buffer, () => {});

      const contentType = remoteRes.headers.get('content-type') || MIME_TYPES[ext] || 'image/jpeg';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable'
      });
      res.end(buffer);
      return;
    } catch (proxyErr) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end(`Proxy error: ${proxyErr.message}`);
      return;
    }
  }

  // --- Static Files ---
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';

  const safePath = path.normalize(reqUrl).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Voyage Travel App Server running with Image Proxy at http://localhost:${PORT}/`);
});
