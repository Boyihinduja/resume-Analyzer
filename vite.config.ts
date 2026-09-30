import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';

function n8nApiPlugin(): Plugin {
  return {
    name: 'n8n-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/n8n-health') {
          try {
            const resp = await fetch('https://hinduja07.app.n8n.cloud/form/46912cc0-c8e4-4582-a683-9210114dc4f7', {
              method: 'GET',
            });
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                status: resp.status,
                ok: resp.ok,
                url: 'https://hinduja07.app.n8n.cloud/form/46912cc0-c8e4-4582-a683-9210114dc4f7',
                timestamp: new Date().toISOString(),
              })
            );
          } catch (e: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: e?.message || 'Failed to ping n8n' }));
          }
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), n8nApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api/submit-resume': {
          target: 'https://hinduja07.app.n8n.cloud',
          changeOrigin: true,
          secure: true,
          rewrite: () => '/form/46912cc0-c8e4-4582-a683-9210114dc4f7',
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
