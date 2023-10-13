import { defineApplicationConfig } from '@vben/vite-config';

export default defineApplicationConfig({
  overrides: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
      ],
    },
    server: {
      proxy: {
        '/admin-api/bpm': {
          target: 'http://10.8.111.31:48083',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/bpm/`), '/bpm/'),
        },
        '/admin-api/system': {
          target: 'http://10.8.111.231:48080',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/system/`), '/system/'),
        },
        '/admin-api/baseset': {
          target: 'http://10.8.111.31:48085',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/baseset`), '/baseset'),
        },
      },
    },
  },
});
