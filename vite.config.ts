import { defineConfig } from 'vite';
import { defineApplicationConfig } from '@vben/vite-config';

// 自定义Vite配置
const customConfig = defineConfig({
  build: {
    sourcemap: true, // 关闭sourcemap
  },
});

export default defineApplicationConfig({
  ...customConfig, // 自定义配置
  overrides: {
    build: {
      sourcemap: true, // 关闭sourcemap
    },
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
        '/admin-api/': {
          // target: 'http://139.9.148.32:80',
          target: 'http://10.8.111.203:48080',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/admin-api/`), '/admin-api/'),
        },
      },
    },
  },
});
