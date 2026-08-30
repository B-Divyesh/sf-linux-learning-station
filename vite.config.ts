import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const activityIds = ['patterns', 'keys', 'logic', 'spelling', 'numbers', 'drawing'];
const validHtmlPaths = new Set([
  '/', '/demo', '/privacy', '/privacy/', '/terms', '/terms/', '/offline.html', '/404.html',
  ...activityIds.flatMap((id) => [`/activity/${id}`, `/demo/activity/${id}`]),
]);

export default defineConfig({
  plugins: [{
    name: 'preview-invalid-activity-404',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url ?? '/', 'http://preview.local').pathname;
        const acceptsHtml = request.headers.accept?.includes('text/html');
        if (!acceptsHtml || validHtmlPaths.has(pathname)) return next();
        response.statusCode = 404;
        response.setHeader('Content-Type', 'text/html; charset=utf-8');
        response.end(readFileSync(resolve(process.cwd(), 'dist/404.html')));
      });
    },
  }],
  build: {
    target: 'es2022',
    cssCodeSplit: false,
    sourcemap: true,
  },
});
