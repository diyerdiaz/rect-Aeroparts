import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    server: {
      // En desarrollo, /api se redirige al backend para evitar el bloqueo CORS.
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'https://fastapi.inventarios.proyecto.lol',
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
