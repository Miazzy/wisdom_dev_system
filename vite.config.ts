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
        '/admin-api/bpm/': {
          target: 'http://10.8.111.231:48081',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/admin-api/bpm`), '/admin-api/bpm'),
        },
        '/base': {
          target: 'http://localhost:48083',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/base`), '/base'),
        },
        '/admin-api/system/auth': {
          target: 'http://10.8.111.231:48081',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/admin-api`), '/admin-api'),
        },
        '/scomms-po': {
          target: 'http://10.8.111.173:48085',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/scomms-po`), '/scomms-po'),
        },
        '/jw': {
          target: 'https://ygyt.ygwl.net',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/jw`), '/jw'),
        },
        '/basic-api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/basic-api`), ''),
        },
        '/upload': {
          target: 'http://localhost:3300/upload',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/upload`), ''),
        },
      },
    },
  },
});
