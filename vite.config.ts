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
        // '/admin-api/': {
        //   target: 'http://10.8.111.231:48080',
        //   changeOrigin: true,
        //   ws: true,
        //   rewrite: (path) => path.replace(new RegExp(`^/admin-api/`), '/admin-api/'),
        // },
        '/admin-api/': {
          target: 'http://10.8.111.203:48080',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/admin-api/`), '/admin-api/'),
        },
      },
    },
  },
});
