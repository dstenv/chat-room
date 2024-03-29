import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImportConfig from 'unplugin-auto-import/vite'
// import unocss from 'unocss/vite'
// import { presetUno, presetAttributify, presetIcons } from 'unocss'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        // unocss({
        //     presets: [presetUno(), presetAttributify(), presetIcons()],
        // }),
        AutoImportConfig({
            imports: ['vue', 'vue-router'],
            dts: 'src/auto-import.d.ts',
        }),
    ],

    server: {
        port: 5175,
        proxy: {
            '/api': {
                changeOrigin: true,
                target: 'http://a1.easemob.com',
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/apis': {
                changeOrigin: true,
                target: 'https://a1.easemob.com',
                rewrite: (path) => path.replace(/^\/apis/, ''),
            },
            '/myapi': {
                changeOrigin: true,
                target: '',
                rewrite: (path) => path.replace(/^\/myapi/, ''),
            },
        },
    },

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    base: process.env.NODE_ENV === 'production' ? './' : '/',
})
