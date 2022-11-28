import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react';
// import { dependencies } from './package.json';
// import type { BuildOptions } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 3000,
        host: '0.0.0.0',
    },
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
            includeAssets: [
                'index.html',
                'favicon.svg',
                'apple-touch-icon.png',
                'masked-icon.png',
            ],
            manifest: {
                name: 'VinSjo TimeTracker App',
                short_name: 'VS TimeTracker',
                description: 'TimeTracker App',
                theme_color: '#1A1B1E',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    build: { minify: true },
});

// based on: https://sambitsahoo.com/blog/vite-code-splitting-that-works.html
// function getBuildOptions(): BuildOptions {
//     const manualChunks = {
//         vendor: ['react', 'react-dom', 'react-router-dom'],
//     };
//     Object.keys(dependencies).forEach((key) => {
//         if (manualChunks.vendor.includes(key)) return;
//         manualChunks[key] = [key];
//     });
//     return {
//         minify: true,
//         rollupOptions: {
//             output: {
//                 manualChunks,
//             },
//         },
//     };
// }
